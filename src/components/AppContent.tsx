'use client';

import { useAuth } from '@/context/AuthContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { UserMenu } from '@/components/auth/UserMenu';
import { AboutModal } from '@/components/AboutModal';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ShutdownChecklist } from '@/components/checklist/ShutdownChecklist';
import { GoalsSection } from '@/components/goals/GoalsSection';
import { EditableFooter } from '@/components/EditableFooter';

export function AppContent() {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-3xl text-ink mb-2">B2I</h1>
          <p className="font-mono text-xs text-muted uppercase tracking-wider">Loading...</p>
        </div>
      </main>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  // Show main app if authenticated
  return (
    <main className="min-h-screen bg-cream">
      <div className="relative max-w-[1800px] mx-auto px-6 py-6 lg:px-10 lg:py-8">
        {/* Compact Header with User Menu */}
        <header className="relative z-[100] mb-6 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-3xl text-ink tracking-tight">
              B2I
            </h1>
            <span className="font-mono text-2xs uppercase tracking-[0.15em] text-muted">
              Busy to Intentional
            </span>
            <div className="h-0.5 w-8 bg-amber ml-2" />
          </div>
          <div className="flex items-center gap-2">
            <AboutModal />
            <UserMenu />
          </div>
        </header>

        {/* Main content: Goals on top, then Kanban + Checklist */}
        <div className="relative z-0 space-y-6">
          {/* Annual Goals Section - at top for visibility */}
          <section className="animate-fade-in-up stagger-1 opacity-0">
            <GoalsSection />
          </section>

          {/* Kanban + Checklist grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 lg:gap-8">
            {/* Kanban Board */}
            <section className="animate-fade-in-up stagger-2 opacity-0">
              <KanbanBoard />
            </section>

            {/* Friday Shutdown Checklist */}
            <aside className="xl:h-[calc(100vh-400px)] xl:min-h-[500px] animate-fade-in-up stagger-3 opacity-0">
              <ShutdownChecklist />
            </aside>
          </div>
        </div>

        {/* Footer */}
        <EditableFooter />
      </div>
    </main>
  );
}
