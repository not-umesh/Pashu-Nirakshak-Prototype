import KPIGrid from './KPIGrid';
import SurveillanceMap from './SurveillanceMap';
import CommandPanel from './CommandPanel';

export default function WarRoom() {
  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] w-full">
      {/* Top KPI Grid */}
      <KPIGrid />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden mt-3 p-3 pt-0 gap-3">
        {/* Left Side: Map (70%) */}
        <div className="flex-[7] bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden relative shadow-inner">
          <SurveillanceMap />
        </div>
        
        {/* Right Side: Command Panel (30%) */}
        <div className="flex-[3] min-w-[320px] rounded-xl overflow-hidden shadow-inner flex flex-col">
          <CommandPanel />
        </div>
      </div>
    </div>
  );
}
