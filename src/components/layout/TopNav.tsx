import { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../store/AppContext';
import type { ActiveModule } from '../../types';
import {
  Shield, Map, Smartphone, FlaskConical,
  Wifi, RefreshCw, Zap, MoreVertical, X
} from 'lucide-react';

export default function TopNav() {
  const { state, setModule } = useAppState();
  const { activeModule, systemStatus } = state;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const menuItems: { id: ActiveModule; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'warroom', label: 'Command Center', icon: <Map size={16} />, desc: 'GIS War Room & Surveillance' },
    { id: 'field', label: 'Para-Vet Field App', icon: <Smartphone size={16} />, desc: 'Field Verification & Reporting' },
    { id: 'lab', label: 'Lab Portal', icon: <FlaskConical size={16} />, desc: 'Diagnostic Lab & LIMS' },
  ];

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-700/60 flex items-center px-4 gap-4 shrink-0 z-50 select-none">
      {/* Branding */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
          <Shield size={16} className="text-white" />
        </div>
        <div className="hidden lg:flex flex-col leading-none">
          <span className="text-[11px] font-bold tracking-wider text-emerald-400">PashuNirikshan</span>
          <span className="text-[8px] text-slate-500 tracking-wide">DAHD — UNIFIED ANIMAL HEALTH SURVEILLANCE</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-slate-700" />

      {/* Active View Label - subtle, not a tab switcher */}
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-slate-300">
        {activeModule === 'warroom' && <><Map size={14} className="text-emerald-400" /><span>NATIONAL COMMAND CENTER</span></>}
        {activeModule === 'field' && <><Smartphone size={14} className="text-blue-400" /><span>PARA-VET FIELD APP</span></>}
        {activeModule === 'lab' && <><FlaskConical size={14} className="text-purple-400" /><span>DIAGNOSTIC LAB PORTAL</span></>}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* System Status Indicators */}
      <div className="flex items-center gap-3 text-[10px] font-mono tracking-wide">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${systemStatus.nationalNode ? 'bg-emerald-500 animate-pulse-green' : 'bg-red-500'}`} />
          <span className={systemStatus.nationalNode ? 'text-emerald-400' : 'text-red-400'}>
            NATIONAL NODE: {systemStatus.nationalNode ? 'ACTIVE' : 'OFFLINE'}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <div className="flex items-center gap-1.5">
          <Wifi size={11} className={systemStatus.gateway ? 'text-emerald-400' : 'text-red-400'} />
          <span className={systemStatus.gateway ? 'text-emerald-400' : 'text-red-400'}>
            GATEWAY: {systemStatus.gateway ? 'ONLINE' : 'DOWN'}
          </span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <div className="flex items-center gap-1.5">
          <RefreshCw size={11} className="text-slate-400" />
          <span className="text-slate-400">
            SYNC QUEUE: {systemStatus.syncPending} PENDING
          </span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <div className="flex items-center gap-1.5">
          <Zap size={11} className="text-amber-400" />
          <span className="text-amber-400">LIVE</span>
        </div>
      </div>

      {/* Divider before menu */}
      <div className="h-6 w-px bg-slate-700" />

      {/* 3-Dot Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          {menuOpen ? <X size={18} /> : <MoreVertical size={18} />}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2.5 border-b border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Switch Module</span>
            </div>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setModule(item.id); setMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                  activeModule === item.id
                    ? 'bg-emerald-600/10 border-l-2 border-emerald-500'
                    : 'hover:bg-slate-700/50 border-l-2 border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  activeModule === item.id ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'
                }`}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold ${activeModule === item.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500">{item.desc}</div>
                </div>
                {activeModule === item.id && (
                  <div className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
