import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  AppState, ActiveModule, SurveillanceTicket, LabSample,
  IncidentEvent, MapMarker, GeoPolygon, TicketStatus
} from '../types';
import {
  SEED_TICKETS, SEED_FARMERS, SEED_SAMPLES, SEED_INCIDENTS,
  SEED_MARKERS, SEED_ZONES, SEED_WEATHER, computeKPI
} from '../data/seed';

// ─── Action Types ──────────────────────────────────────────
type Action =
  | { type: 'SET_MODULE'; payload: ActiveModule }
  | { type: 'ADD_TICKET'; payload: SurveillanceTicket }
  | { type: 'UPDATE_TICKET'; payload: { id: string; updates: Partial<SurveillanceTicket> } }
  | { type: 'ADD_SAMPLE'; payload: LabSample }
  | { type: 'UPDATE_SAMPLE'; payload: { id: string; updates: Partial<LabSample> } }
  | { type: 'ADD_INCIDENT'; payload: IncidentEvent }
  | { type: 'ADD_MARKER'; payload: MapMarker }
  | { type: 'REMOVE_MARKER'; payload: string }
  | { type: 'ADD_ZONE'; payload: GeoPolygon }
  | { type: 'CONFIRM_OUTBREAK'; payload: { ticketId: string; sampleId: string; disease: string } }
  | { type: 'APPEND_TO_TICKET'; payload: { ticketId: string; notes: string[] } };

// ─── Initial State ─────────────────────────────────────────
const initialState: AppState = {
  activeModule: 'warroom',
  tickets: SEED_TICKETS,
  farmers: SEED_FARMERS,
  samples: SEED_SAMPLES,
  incidents: SEED_INCIDENTS,
  markers: SEED_MARKERS,
  zones: SEED_ZONES,
  weather: SEED_WEATHER,
  kpi: computeKPI(SEED_TICKETS, SEED_SAMPLES),
  systemStatus: {
    nationalNode: true,
    gateway: true,
    syncPending: 0,
  },
};

// ─── Reducer ───────────────────────────────────────────────
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODULE':
      return { ...state, activeModule: action.payload };

    case 'ADD_TICKET': {
      const tickets = [...state.tickets, action.payload];
      return { ...state, tickets, kpi: computeKPI(tickets, state.samples) };
    }

    case 'UPDATE_TICKET': {
      const tickets = state.tickets.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
      );
      return { ...state, tickets, kpi: computeKPI(tickets, state.samples) };
    }

    case 'ADD_SAMPLE': {
      const samples = [...state.samples, action.payload];
      return { ...state, samples, kpi: computeKPI(state.tickets, samples) };
    }

    case 'UPDATE_SAMPLE': {
      const samples = state.samples.map(s =>
        s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
      );
      return { ...state, samples, kpi: computeKPI(state.tickets, samples) };
    }

    case 'ADD_INCIDENT':
      return { ...state, incidents: [action.payload, ...state.incidents] };

    case 'ADD_MARKER':
      return { ...state, markers: [...state.markers, action.payload] };

    case 'REMOVE_MARKER':
      return { ...state, markers: state.markers.filter(m => m.id !== action.payload) };

    case 'ADD_ZONE':
      return { ...state, zones: [...state.zones, action.payload] };

    case 'CONFIRM_OUTBREAK': {
      const { ticketId, sampleId } = action.payload;
      const tickets = state.tickets.map(t =>
        t.id === ticketId
          ? { ...t, status: 'CONFIRMED_OUTBREAK' as TicketStatus, riskLevel: 'CRITICAL' as const, updatedAt: new Date().toISOString() }
          : t
      );
      const samples = state.samples.map(s =>
        s.id === sampleId
          ? { ...s, status: 'CONFIRMED_POSITIVE' as const, result: `Positive - ${action.payload.disease}`, resultDate: new Date().toISOString() }
          : s
      );
      const ticket = tickets.find(t => t.id === ticketId);
      let markers = state.markers;
      let zones = state.zones;
      if (ticket) {
        const existingMarker = markers.find(m => m.ticketId === ticketId);
        if (existingMarker) {
          markers = markers.map(m =>
            m.ticketId === ticketId ? { ...m, type: 'OUTBREAK' as const, pulsing: true, label: `${ticket.disease} Outbreak - ${ticket.village}` } : m
          );
        } else {
          markers = [...markers, {
            id: `MRK-${Date.now()}`,
            position: ticket.location,
            type: 'OUTBREAK',
            label: `${ticket.disease} Outbreak - ${ticket.village}`,
            details: `Confirmed ${ticket.disease} | ${ticket.affectedAnimals} animals`,
            ticketId: ticket.id,
            pulsing: true,
          }];
        }
        zones = [
          ...zones,
          {
            id: `ZONE-${Date.now()}-R`, type: 'RED_EPICENTER',
            center: ticket.location, radiusKm: 5,
            label: `${ticket.disease} Epicenter - ${ticket.village}`,
            isActive: true, linkedTicketId: ticketId,
          },
          {
            id: `ZONE-${Date.now()}-Y`, type: 'YELLOW_BUFFER',
            center: ticket.location, radiusKm: 15,
            label: `${ticket.disease} Buffer - ${ticket.village}`,
            isActive: true, linkedTicketId: ticketId,
          },
        ];
      }
      const incident: IncidentEvent = {
        id: `INC-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'LAB_UPDATE',
        title: `OUTBREAK CONFIRMED: ${action.payload.disease}`,
        description: `Lab result positive. Ticket ${ticket?.ticketNumber} upgraded to CONFIRMED OUTBREAK. Red containment zone activated.`,
        block: ticket?.block || '',
        riskLevel: 'CRITICAL',
        ticketId,
      };
      return {
        ...state,
        tickets,
        samples,
        markers,
        zones,
        incidents: [incident, ...state.incidents],
        kpi: computeKPI(tickets, samples),
      };
    }

    case 'APPEND_TO_TICKET': {
      const tickets = state.tickets.map(t =>
        t.id === action.payload.ticketId
          ? { ...t, notes: [...t.notes, ...action.payload.notes], updatedAt: new Date().toISOString() }
          : t
      );
      return { ...state, tickets };
    }

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  setModule: (m: ActiveModule) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const setModule = useCallback((m: ActiveModule) => dispatch({ type: 'SET_MODULE', payload: m }), []);
  return (
    <AppContext.Provider value={{ state, dispatch, setModule }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
