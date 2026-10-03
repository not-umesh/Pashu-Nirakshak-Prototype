import { AppProvider, useAppState } from './store/AppContext';
import TopNav from './components/layout/TopNav';
import WarRoom from './components/warroom/WarRoom';
import FieldSimulator from './components/field/FieldSimulator';
import LabPortal from './components/lab/LabPortal';

function AppContent() {
  const { state } = useAppState();

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden text-slate-200">
      <TopNav />
      <main className="flex-1 w-full relative">
        {state.activeModule === 'warroom' && <WarRoom />}
        {state.activeModule === 'field' && <FieldSimulator />}
        {state.activeModule === 'lab' && <LabPortal />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
