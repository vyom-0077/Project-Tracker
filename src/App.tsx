
import { useAppStore } from './store/appStore';
import { useURLSync } from './hooks/useURLSync';
import { FilterBar } from './components/filters/FilterBar';
import { KanbanView } from './components/kanban/KanbanView';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';
import { ViewSwitcher } from './components/ui/ViewSwitcher';
import { CollaborationBar } from './components/collaboration/CollaborationBar';

export default function App() {
  useURLSync();
  const { view } = useAppStore();

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-white/5 bg-surface-1/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </div>
            <span className="font-display font-bold text-white tracking-tight">Velozity</span>
            <span className="text-gray-600 text-sm hidden md:inline">/ Project Tracker</span>
          </div>

          {/* View switcher */}
          <ViewSwitcher />

          {/* Collaboration bar */}
          <CollaborationBar />
        </div>
      </header>

      {/*Filter bar */}
      <div className="border-b border-white/5 bg-surface-1/50">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <FilterBar />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 py-5 h-full">
          <div className="h-[calc(100vh-140px)]">
            {view === 'kanban' && <KanbanView />}
            {view === 'list' && <ListView />}
            {view === 'timeline' && <TimelineView />}
          </div>
        </div>
      </main>
    </div>
  );
}
