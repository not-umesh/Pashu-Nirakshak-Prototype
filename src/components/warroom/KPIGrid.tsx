import { useAppState } from '../../store/AppContext';
import { Activity, AlertTriangle, Biohazard, Thermometer } from 'lucide-react';

export default function KPIGrid() {
  const { state } = useAppState();
  const { kpi } = state;

  const cards = [
    {
      label: 'Active Epidemic Clusters',
      value: kpi.activeEpidemics,
      icon: <Activity size={20} />,
      color: 'from-red-600 to-red-700',
      textColor: 'text-red-400',
      pulse: true,
      sub: `${kpi.resolvedThisWeek} resolved this week`,
    },
    {
      label: 'Suspected Triage Cases',
      value: kpi.suspectedTriageCases,
      icon: <AlertTriangle size={20} />,
      color: 'from-amber-600 to-amber-700',
      textColor: 'text-amber-400',
      pulse: false,
      sub: 'AI-flagged in last 24h',
    },
    {
      label: 'Zoonotic Alerts',
      value: kpi.zoonoticAlerts,
      icon: <Biohazard size={20} />,
      color: 'from-red-500 to-rose-600',
      textColor: 'text-red-400',
      pulse: kpi.zoonoticAlerts > 0,
      sub: 'Anthrax · Brucellosis · AI H5N1',
    },
    {
      label: 'Vaccine Cold-Chain Buffer',
      value: `${kpi.vaccineColdChainLevel}%`,
      icon: <Thermometer size={20} />,
      color: kpi.vaccineColdChainLevel > 60 ? 'from-emerald-600 to-emerald-700' : 'from-amber-600 to-amber-700',
      textColor: kpi.vaccineColdChainLevel > 60 ? 'text-emerald-400' : 'text-amber-400',
      pulse: false,
      sub: kpi.vaccineColdChainLevel > 60 ? 'ADEQUATE' : 'LOW — Reorder Required',
      tag: kpi.vaccineColdChainLevel > 60 ? { text: 'ADEQUATE', cls: 'bg-emerald-600' } : { text: 'LOW', cls: 'bg-amber-600' },
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 p-3 pb-0">
      {cards.map((card, i) => (
        <div
          key={i}
          className="relative bg-slate-800/70 border border-slate-700/50 rounded-lg p-3 overflow-hidden group hover:border-slate-600/80 transition-colors"
        >
          {/* Gradient accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.color}`} />

          <div className="flex items-start justify-between mb-2">
            <div className={`p-1.5 rounded-md bg-gradient-to-br ${card.color} bg-opacity-20`}>
              <div className="text-white opacity-90">{card.icon}</div>
            </div>
            {card.pulse && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            )}
            {card.tag && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${card.tag.cls} text-white tracking-wide`}>
                {card.tag.text}
              </span>
            )}
          </div>

          <div className={`text-2xl font-bold ${card.textColor} mb-0.5`}>
            {card.value}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mb-1">
            {card.label}
          </div>
          <div className="text-[9px] text-slate-500">
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
