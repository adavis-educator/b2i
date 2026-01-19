import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { ShutdownChecklist } from "@/components/checklist/ShutdownChecklist";
import { GoalsSection } from "@/components/goals/GoalsSection";
import { EditableFooter } from "@/components/EditableFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="relative max-w-[1800px] mx-auto px-6 py-6 lg:px-10 lg:py-8">
        {/* Compact Header */}
        <header className="mb-6 flex items-baseline gap-3 animate-fade-in-up">
          <h1 className="font-display text-3xl text-ink tracking-tight">
            B2I
          </h1>
          <span className="font-mono text-2xs uppercase tracking-[0.15em] text-muted">
            Busy to Intentional
          </span>
          <div className="h-0.5 w-8 bg-amber ml-2" />
        </header>

        {/* Main content: Goals on top, then Kanban + Checklist */}
        <div className="space-y-6">
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
