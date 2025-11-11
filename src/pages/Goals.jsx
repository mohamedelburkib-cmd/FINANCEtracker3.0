import { useStore } from "../store/useStore.js";
import { useState } from "react";

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useStore();
  const [open, setOpen] = useState(false);

  function onAdd(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name")?.toString().trim();
    const target = Number(fd.get("target") || 0);
    const saved = Number(fd.get("saved") || 0);
    const deadline = fd.get("deadline") || "";
    const category = fd.get("category") || "General";
    if (!name || !target) return;

    addGoal({
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      name, target, saved, deadline, category,
      createdAt: new Date().toISOString()
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Savings Goals</h2>
          <button className="btn btn-primary" onClick={()=>setOpen(true)}>Add goal</button>
        </div>

        {goals.length === 0 && (
          <div className="text-center" style={{color:"var(--muted)"}}>
            No goals yet. Click “Add goal” to get started.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          {goals.map(g => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100 || 0));
            return (
              <div key={g.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{g.name}</div>
                    <div className="text-xs" style={{color:"var(--muted)"}}>
                      {g.category}{g.deadline ? ` • target by ${g.deadline}` : ""}
                    </div>
                  </div>
                  <button className="btn btn-ghost" onClick={()=>deleteGoal(g.id)}>Remove</button>
                </div>
                <div className="mt-3">
                  <div className="h-2 rounded-full" style={{background:"var(--border)"}}>
                    <div className="h-2 rounded-full"
                      style={{ width:`${pct}%`, background:`hsl(var(--brand-hue) 85% 58%)` }} />
                  </div>
                  <div className="text-xs mt-1" style={{color:"var(--muted)"}}>
                    £{(g.saved||0).toLocaleString()} / £{(g.target||0).toLocaleString()} ({pct}%)
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="btn btn-secondary"
                    onClick={()=>updateGoal(g.id, { saved: Math.min(g.target, (g.saved||0) + 50) })}>
                    + £50
                  </button>
                  <button className="btn btn-secondary"
                    onClick={()=>updateGoal(g.id, { saved: Math.max(0, (g.saved||0) - 50) })}>
                    - £50
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md card rounded-none" style={{ borderLeft: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Add a goal</h3>
              <button className="btn btn-ghost" onClick={()=>setOpen(false)}>Close</button>
            </div>
            <form onSubmit={onAdd} className="space-y-3">
              <input name="name" className="input" placeholder="e.g., Car Fund" required />
              <input name="target" className="input" type="number" step="0.01" placeholder="Target amount" required />
              <input name="saved" className="input" type="number" step="0.01" placeholder="Already saved (optional)" />
              <input name="deadline" className="input" type="date" />
              <input name="category" className="input" placeholder="Category (optional)" />
              <div className="flex gap-2 pt-2">
                <button className="btn btn-primary" type="submit">Add goal</button>
                <button className="btn btn-ghost" type="button" onClick={()=>setOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
