import { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../store/AppContext';
import { generateId } from '../../utils/helpers';
import { analyzeImage, analyzeSymptomText, checkDuplicate, generateSMSPayload } from '../../services/mlEngine';
import { Search, MoreVertical, Paperclip, Camera, Send, Mic, Signal, Battery, Wifi, CheckCheck, FileText, QrCode, AlertTriangle, ShieldCheck, MapPin, Database, Radio, Smartphone } from 'lucide-react';
import type { SurveillanceTicket, WhatsAppMessage } from '../../types';

// ─── WhatsApp Triage Interface ─────────────────────────────
function WhatsAppSimulator() {
  const { state, dispatch } = useAppState();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    { id: '1', sender: 'bot', content: 'नमस्कार! मैं पशुपालन विभाग (DAHD) का पशु-निरीक्षण बोट हूँ।\n\nआप क्या करना चाहते हैं?\n1. नई बीमारी की रिपोर्ट दर्ज करें\n2. अपने पिछले केस की स्थिति जानें\n3. पशु चिकित्सक से बात करें\n\nकृपया अपना विकल्प (1, 2, 3) चुनें।', timestamp: new Date().toISOString(), type: 'text', isHindi: true }
  ]);
  const [input, setInput] = useState('');
  const [farmer, setFarmer] = useState(null as any);
  const [reportState, setReportState] = useState<'idle' | 'awaiting_option' | 'awaiting_id' | 'awaiting_symptoms' | 'awaiting_photo' | 'awaiting_ticket'>('awaiting_option');
  const [symptomData, setSymptomData] = useState<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const addMsg = (msg: Omit<WhatsAppMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: generateId('msg'), timestamp: new Date().toISOString() }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    addMsg({ sender: 'user', content: text, type: 'text' });
    setInput('');

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      // Basic conversational handling
      if (lowerText === 'hi' || lowerText === 'hello' || lowerText === 'नमस्ते') {
        addMsg({
          sender: 'bot',
          content: 'नमस्कार! पशुनिरीक्षण सेवा में आपका स्वागत है।\n\nआप क्या करना चाहते हैं?\n1. नई बीमारी की रिपोर्ट दर्ज करें\n2. अपने पिछले केस की स्थिति जानें\n3. पशु चिकित्सक से बात करें\n\nकृपया अपना विकल्प (1, 2, 3) चुनें।',
          type: 'text', isHindi: true
        });
        setReportState('awaiting_option');
        return;
      }
      
      if (lowerText === 'thanks' || lowerText === 'ok' || lowerText === 'धन्यवाद' || lowerText === 'thank you') {
        addMsg({
          sender: 'bot',
          content: 'आपका दिन शुभ हो! पशुओं के स्वास्थ्य से जुड़ी किसी भी समस्या के लिए हमें कभी भी मैसेज करें।',
          type: 'text', isHindi: true
        });
        setReportState('idle');
        return;
      }

      if (reportState === 'awaiting_option') {
        if (text === '1') {
          addMsg({
            sender: 'bot',
            content: 'बीमारी की रिपोर्ट दर्ज करने के लिए, कृपया अपना किसान आईडी (Farmer ID) या पंजीकृत मोबाइल नंबर दर्ज करें।\n(उदाहरण: FID-7739201)',
            type: 'text', isHindi: true
          });
          setReportState('awaiting_id');
        } else if (text === '2') {
          addMsg({
            sender: 'bot',
            content: 'स्थिति जानने के लिए कृपया अपना 15 अंकों का टिकट नंबर (Ticket Number) दर्ज करें।\n(उदाहरण: CG-RPR-2026-00420)',
            type: 'text', isHindi: true
          });
          setReportState('awaiting_ticket');
        } else if (text === '3') {
          addMsg({
            sender: 'bot',
            content: 'आपको जल्द ही एक पशु चिकित्सक (Para-Vet) से जोड़ा जाएगा। कृपया प्रतीक्षा करें...',
            type: 'text', isHindi: true
          });
          setReportState('idle');
        } else {
          addMsg({
            sender: 'bot',
            content: 'कृपया सही विकल्प चुनें (1, 2, या 3)।',
            type: 'text', isHindi: true
          });
        }
        return;
      }
      
      if (reportState === 'awaiting_ticket') {
         const ticket = state.tickets.find(t => t.ticketNumber.toUpperCase() === text.trim().toUpperCase() || t.id === text.trim());
         if (ticket) {
           addMsg({
             sender: 'bot',
             content: `टिकट मिला!\n\nस्टेटस: ${ticket.status.replace('_', ' ')}\nबीमारी: ${ticket.disease}\n\nहमारी टीम इस पर काम कर रही है।`,
             type: 'text', isHindi: true
           });
           setReportState('idle');
         } else {
           addMsg({
             sender: 'bot',
             content: 'क्षमा करें, यह टिकट नंबर नहीं मिला। कृपया जांच कर पुनः प्रयास करें।',
             type: 'text', isHindi: true
           });
         }
         return;
      }

      if (reportState === 'awaiting_id' || (!farmer && reportState === 'idle')) {
        // Authenticate
        const found = state.farmers.find(f => f.farmerId === text || f.phone === text);
        if (found) {
          setFarmer(found);
          addMsg({
            sender: 'bot',
            content: `किसान प्रोफ़ाइल सत्यापित: ${found.name}\nग्राम: ${found.village}\nपशुधन: ${found.registeredLivestock.length} जानवर\n\nकृपया बीमार पशु के लक्षण विस्तार से बताएं।`,
            type: 'text', isHindi: true
          });
          setReportState('awaiting_symptoms');
        } else {
          addMsg({ sender: 'bot', content: 'अमान्य आईडी। कृपया सही किसान आईडी या पंजीकृत मोबाइल नंबर दर्ज करें।', type: 'text', isHindi: true });
        }
        return;
      }

      if (reportState === 'awaiting_symptoms') {
        const analysis = analyzeSymptomText(text);
        setSymptomData(analysis);
        addMsg({
          sender: 'bot',
          content: 'लक्षण दर्ज कर लिए गए हैं। कृपया प्रभावित हिस्से (जैसे मुंह, पैर, या गांठ) की एक स्पष्ट फोटो भेजें ताकि AI जांच कर सके।',
          type: 'text', isHindi: true
        });
        setReportState('awaiting_photo');
        return;
      }
    }, 1000);
  };

  const handleSimulatePhoto = (type: 'fmd' | 'lsd' | 'healthy') => {
    if (reportState !== 'awaiting_photo' || !farmer) return;
    addMsg({ sender: 'user', content: '📸 Image Uploaded', type: 'image', imageUrl: `/${type}_sim.jpg` });
    setReportState('idle');

    setTimeout(() => {
      addMsg({ sender: 'bot', content: 'AI छवि विश्लेषण कर रहा है...', type: 'system' });
      
      setTimeout(() => {
        const cvResult = analyzeImage(type);
        const dedup = checkDuplicate(farmer.farmerId);
        
        let ticket: SurveillanceTicket;
        if (dedup.isDuplicate) {
          // Append to existing
          const existing = state.tickets.find(t => t.farmerId === farmer.farmerId)!;
          dispatch({ type: 'APPEND_TO_TICKET', payload: { ticketId: existing.id, notes: ['Follow-up WhatsApp report received'] } });
          addMsg({
            sender: 'bot',
            content: `AI रिपोर्ट: ${cvResult.detectedCondition}\n\nआपका पिछला टिकट (${existing.ticketNumber}) अपडेट कर दिया गया है। पैरा-वेट जल्द ही संपर्क करेंगे।`,
            type: 'text', isHindi: true
          });
        } else {
          // Create new
          const riskCalc = cvResult.confidence > 80 && type !== 'healthy' ? 'HIGH' : 'LOW';
          
          ticket = {
            id: generateId('TKT'),
            ticketNumber: `CG-${farmer.district.slice(0,3).toUpperCase()}-2026-${Math.floor(Math.random()*1000).toString().padStart(4,'0')}`,
            farmerId: farmer.farmerId,
            farmerName: farmer.name,
            village: farmer.village,
            block: farmer.block,
            district: farmer.district,
            location: farmer.location,
            disease: cvResult.diseaseCode,
            status: type === 'healthy' ? 'VERIFIED_RESOLVED' : 'SUSPICIOUS_TRIAGE',
            riskLevel: type === 'healthy' ? 'LOW' : riskCalc,
            isZoonotic: false,
            symptoms: symptomData?.keywords || ['Photo submitted'],
            reportedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            aiConfidence: cvResult.confidence,
            aiDetectedCondition: cvResult.detectedCondition,
            assignedParaVet: 'Pending Assignment',
            affectedAnimals: 1,
            totalHerd: farmer.registeredLivestock.length,
            pashuAadhaarTags: [farmer.registeredLivestock[0].pashuAadhaar],
            riskScore: (symptomData?.severity || 0.5) * 0.8,
            weatherFactor: state.weather.riskMultiplier,
            historicalPrecedent: 0.6,
            linkedSampleIds: [],
            notes: ['Generated via WhatsApp AI Triage'],
          };
          
          dispatch({ type: 'ADD_TICKET', payload: ticket });
          
          if (type !== 'healthy') {
            dispatch({
              type: 'ADD_INCIDENT',
              payload: {
                id: generateId('INC'), timestamp: new Date().toISOString(),
                type: 'TRIAGE', title: `WhatsApp Triage: ${cvResult.detectedCondition}`,
                description: `Farmer ${farmer.name} uploaded photo. AI confidence: ${cvResult.confidence}%`,
                block: farmer.block, riskLevel: riskCalc, ticketId: ticket.id
              }
            });
            dispatch({
              type: 'ADD_MARKER',
              payload: {
                id: generateId('MRK'), position: farmer.location, type: 'SUSPICIOUS',
                label: `${ticket.disease} Suspected - ${farmer.village}`, details: 'AI WhatsApp Triage', ticketId: ticket.id
              }
            });
          }

          addMsg({
            sender: 'bot',
            content: `🚨 AI प्रारंभिक जांच पूर्ण 🚨\nसंभावित स्थिति: ${cvResult.detectedCondition}\nविश्वसनीयता: ${cvResult.confidence}%\n\nटिकट जनरेट: ${ticket.ticketNumber}\nपैरा-वेट को सूचित कर दिया गया है। कृपया पशु को अलग रखें।`,
            type: 'text', isHindi: true
          });
        }
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B141A] rounded-xl border border-slate-700 overflow-hidden relative shadow-2xl max-w-sm mx-auto">
      {/* Device Status Bar */}
      <div className="h-6 bg-[#0B141A] flex items-center justify-between px-4 text-white text-[10px] font-medium shrink-0">
        <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <div className="flex items-center gap-1.5">
          <Signal size={10} />
          <Wifi size={10} />
          <Battery size={12} className="rotate-90" />
        </div>
      </div>

      {/* WA Header */}
      <div className="h-14 bg-[#202C33] flex items-center px-3 gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">PashuNirikshan DAHD</div>
          <div className="text-[#8696A0] text-xs">bot · verified</div>
        </div>
        <Search size={20} className="text-[#AEBAC1]" />
        <MoreVertical size={20} className="text-[#AEBAC1]" />
      </div>

      {/* Chat Area */}
      <div 
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(11,20,26,0.9)' }}
      >
        <div className="text-center mb-4">
          <span className="bg-[#1F2C34] text-[#8696A0] text-[10px] px-3 py-1 rounded-lg">Today</span>
        </div>
        
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-2 pb-1 text-[13px] relative ${m.sender === 'user' ? 'wa-bubble-user text-[#E9EDEF]' : m.type === 'system' ? 'bg-slate-800 text-amber-400 rounded-lg text-center text-[10px] w-full' : 'wa-bubble-bot text-[#E9EDEF]'}`}>
              {m.type === 'image' && (
                <div className="w-full h-32 bg-slate-800 rounded mb-1 flex items-center justify-center border border-slate-600 overflow-hidden">
                  <Camera size={24} className="text-slate-500 opacity-50" />
                </div>
              )}
              {m.type !== 'system' && <div className="whitespace-pre-wrap">{m.content}</div>}
              {m.type === 'system' && <div className="italic">{m.content}</div>}
              
              {m.type !== 'system' && (
                <div className="flex justify-end items-center gap-1 mt-0.5">
                  <span className="text-[9px] text-white/50">{new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  {m.sender === 'user' && <CheckCheck size={12} className="text-[#53BDEB]" />}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-2 bg-[#202C33] flex items-end gap-2 shrink-0">
        <div className="flex-1 bg-[#2A3942] rounded-2xl flex items-center px-2 py-1 min-h-[44px]">
          {reportState === 'awaiting_photo' && (
            <div className="flex gap-2 mr-2">
              <button onClick={() => handleSimulatePhoto('fmd')} className="p-1.5 bg-red-900/40 text-red-400 rounded-full hover:bg-red-900/60 transition-colors" title="Upload FMD Sample">
                <Camera size={16} />
              </button>
              <button onClick={() => handleSimulatePhoto('lsd')} className="p-1.5 bg-amber-900/40 text-amber-400 rounded-full hover:bg-amber-900/60 transition-colors" title="Upload LSD Sample">
                <Camera size={16} />
              </button>
            </div>
          )}
          <Paperclip size={20} className="text-[#8696A0] mx-2" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message"
            className="flex-1 bg-transparent border-none outline-none text-[#E9EDEF] text-sm"
          />
        </div>
        {input ? (
          <button onClick={handleSend} className="w-[44px] h-[44px] rounded-full bg-[#00A884] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#008f6f]">
            <Send size={18} className="text-white ml-1" />
          </button>
        ) : (
          <button className="w-[44px] h-[44px] rounded-full bg-[#00A884] flex items-center justify-center shrink-0 cursor-pointer">
            <Mic size={20} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Para-Vet Offline App ──────────────────────────────────
function ParaVetTablet() {
  const { state, dispatch } = useAppState();
  const [offline, setOffline] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SurveillanceTicket | null>(null);
  const [smsPayload, setSmsPayload] = useState('');
  
  const activeTickets = state.tickets.filter(t => t.status === 'SUSPICIOUS_TRIAGE' || t.status === 'UNDER_INVESTIGATION');

  const handleGenerateSMS = () => {
    if (!selectedTicket || !tagInput) return;
    const payload = generateSMSPayload({
      disease: selectedTicket.disease,
      pashuAadhaar: tagInput,
      lat: selectedTicket.location.lat,
      lng: selectedTicket.location.lng,
    });
    setSmsPayload(payload);
  };

  const handleOnlineSync = () => {
    if (!selectedTicket || !tagInput) return;
    dispatch({
      type: 'ADD_INCIDENT',
      payload: {
        id: generateId('INC'), timestamp: new Date().toISOString(),
        type: 'REPORT', title: 'Para-Vet Field Verification',
        description: `Verified tag ${tagInput} at ${selectedTicket.village}. Sample collection initiated.`,
        block: selectedTicket.block, riskLevel: selectedTicket.riskLevel, ticketId: selectedTicket.id
      }
    });
    dispatch({ type: 'UPDATE_TICKET', payload: { id: selectedTicket.id, updates: { status: 'UNDER_INVESTIGATION' } } });
    setSmsPayload('SYNCED TO SERVER');
    setTimeout(() => setSmsPayload(''), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border-4 border-slate-700 overflow-hidden relative shadow-2xl">
      {/* Tablet Header */}
      <div className="h-10 bg-slate-900 flex items-center justify-between px-4 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span className="font-bold text-xs text-slate-200">PashuNirikshan Field App</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setOffline(!offline)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${offline ? 'bg-red-900/50 text-red-400 border border-red-700/50' : 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50'}`}
          >
            {offline ? <Wifi size={12} className="opacity-50" /> : <Wifi size={12} />}
            {offline ? 'OFFLINE MODE' : 'ONLINE'}
          </button>
          <div className="flex items-center gap-1 text-slate-400">
            <Battery size={14} className="text-emerald-500" />
            <span className="text-[10px] font-mono">82%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tasks */}
        <div className="w-1/3 border-r border-slate-800 bg-slate-900/50 overflow-y-auto p-2 space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Assigned Tasks</div>
          {activeTickets.map(t => (
            <div 
              key={t.id} 
              onClick={() => { setSelectedTicket(t); setSmsPayload(''); setTagInput(t.pashuAadhaarTags[0] || ''); }}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedTicket?.id === t.id ? 'bg-slate-800 border-emerald-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.riskLevel === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-500 text-black'}`}>
                  {t.riskLevel}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">{t.ticketNumber.slice(-8)}</span>
              </div>
              <div className="font-semibold text-xs text-slate-200 truncate">{t.farmerName}</div>
              <div className="text-[10px] text-slate-500 truncate">{t.village}, {t.block}</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <AlertTriangle size={10} className={t.disease === 'Anthrax' ? 'text-red-400' : 'text-amber-400'} />
                {t.aiDetectedCondition}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950">
          {selectedTicket ? (
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <h2 className="text-lg font-bold text-slate-200 mb-1">Field Verification Form</h2>
                <div className="text-xs text-slate-400 font-mono mb-4">Ticket: {selectedTicket.ticketNumber}</div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">GPS Geofence Status</label>
                    <div className="flex items-center justify-between bg-emerald-900/20 border border-emerald-700/30 p-2.5 rounded-lg">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                        <MapPin size={14} />
                        WITHIN RANGE (12m)
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedTicket.location.lat.toFixed(4)}, {selectedTicket.location.lng.toFixed(4)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pashu Aadhaar Tag</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:border-emerald-500 outline-none"
                        placeholder="12-digit ear tag"
                      />
                      <button className="px-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
                        <QrCode size={18} className="text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hardware Enforced Capture</label>
                    <button className="w-full flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-700 rounded-lg bg-slate-900/50 hover:bg-slate-800 transition-colors text-slate-400 cursor-pointer">
                      <Camera size={24} />
                      <span className="text-xs font-semibold">Take Secure Photo</span>
                      <span className="text-[9px]">(Timestamps & Geotags enforced)</span>
                    </button>
                  </div>
                  
                  {offline ? (
                    <div className="pt-2">
                      <button 
                        onClick={handleGenerateSMS}
                        className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Radio size={16} />
                        GENERATE EMERGENCY SMS PAYLOAD
                      </button>
                      {smsPayload && (
                        <div className="mt-3 p-3 bg-slate-950 border border-amber-600/50 rounded-lg">
                          <div className="text-[10px] text-amber-500 font-semibold mb-1 uppercase">Encrypted SMS String (Background Gateway)</div>
                          <div className="font-mono text-sm text-slate-300 break-all select-all">{smsPayload}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button 
                        onClick={handleOnlineSync}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Database size={16} />
                        SYNC TO NATIONAL NODE
                      </button>
                      {smsPayload && (
                        <div className="mt-3 text-center text-emerald-400 font-bold text-sm animate-pulse">{smsPayload}</div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-semibold">Select a task from the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function FieldSimulator() {
  return (
    <div className="flex h-[calc(100vh-3rem)] w-full p-4 gap-6 bg-slate-900 overflow-hidden">
      
      {/* Para-Vet Field App */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center justify-center">
          <div className="w-full h-full">
            <ParaVetTablet />
          </div>
        </div>
      </div>

    </div>
  );
}
