// ─── Core Enums ────────────────────────────────────────────
export type DiseaseType = 'FMD' | 'LSD' | 'HS' | 'Anthrax' | 'Brucellosis';
export type TicketStatus = 'CONFIRMED_OUTBREAK' | 'SUSPICIOUS_TRIAGE' | 'UNDER_INVESTIGATION' | 'VERIFIED_RESOLVED' | 'PENDING_LAB';
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'ROUTINE';
export type SampleStatus = 'IN_TRANSIT' | 'RECEIVED' | 'PROCESSING' | 'CONFIRMED_POSITIVE' | 'CONFIRMED_NEGATIVE';
export type SampleType = 'Blood' | 'Swab' | 'Tissue' | 'Serum';
export type ZoneType = 'RED_EPICENTER' | 'YELLOW_BUFFER' | 'GREEN_SAFE';
export type ActiveModule = 'warroom' | 'field' | 'lab';

// ─── Geo Types ─────────────────────────────────────────────
export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeoPolygon {
  id: string;
  type: ZoneType;
  center: LatLng;
  radiusKm: number;
  label: string;
  isActive: boolean;
  linkedTicketId: string;
}

// ─── Administrative ────────────────────────────────────────
export interface Block {
  id: string;
  name: string;
  district: string;
  state: string;
  center: LatLng;
}

// ─── Farmer & Livestock ────────────────────────────────────
export interface LivestockEntry {
  pashuAadhaar: string; // 12-digit ear tag
  species: 'Cattle' | 'Buffalo' | 'Goat' | 'Sheep' | 'Poultry';
  breed: string;
  age: string;
  sex: 'Male' | 'Female';
  vaccinationStatus: string;
}

export interface FarmerProfile {
  farmerId: string; // e.g., FID-7739201
  name: string;
  phone: string;
  village: string;
  block: string;
  district: string;
  registeredLivestock: LivestockEntry[];
  location: LatLng;
}

// ─── Surveillance Tickets ──────────────────────────────────
export interface SurveillanceTicket {
  id: string;
  ticketNumber: string;
  farmerId: string;
  farmerName: string;
  village: string;
  block: string;
  district: string;
  location: LatLng;
  disease: DiseaseType;
  status: TicketStatus;
  riskLevel: RiskLevel;
  isZoonotic: boolean;
  symptoms: string[];
  reportedAt: string;
  updatedAt: string;
  aiConfidence: number;
  aiDetectedCondition: string;
  imageUrl?: string;
  assignedParaVet: string;
  affectedAnimals: number;
  totalHerd: number;
  pashuAadhaarTags: string[];
  riskScore: number;
  weatherFactor: number;
  historicalPrecedent: number;
  linkedSampleIds: string[];
  notes: string[];
  parentTicketId?: string;
}

// ─── Lab Samples ───────────────────────────────────────────
export interface LabSample {
  id: string;
  sampleId: string;
  ticketId: string;
  ticketNumber: string;
  sampleType: SampleType;
  collectedBy: string;
  collectedAt: string;
  originFarmer: string;
  originVillage: string;
  originBlock: string;
  pashuAadhaar: string;
  status: SampleStatus;
  labName: string;
  qrCode: string;
  result?: string;
  resultDate?: string;
  disease?: DiseaseType;
  chainOfCustody: CustodyEntry[];
}

export interface CustodyEntry {
  timestamp: string;
  handler: string;
  action: string;
  location: string;
  temperature?: string;
}

// ─── Incident Stream ───────────────────────────────────────
export interface IncidentEvent {
  id: string;
  timestamp: string;
  type: 'REPORT' | 'TRIAGE' | 'LAB_UPDATE' | 'ESCALATION' | 'DISPATCH' | 'RESOLVED';
  title: string;
  description: string;
  block: string;
  riskLevel: RiskLevel;
  ticketId: string;
}

// ─── Map Markers ───────────────────────────────────────────
export interface MapMarker {
  id: string;
  position: LatLng;
  type: 'OUTBREAK' | 'SUSPICIOUS' | 'HEALTHY' | 'LAB' | 'DISPENSARY';
  label: string;
  details: string;
  ticketId?: string;
  pulsing?: boolean;
}

// ─── Weather ───────────────────────────────────────────────
export interface WeatherData {
  rainfall: number;
  humidity: number;
  soilMoisture: string;
  temperature: number;
  season: string;
  riskMultiplier: number;
}

// ─── KPI Metrics ───────────────────────────────────────────
export interface KPIMetrics {
  activeEpidemics: number;
  suspectedTriageCases: number;
  zoonoticAlerts: number;
  vaccineColdChainLevel: number;
  totalReportsToday: number;
  pendingSamples: number;
  resolvedThisWeek: number;
}

// ─── Vaccine Dispatch ──────────────────────────────────────
export interface VaccineDispatchOrder {
  id: string;
  disease: DiseaseType;
  targetBlock: string;
  targetRadius: number;
  estimatedDoses: number;
  herdCensus: number;
  dispatchedAt: string;
  status: 'COMPUTING' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED';
  coldChainTemp: string;
}

// ─── IVR Alert ─────────────────────────────────────────────
export interface IVRAlert {
  id: string;
  targetRadius: number;
  recipientCount: number;
  language: string;
  message: string;
  status: 'PENDING' | 'BROADCASTING' | 'COMPLETED';
  triggeredAt: string;
  centerPoint: LatLng;
}

// ─── One Health Escalation ─────────────────────────────────
export interface OneHealthEscalation {
  id: string;
  ticketId: string;
  disease: DiseaseType;
  escalatedTo: string;
  escalatedAt: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'ACTIVE_RESPONSE';
  humanCasesSuspected: number;
  contactTracing: boolean;
}

// ─── WhatsApp Message ──────────────────────────────────────
export interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'system';
  imageUrl?: string;
  isHindi?: boolean;
}

// ─── App State ─────────────────────────────────────────────
export interface AppState {
  activeModule: ActiveModule;
  tickets: SurveillanceTicket[];
  farmers: FarmerProfile[];
  samples: LabSample[];
  incidents: IncidentEvent[];
  markers: MapMarker[];
  zones: GeoPolygon[];
  weather: WeatherData;
  kpi: KPIMetrics;
  systemStatus: {
    nationalNode: boolean;
    gateway: boolean;
    syncPending: number;
  };
}
