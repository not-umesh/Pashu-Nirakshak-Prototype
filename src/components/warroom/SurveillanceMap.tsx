import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAppState } from '../../store/AppContext';
import { zoneStyle, statusBadge, formatTimestamp } from '../../utils/helpers';
import { Layers, Cloud, History, BarChart3, Eye, EyeOff } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

function createIcon(type: string): L.DivIcon {
  const cls: Record<string, string> = {
    OUTBREAK: 'marker-outbreak',
    SUSPICIOUS: 'marker-suspicious',
    HEALTHY: 'marker-healthy',
    LAB: 'marker-lab',
    DISPENSARY: 'marker-dispensary',
  };
  return L.divIcon({
    className: cls[type] || 'marker-healthy',
    iconSize: type === 'OUTBREAK' ? [16, 16] : type === 'SUSPICIOUS' ? [14, 14] : [12, 12],
    iconAnchor: type === 'OUTBREAK' ? [8, 8] : type === 'SUSPICIOUS' ? [7, 7] : [6, 6],
  });
}

function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-lg p-3 text-[10px]">
      <div className="font-semibold text-slate-300 mb-2 tracking-wide text-[9px] uppercase">Map Legend</div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse-red" />
          <span className="text-slate-400">Confirmed Outbreak</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-400">AI Triage Suspicion</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-70" />
          <span className="text-slate-400">Routine / Healthy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500" />
          <span className="text-slate-400">Diagnostic Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rotate-45" />
          <span className="text-slate-400">Veterinary Dispensary</span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 rounded-sm bg-red-500/30 border border-red-500/50" />
            <span className="text-slate-400">Red Zone (0-5 km)</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-2 rounded-sm bg-amber-500/20 border border-amber-500/40" />
            <span className="text-slate-400">Buffer Zone (5-15 km)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SurveillanceMap() {
  const { state } = useAppState();
  const { markers, zones, tickets } = state;

  const [layers, setLayers] = useState({
    zones: true,
    outbreaks: true,
    suspicious: true,
    healthy: true,
    labs: true,
    weather: false,
    historical: false,
    density: false,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredMarkers = useMemo(() => {
    return markers.filter(m => {
      if (m.type === 'OUTBREAK' && !layers.outbreaks) return false;
      if (m.type === 'SUSPICIOUS' && !layers.suspicious) return false;
      if (m.type === 'HEALTHY' && !layers.healthy) return false;
      if ((m.type === 'LAB' || m.type === 'DISPENSARY') && !layers.labs) return false;
      return true;
    });
  }, [markers, layers]);

  const activeZones = useMemo(() => {
    return layers.zones ? zones.filter(z => z.isActive) : [];
  }, [zones, layers.zones]);

  const center: [number, number] = [21.22, 81.75];

  return (
    <div className="relative flex-1 h-full">
      <MapContainer
        center={center}
        zoom={10}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={19}
        />

        {/* Weather overlay */}
        {layers.weather && (
          <TileLayer
            url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo"
            opacity={0.4}
            maxZoom={19}
          />
        )}

        {/* Containment Zones */}
        {activeZones.map(zone => {
          const style = zoneStyle(zone.type);
          return (
            <Circle
              key={zone.id}
              center={[zone.center.lat, zone.center.lng]}
              radius={zone.radiusKm * 1000}
              pathOptions={{
                color: style.color,
                fillColor: style.fillColor,
                fillOpacity: style.fillOpacity,
                weight: 2,
                dashArray: zone.type === 'YELLOW_BUFFER' ? '8, 6' : undefined,
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-bold text-xs mb-1">{zone.label}</div>
                  <div className="text-[10px] text-slate-400">
                    Radius: {zone.radiusKm} km | {zone.type === 'RED_EPICENTER' ? 'Bio-Containment Perimeter' : 'Ring-Vaccination Priority Zone'}
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Historical Risk Hotspots overlay */}
        {layers.historical && (
          <>
            <Circle center={[21.20, 81.97]} radius={8000} pathOptions={{ color: '#7C3AED', fillColor: '#7C3AED', fillOpacity: 0.08, weight: 1, dashArray: '4, 4' }}>
              <Popup><div className="text-[11px]"><strong>NADRES 5-Year Hotspot</strong><br/>FMD recurrence zone (2021-2025)<br/>8 outbreaks recorded</div></Popup>
            </Circle>
            <Circle center={[21.25, 81.43]} radius={6000} pathOptions={{ color: '#7C3AED', fillColor: '#7C3AED', fillOpacity: 0.06, weight: 1, dashArray: '4, 4' }}>
              <Popup><div className="text-[11px]"><strong>NADRES 5-Year Hotspot</strong><br/>Anthrax endemic pocket (2019-2024)<br/>3 outbreaks, 1 zoonotic event</div></Popup>
            </Circle>
          </>
        )}

        {/* Livestock Density Heatmap overlay */}
        {layers.density && (
          <>
            {[
              { center: [21.19, 81.97] as [number, number], r: 5000, op: 0.12 },
              { center: [21.11, 81.73] as [number, number], r: 7000, op: 0.10 },
              { center: [21.32, 81.67] as [number, number], r: 6000, op: 0.08 },
              { center: [21.25, 81.42] as [number, number], r: 4000, op: 0.09 },
            ].map((d, i) => (
              <Circle key={`density-${i}`} center={d.center} radius={d.r} pathOptions={{ color: 'transparent', fillColor: '#10B981', fillOpacity: d.op, weight: 0 }} />
            ))}
          </>
        )}

        {/* Markers */}
        {filteredMarkers.map(m => {
          const ticket = tickets.find(t => t.id === m.ticketId);
          return (
            <Marker
              key={m.id}
              position={[m.position.lat, m.position.lng]}
              icon={createIcon(m.type)}
            >
              <Popup maxWidth={320}>
                <div className="min-w-[260px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${m.type === 'OUTBREAK' ? 'bg-red-500' : m.type === 'SUSPICIOUS' ? 'bg-amber-500' : m.type === 'LAB' ? 'bg-purple-500' : m.type === 'DISPENSARY' ? 'bg-cyan-500' : 'bg-emerald-500'}`} />
                    <span className="font-bold text-xs">{m.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">{m.details}</p>
                  {ticket && (
                    <div className="space-y-1 text-[10px] border-t border-slate-600 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ticket</span>
                        <span className="font-mono text-slate-300">{ticket.ticketNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${statusBadge(ticket.status).cls}`}>
                          {statusBadge(ticket.status).label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">AI Confidence</span>
                        <span className="text-slate-300">{ticket.aiConfidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Risk Score</span>
                        <span className={`font-bold ${ticket.riskScore > 0.75 ? 'text-red-400' : ticket.riskScore > 0.55 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {ticket.riskScore.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Affected</span>
                        <span className="text-slate-300">{ticket.affectedAnimals}/{ticket.totalHerd} animals</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reported</span>
                        <span className="text-slate-300">{formatTimestamp(ticket.reportedAt)}</span>
                      </div>
                      {ticket.isZoonotic && (
                        <div className="mt-1 p-1.5 bg-red-900/30 border border-red-700/50 rounded text-red-400 font-bold text-center">
                          ⚠ ZOONOTIC RISK — ONE HEALTH PROTOCOL
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Layer Controls */}
      <div className="absolute top-3 right-3 z-[1000] glass-panel rounded-lg p-2 w-48">
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Layers size={12} className="text-emerald-400" />
          <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">Layer Controls</span>
        </div>
        <div className="space-y-0.5">
          {([
            { key: 'zones' as const, label: 'Containment Zones', icon: <Eye size={10} /> },
            { key: 'outbreaks' as const, label: 'Confirmed Outbreaks', icon: <Eye size={10} /> },
            { key: 'suspicious' as const, label: 'Suspicious Cases', icon: <Eye size={10} /> },
            { key: 'healthy' as const, label: 'Routine / Healthy', icon: <Eye size={10} /> },
            { key: 'labs' as const, label: 'Labs & Dispensaries', icon: <Eye size={10} /> },
          ]).map(l => (
            <button
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                layers[l.key] ? 'text-slate-200 bg-slate-700/50' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              {layers[l.key] ? <Eye size={10} className="text-emerald-400" /> : <EyeOff size={10} />}
              {l.label}
            </button>
          ))}

          <div className="border-t border-slate-700 my-1.5" />
          <div className="px-1 mb-1">
            <span className="text-[9px] text-slate-500 tracking-wider uppercase">Overlays</span>
          </div>

          {([
            { key: 'weather' as const, label: 'Precipitation / Humidity', icon: <Cloud size={10} /> },
            { key: 'historical' as const, label: 'NADRES 5-Year Hotspots', icon: <History size={10} /> },
            { key: 'density' as const, label: 'Livestock Density', icon: <BarChart3 size={10} /> },
          ]).map(l => (
            <button
              key={l.key}
              onClick={() => toggleLayer(l.key)}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                layers[l.key] ? 'text-slate-200 bg-slate-700/50' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              {layers[l.key] ? <Eye size={10} className="text-emerald-400" /> : l.icon}
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <MapLegend />

      {/* Weather Info Box */}
      <div className="absolute top-3 left-3 z-[1000] glass-panel rounded-lg p-2.5 text-[10px] space-y-1">
        <div className="font-semibold text-slate-300 tracking-wider uppercase text-[9px] mb-1.5 flex items-center gap-1">
          <Cloud size={10} className="text-blue-400" />
          Environmental Indices
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-500">Rainfall</span>
          <span className="text-blue-400 font-semibold">{state.weather.rainfall} mm</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-500">Humidity</span>
          <span className="text-blue-400 font-semibold">{state.weather.humidity}%</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-500">Soil Moisture</span>
          <span className="text-amber-400 font-semibold">{state.weather.soilMoisture}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-500">Season</span>
          <span className="text-slate-300">{state.weather.season}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-500">Risk Multiplier</span>
          <span className="text-red-400 font-bold">{state.weather.riskMultiplier.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
