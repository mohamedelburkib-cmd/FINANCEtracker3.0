import { useMemo, useState } from "react";
import { useStore } from "../store/useStore.js";
import { fmtGBP } from "../utils/format.js";
import { Plus, X } from "lucide-react";

const CATEGORIES = ["Rent", "Groceries", "Fuel", "Eating Out", "Bills", "Shopping", "Health", "Travel", "Income"];

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction } = useStore();
  const [panelOpen, setPanelOpen] = useState(false);

  const total = useMemo(
    () => transactions.reduce((a, t) => a + (t.kind === "payment" ? t.amount : -Math.abs(t.amount)), 0),
    [transactions]
  );

  function onQuickAdd(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const kind = fd.get("kind"); // "expense" or "payment"
    const amount = Number(fd.get("amount") || 0);
    const category = fd.get("category") || "Other";
    const note = fd.get("note") || "";
    const date = fd.get("date") || new Date().toISOString().slice(0, 10);

    addTransaction({
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      kind: kind === "payment" ? "payment" : "expense",
      amount: kind === "payment" ? Math.abs(amount) : Math.abs(amount),
      category,
      note,
      date,
    });
    e.currentTarget.reset();
    setPanelOpen(false);
  }

  return (
    <>
      <div className="grid md:grid-cols-[1fr_360px] gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <button className="btn btn-primary" onClick={() => setPanelOpen(true)}>
              <Plus size={16} /> Quick add
            </button>
          </div>
          <div className="text-sm text-slate-300 mb-3">Net balance impact: <span className="font-semibold">{fmtGBP.format(total)}</span></div>

          <div className="divide-y divide-slate-800/60">
            {transactions.length === 0 && <div className="text-slate-400 py-8 text-center">No transactions yet.</div>}
            {transactions.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="pill">{t.category}</span>
                  <div>
                    <div className="font-medium">{t.note || (t.kind === "payment" ? "Payment" : "Expense")}</div>
                    <div className="text-xs text-slate-400">{t.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`${t.kind === "payment" ? "text-emerald-400" : "text-rose-400"} font-semibold`}>
                    {t.kind === "payment" ? "+" : "-"}{fmtGBP.format(Math.abs(t.amount))}
                  </div>
                  <button className="btn btn-ghost" onClick={() => deleteTransaction(t.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick summary */}
        <div className="card">
          <h3 className="font-semibold mb-2">Quick summary</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex justify-between"><span>Total items</span><span>{transactions.length}</span></li>
            <li className="flex justify-between"><span>Net change</span><span className={`${total >= 0 ? "text-emerald-400" : "text-rose-400"} font-semibold`}>{fmtGBP.format(total)}</span></li>
          </ul>
        </div>
      </div>

      {/* Slide-over panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md card rounded-none border-l border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Add transaction</h3>
              <button className="btn btn-ghost" onClick={() => setPanelOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={onQuickAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2">
                  <input type="radio" name="kind" value="expense" defaultChecked /> Expense
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="kind" value="payment" /> Payment
                </label>
              </div>
              <div>
                <label className="text-sm text-slate-300">Amount</label>
                <input name="amount" type="number" step="0.01" required className="input" placeholder="0.00" />
              </div>
              <div>
                <label className="text-sm text-slate-300">Category</label>
                <select name="category" className="input">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300">Note</label>
                <input name="note" className="input" placeholder="Optional note" />
              </div>
              <div>
                <label className="text-sm text-slate-300">Date</label>
                <input name="date" type="date" className="input" defaultValue={new Date().toISOString().slice(0,10)} />
              </div>
              <div className="flex gap-2 pt-2">
                <button className="btn btn-primary" type="submit"><Plus size={16}/> Add</button>
                <button className="btn btn-ghost" type="button" onClick={() => setPanelOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
