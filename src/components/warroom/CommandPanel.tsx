import { useState } from 'react';
import { useAppState } from '../../store/AppContext';
import { formatTimestamp, riskColor, riskDot, statusBadge } from '../../utils/helpers';
import {
  Phone, Truck, AlertTriangle, ArrowUpRight,
  Clock, MapPin, ChevronRight, X, Volume2,
  Syringe, Shield, CheckCircle2, Radio
} from 'lucide-react';
import type { SurveillanceTicket } from '../../types';

// ─── IVR Alert Modal ───────────────────────────────────────
function IVRAlertModal({ ticket, onClose }: { ticket: SurveillanceTicket; onClose: () => void }) {
  const [broadcasting, setBroadcasting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const recipientCount = Math.floor(Math.random() * 800) + 600;

  const triggerBroadcast = () => {
    setBroadcasting(true);
    setTimeout(() => {
      setBroadcasting(false);
      setCompleted(true);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 modal-overlay z-[2000] flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-[480px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-600 rounded-lg"><Phone size={16} className="text-white" /></div>
            <div>
              <h3 className="font-bold text-sm text-slate-200">Concentric IVR Alert System</h3>
              <p className="text-[10px] text-slate-500">Automated voice broadcast to targeted recipients</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Epicenter</div>
              <div className="font-semibold text-slate-200">{ticket.village}, {ticket.block}</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Alert Radius</div>
              <div className="font-semibold text-amber-400">5 km concentric</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Target Recipients</div>
              <div className="font-semibold text-slate-200">{recipientCount.toLocaleString()} farmers</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Language</div>
              <div className="font-semibold text-slate-200">Chhattisgarhi / Hindi</div>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-lg p-3">
            <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-2">Audio Message Preview</div>
            <div className="text-[11px] text-slate-300 leading-relaxed italic">
              "कृपया ध्यान दें — आपके क्षेत्र में {ticket.disease === 'FMD' ? 'खुरपका-मुँहपका' : ticket.disease === 'LSD' ? 'गाँठदार त्वचा रोग' : ticket.disease} रोग का प्रकोप पाया गया है। अपने पशुओं को अलग रखें और निकटतम पशु चिकित्सालय से तुरंत संपर्क करें। टोल-फ्री: 1962"
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Volume2 size={12} className="text-amber-400" />
              <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-amber-500 rounded-full ${broadcasting ? 'animate-pulse' : ''}`} style={{ width: broadcasting ? '60%' : completed ? '100%' : '0%', transition: 'width 3s' }} />
              </div>
              <span className="text-[9px] text-slate-500">{broadcasting ? 'Broadcasting...' : completed ? 'Sent' : '0:42'}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-lg p-3">
            <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Broadcast Status</div>
            {!broadcasting && !completed && (
              <div className="text-[11px] text-slate-400">Ready to initiate. {recipientCount} registered numbers in radius.</div>
            )}
            {broadcasting && (
              <div className="flex items-center gap-2 text-amber-400 text-[11px]">
                <Radio size={12} className="animate-pulse" />
                Broadcasting to {recipientCount} recipients via IVR gateway...
              </div>
            )}
            {completed && (
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <CheckCircle2 size={12} />
                Broadcast completed. {recipientCount} calls initiated. Delivery report in 15 minutes.
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={triggerBroadcast}
            disabled={broadcasting || completed}
            className={`w-full py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all cursor-pointer ${
              completed
                ? 'bg-emerald-600 text-white'
                : broadcasting
                ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {completed ? '✓ BROADCAST COMPLETE' : broadcasting ? 'BROADCASTING...' : 'TRIGGER IVR BROADCAST'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Vaccine Dispatch Modal ────────────────────────────────
function VaccineDispatchModal({ ticket, onClose }: { ticket: SurveillanceTicket; onClose: () => void }) {
  const [dispatched, setDispatched] = useState(false);
  const herdCensus = Math.floor(Math.random() * 3000) + 2000;
  const doses = Math.ceil(herdCensus * 1.15);

  return (
    <div className="fixed inset-0 modal-overlay z-[2000] flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-[480px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 rounded-lg"><Syringe size={16} className="text-white" /></div>
            <div>
              <h3 className="font-bold text-sm text-slate-200">Ring-Vaccine Buffer Dispatch</h3>
              <p className="text-[10px] text-slate-500">Computed from local herd census data</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Disease</div>
              <div className="font-semibold text-red-400">{ticket.disease}</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Target Block</div>
              <div className="font-semibold text-slate-200">{ticket.block}, {ticket.district}</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Herd Census (5km)</div>
              <div className="font-semibold text-slate-200">{herdCensus.toLocaleString()} animals</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Required Doses (+15%)</div>
              <div className="font-semibold text-emerald-400">{doses.toLocaleString()} doses</div>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-lg p-3 text-[11px]">
            <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-2">Formal Dispatch Order</div>
            <div className="font-mono text-[10px] text-slate-400 space-y-1 leading-relaxed">
              <div>ORDER NO: <span className="text-slate-200">VDO-{ticket.district.slice(0,3).toUpperCase()}-{Date.now().toString().slice(-6)}</span></div>
              <div>FROM: District Vaccine Cold-Chain Store, {ticket.district}</div>
              <div>TO: Block Veterinary Officer, {ticket.block}</div>
              <div>VACCINE: {ticket.disease} Polyvalent — {doses.toLocaleString()} doses</div>
              <div>COLD CHAIN: Maintain 2-8°C throughout transit</div>
              <div>PRIORITY: <span className="text-red-400 font-bold">EMERGENCY — Ring Vaccination</span></div>
              <div>AUTH: Chief Veterinary Officer, {ticket.district}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setDispatched(true)}
            disabled={dispatched}
            className={`w-full py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all cursor-pointer ${
              dispatched ? 'bg-emerald-600 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {dispatched ? '✓ DISPATCH ORDER GENERATED' : 'DISPATCH RING-VACCINE BUFFER'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── One Health Escalation Modal ───────────────────────────
function OneHealthModal({ ticket, onClose }: { ticket: SurveillanceTicket; onClose: () => void }) {
  const [escalated, setEscalated] = useState(false);

  return (
    <div className="fixed inset-0 modal-overlay z-[2000] flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-[480px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-600 rounded-lg"><Shield size={16} className="text-white" /></div>
            <div>
              <h3 className="font-bold text-sm text-slate-200">One Health Escalation — IDSP</h3>
              <p className="text-[10px] text-slate-500">Integrated Disease Surveillance Programme</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-center">
            <div className="text-red-400 font-bold text-sm mb-1">⚠ ZOONOTIC DISEASE ALERT</div>
            <div className="text-[11px] text-red-300">{ticket.aiDetectedCondition}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Disease</div>
              <div className="font-semibold text-red-400">{ticket.disease}</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Location</div>
              <div className="font-semibold text-slate-200">{ticket.village}, {ticket.block}</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Escalated To</div>
              <div className="font-semibold text-slate-200">IDSP {ticket.district}</div>
            </div>
            <div className="bg-slate-900/60 rounded-lg p-3">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Contact Tracing</div>
              <div className="font-semibold text-amber-400">Recommended</div>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-lg p-3 text-[11px]">
            <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-2">Escalation Protocol</div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">1.</span>
                <span>Notify District IDSP Officer immediately via secure channel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">2.</span>
                <span>Initiate human contact tracing within 5km radius of {ticket.village}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">3.</span>
                <span>Alert Chief Medical & Health Officer (CMHO) for prophylactic measures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">4.</span>
                <span>Activate Joint Rapid Response Team (JRRT) — Veterinary + Medical</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">5.</span>
                <span>Report to State Zoonotic Disease Cell within 1 hour</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={() => setEscalated(true)}
            disabled={escalated}
            className={`w-full py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all cursor-pointer ${
              escalated ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {escalated ? '✓ ESCALATION SENT TO IDSP' : 'ESCALATE TO HUMAN HEALTH (ONE HEALTH)'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket Detail Modal ───────────────────────────────────
function TicketDetailModal({ ticket, onClose }: { ticket: SurveillanceTicket; onClose: () => void }) {
  const badge = statusBadge(ticket.status);
  return (
    <div className="fixed inset-0 modal-overlay z-[2000] flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-[520px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h3 className="font-bold text-sm text-slate-200">{ticket.ticketNumber}</h3>
            <p className="text-[10px] text-slate-500">{ticket.aiDetectedCondition}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3 text-[11px]">
          <div className="flex gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>
            {ticket.isZoonotic && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-700 text-white">ZOONOTIC</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Farmer', ticket.farmerName],
              ['Farmer ID', ticket.farmerId],
              ['Village', ticket.village],
              ['Block', `${ticket.block}, ${ticket.district}`],
              ['Disease', ticket.disease],
              ['AI Confidence', `${ticket.aiConfidence}%`],
              ['Risk Score', ticket.riskScore.toFixed(2)],
              ['Affected', `${ticket.affectedAnimals}/${ticket.totalHerd} animals`],
              ['Para-Vet', ticket.assignedParaVet],
              ['Reported', formatTimestamp(ticket.reportedAt)],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-900/60 rounded p-2">
                <div className="text-slate-500 text-[9px] uppercase tracking-wider">{k}</div>
                <div className="text-slate-200 font-medium">{v}</div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900/60 rounded p-2">
            <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Symptoms</div>
            <div className="text-slate-300">{ticket.symptoms.join(' • ')}</div>
          </div>
          <div className="bg-slate-900/60 rounded p-2">
            <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Pashu Aadhaar Tags</div>
            <div className="flex flex-wrap gap-1">
              {ticket.pashuAadhaarTags.map(tag => (
                <span key={tag} className="font-mono text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">{tag}</span>
              ))}
            </div>
          </div>
          {ticket.notes.length > 0 && (
            <div className="bg-slate-900/60 rounded p-2">
              <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">Notes</div>
              <ul className="space-y-1">
                {ticket.notes.map((n, i) => (
                  <li key={i} className="text-slate-400 text-[10px]">• {n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Command Panel ────────────────────────────────────
export default function CommandPanel() {
  const { state } = useAppState();
  const { incidents, tickets } = state;

  const [ivrModal, setIvrModal] = useState<SurveillanceTicket | null>(null);
  const [vaccineModal, setVaccineModal] = useState<SurveillanceTicket | null>(null);
  const [oneHealthModal, setOneHealthModal] = useState<SurveillanceTicket | null>(null);
  const [ticketModal, setTicketModal] = useState<SurveillanceTicket | null>(null);

  const activeTicket = tickets.find(t => t.status === 'CONFIRMED_OUTBREAK') || tickets[0];
  const zoonoticTicket = tickets.find(t => t.isZoonotic && t.status !== 'VERIFIED_RESOLVED');

  return (
    <>
      <div className="w-full h-full flex flex-col bg-slate-900/50 border-l border-slate-700/50">
        {/* Header */}
        <div className="p-3 border-b border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 bg-emerald-600/20 rounded"><AlertTriangle size={14} className="text-emerald-400" /></div>
            <span className="text-[11px] font-bold text-slate-200 tracking-wide">COMMAND & ESCALATION</span>
          </div>

          {/* Protocol Action Buttons */}
          <div className="space-y-1.5">
            <button
              onClick={() => setIvrModal(activeTicket)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-amber-600/15 border border-amber-600/30 rounded-lg text-[10px] font-semibold text-amber-400 hover:bg-amber-600/25 transition-colors cursor-pointer"
            >
              <Phone size={12} />
              <span className="flex-1 text-left">Trigger Concentric IVR Alert</span>
              <ChevronRight size={12} />
            </button>
            <button
              onClick={() => setVaccineModal(activeTicket)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-600/15 border border-emerald-600/30 rounded-lg text-[10px] font-semibold text-emerald-400 hover:bg-emerald-600/25 transition-colors cursor-pointer"
            >
              <Truck size={12} />
              <span className="flex-1 text-left">Dispatch Ring-Vaccine Buffer</span>
              <ChevronRight size={12} />
            </button>
            <button
              onClick={() => zoonoticTicket && setOneHealthModal(zoonoticTicket)}
              disabled={!zoonoticTicket}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                zoonoticTicket
                  ? 'bg-red-600/15 border border-red-600/30 text-red-400 hover:bg-red-600/25'
                  : 'bg-slate-800 border border-slate-700 text-slate-600'
              }`}
            >
              <Shield size={12} />
              <span className="flex-1 text-left">Escalate to IDSP (One Health)</span>
              {zoonoticTicket && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" /></span>}
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Live Incident Stream */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-3 py-2 flex items-center gap-2 border-b border-slate-700/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Live Incident Stream</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {incidents.map((inc, idx) => {
              const ticket = tickets.find(t => t.id === inc.ticketId);
              return (
                <div
                  key={inc.id}
                  className={`p-2.5 rounded-lg border border-slate-700/40 bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer ${idx === 0 ? 'animate-slide-in' : ''}`}
                  onClick={() => ticket && setTicketModal(ticket)}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${riskDot(inc.riskLevel)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[8px] px-1 py-0.5 rounded font-bold ${riskColor(inc.riskLevel)}`}>
                          {inc.riskLevel}
                        </span>
                        <span className="text-[8px] text-slate-500 font-mono">{inc.type.replace('_', ' ')}</span>
                      </div>
                      <div className="text-[10px] font-semibold text-slate-200 truncate">
                        {inc.title}
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">
                        {inc.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-600">
                        <span className="flex items-center gap-0.5"><Clock size={8} />{formatTimestamp(inc.timestamp)}</span>
                        <span className="flex items-center gap-0.5"><MapPin size={8} />{inc.block}</span>
                      </div>
                    </div>
                    <ArrowUpRight size={12} className="text-slate-600 shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {ivrModal && <IVRAlertModal ticket={ivrModal} onClose={() => setIvrModal(null)} />}
      {vaccineModal && <VaccineDispatchModal ticket={vaccineModal} onClose={() => setVaccineModal(null)} />}
      {oneHealthModal && <OneHealthModal ticket={oneHealthModal} onClose={() => setOneHealthModal(null)} />}
      {ticketModal && <TicketDetailModal ticket={ticketModal} onClose={() => setTicketModal(null)} />}
    </>
  );
}
