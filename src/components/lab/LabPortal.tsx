import { useState } from 'react';
import { useAppState } from '../../store/AppContext';
import { formatDateTime, sampleStatusBadge } from '../../utils/helpers';
import { generateQRSvg } from '../../services/mlEngine';
import { FlaskConical, Search, Clock, Microscope, TestTube, ThermometerSnowflake, MapPin } from 'lucide-react';
import type { LabSample, DiseaseType } from '../../types';

export default function LabPortal() {
  const { state, dispatch } = useAppState();
  const { samples } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSample, setSelectedSample] = useState<LabSample | null>(null);
  
  const filteredSamples = samples.filter(s => 
    s.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingSamples = filteredSamples.filter(s => s.status === 'IN_TRANSIT' || s.status === 'RECEIVED' || s.status === 'PROCESSING');
  const completedSamples = filteredSamples.filter(s => s.status === 'CONFIRMED_POSITIVE' || s.status === 'CONFIRMED_NEGATIVE');

  const handleResult = (disease: DiseaseType | null) => {
    if (!selectedSample) return;
    
    if (disease) {
      dispatch({ 
        type: 'CONFIRM_OUTBREAK', 
        payload: { ticketId: selectedSample.ticketId, sampleId: selectedSample.id, disease } 
      });
    } else {
      dispatch({ 
        type: 'UPDATE_SAMPLE', 
        payload: { 
          id: selectedSample.id, 
          updates: { 
            status: 'CONFIRMED_NEGATIVE', 
            result: 'Negative', 
            resultDate: new Date().toISOString() 
          } 
        } 
      });
    }
    setSelectedSample(null);
  };

  const handleUpdateStatus = (status: 'RECEIVED' | 'PROCESSING') => {
    if (!selectedSample) return;
    dispatch({ 
      type: 'UPDATE_SAMPLE', 
      payload: { 
        id: selectedSample.id, 
        updates: { status } 
      } 
    });
    setSelectedSample(prev => prev ? { ...prev, status } : null);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] w-full p-4 gap-4 bg-slate-950 overflow-hidden">
      
      {/* Sidebar: Sample List */}
      <div className="w-80 shrink-0 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-lg font-bold text-purple-400 flex items-center gap-2 mb-3">
            <FlaskConical size={20} />
            Diagnostic Lab Queue
          </h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by Sample ID or Ticket..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-6">
          {/* Pending Section */}
          <div>
            <div className="px-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-900 z-10 pt-2">
              Action Required ({pendingSamples.length})
            </div>
            <div className="space-y-1">
              {pendingSamples.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedSample(s)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedSample?.id === s.id ? 'bg-slate-800 border-purple-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                >
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-200 truncate min-w-0">{s.sampleId}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${sampleStatusBadge(s.status).cls}`}>
                      {sampleStatusBadge(s.status).label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><TestTube size={10} /> {s.sampleType}</span>
                    <span>•</span>
                    <span>{s.disease} Suspected</span>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">Ticket: {s.ticketNumber}</div>
                </div>
              ))}
              {pendingSamples.length === 0 && <div className="text-xs text-slate-500 text-center py-4">No pending samples.</div>}
            </div>
          </div>

          {/* Completed Section */}
          <div>
            <div className="px-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-900 z-10 pt-2">
              Completed / Archived
            </div>
            <div className="space-y-1">
              {completedSamples.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedSample(s)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors opacity-75 ${selectedSample?.id === s.id ? 'bg-slate-800 border-slate-600' : 'bg-slate-950 border-transparent hover:border-slate-800'}`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-mono text-xs font-semibold text-slate-300">{s.sampleId}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sampleStatusBadge(s.status).cls}`}>
                      {sampleStatusBadge(s.status).label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">Result: <span className="font-semibold text-slate-300">{s.result}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Sample Details */}
      <div className="flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
        {selectedSample ? (
          <>
            <div className="p-5 border-b border-slate-800 bg-slate-800/30 flex justify-between items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-xl font-bold font-mono text-slate-100 truncate">{selectedSample.sampleId}</h1>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${sampleStatusBadge(selectedSample.status).cls}`}>
                    {sampleStatusBadge(selectedSample.status).label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1"><TestTube size={13} /> {selectedSample.sampleType} Sample</span>
                  <span className="flex items-center gap-1"><MapPin size={13} /> Origin: {selectedSample.originVillage}, {selectedSample.originBlock}</span>
                  <span className="flex items-center gap-1 font-mono"><Clock size={13} /> Collected: {formatDateTime(selectedSample.collectedAt)}</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded p-1 shadow-lg shrink-0 overflow-hidden flex items-center justify-center">
                <img src={generateQRSvg(selectedSample.qrCode)} alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              
              {/* Data Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 min-w-0">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Associated Ticket</div>
                  <div className="font-mono text-xs text-slate-200 truncate">{selectedSample.ticketNumber}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Suspected: <span className="font-semibold text-amber-400">{selectedSample.disease}</span></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 min-w-0">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Farmer / Owner</div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{selectedSample.originFarmer}</div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">Pashu Aadhaar: <span className="font-mono">{selectedSample.pashuAadhaar}</span></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 min-w-0">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Collected By</div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{selectedSample.collectedBy}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Designation: Para-Vet</div>
                </div>
              </div>

              {/* Chain of Custody */}
              <div>
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <ThermometerSnowflake size={16} className="text-blue-400" />
                  Secure Chain of Custody
                </h3>
                <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                  {selectedSample.chainOfCustody.map((entry, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-6 px-4 py-3 border-b border-slate-800/60 last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-200">{entry.action}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{entry.handler} • {entry.location}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-slate-500 font-mono whitespace-nowrap">{formatDateTime(entry.timestamp)}</div>
                        {entry.temperature && (
                          <div className="text-[11px] text-blue-400 font-semibold mt-0.5">Temp: {entry.temperature}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {(selectedSample.status === 'IN_TRANSIT' || selectedSample.status === 'RECEIVED' || selectedSample.status === 'PROCESSING') && (
                <div className="mt-auto">
                  <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <Microscope size={16} className="text-purple-400" />
                    Laboratory Actions
                  </h3>
                  
                  {selectedSample.status === 'IN_TRANSIT' && (
                    <button onClick={() => handleUpdateStatus('RECEIVED')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-colors cursor-pointer">
                      MARK SAMPLE AS RECEIVED
                    </button>
                  )}
                  
                  {selectedSample.status === 'RECEIVED' && (
                    <button onClick={() => handleUpdateStatus('PROCESSING')} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-sm transition-colors cursor-pointer">
                      BEGIN ANALYSIS (ELISA / PCR)
                    </button>
                  )}

                  {selectedSample.status === 'PROCESSING' && (
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleResult(selectedSample.disease || 'FMD')} 
                        className="py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-sm transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-900/20"
                      >
                        <span className="text-xs opacity-80 uppercase tracking-widest">Log Result</span>
                        <span>POSITIVE - CONTAGIOUS</span>
                        <span className="text-[9px] opacity-70 font-normal">Triggers automated GIS Red Zone</span>
                      </button>
                      <button 
                        onClick={() => handleResult(null)} 
                        className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm transition-colors cursor-pointer flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-xs opacity-80 uppercase tracking-widest">Log Result</span>
                        <span>NEGATIVE</span>
                        <span className="text-[9px] opacity-70 font-normal">Resolves suspicion</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {(selectedSample.status === 'CONFIRMED_POSITIVE' || selectedSample.status === 'CONFIRMED_NEGATIVE') && (
                <div className="mt-auto p-4 bg-slate-950 border border-slate-800 rounded-lg text-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Final Result Logged</div>
                  <div className={`text-xl font-bold ${selectedSample.status === 'CONFIRMED_POSITIVE' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {selectedSample.result}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 font-mono">{formatDateTime(selectedSample.resultDate || '')}</div>
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <Microscope size={64} className="mb-6 opacity-30" />
            <h2 className="text-xl font-semibold text-slate-400 mb-2">Select a Sample</h2>
            <p className="text-sm">Choose a biological sample from the queue to view details and log test results.</p>
          </div>
        )}
      </div>

    </div>
  );
}
