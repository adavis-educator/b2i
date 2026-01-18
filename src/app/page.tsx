import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { ShutdownChecklist } from "@/components/checklist/ShutdownChecklist";
import { GoalsSection } from "@/components/goals/GoalsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-void">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-charcoal/50 via-transparent to-amber/5 pointer-events-none" />

      <div className="relative max-w-[1800px] mx-auto px-6 py-8 lg:px-12 lg:py-12">
        {/* Header */}
        <header className="mb-12 animate-fade-in-up">
          <div className="flex items-end gap-4 mb-2">
            <h1 className="font-display text-4xl lg:text-5xl text-cream tracking-tight">
              Project Manager
            </h1>
            <div className="h-1 w-12 bg-amber mb-3" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone">
            Focused productivity workspace
          </p>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Kanban Board */}
          <section className="animate-fade-in-up stagger-1 opacity-0">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="font-mono text-2xs uppercase tracking-[0.25em] text-stone">
                Task Board
              </h2>
              <div className="flex-1 decorative-line" />
            </div>
            <KanbanBoard />
          </section>

          {/* Friday Shutdown Checklist */}
          <aside className="xl:h-[calc(100vh-320px)] xl:min-h-[600px] animate-fade-in-up stagger-2 opacity-0">
            <ShutdownChecklist />
          </aside>
        </div>

        {/* Annual Goals Section */}
        <section className="mt-12 animate-fade-in-up stagger-3 opacity-0">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-mono text-2xs uppercase tracking-[0.25em] text-stone">
              Annual Objectives
            </h2>
            <div className="flex-1 decorative-line" />
          </div>
          <GoalsSection />
        </section>

        {/* Footer accent */}
        <footer className="mt-16 pt-8 border-t border-slate/20">
          <p className="font-mono text-2xs uppercase tracking-[0.3em] text-muted text-center">
            Build momentum · Stay focused · Ship work
          </p>
        </footer>
      </div>
    </main>
  );
}
