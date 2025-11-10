import { useState } from "react";
import { fmtGBP } from "../utils/format.js";

export default function Investments() {
  const [rows, setRows] = useState([]); // {id, symbol, qty, costPer, notes}

  function addRow(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const symbol = String(fd.get("symbol") || "").toUpperCase();
    const qty = Number(fd.get("qty") || 0);
    const costPer = Number(fd.get("costPer") || 0);
    const notes = fd.get("notes") || "";
    if (!symbol || !qty || !costPer) return;

    setRows(prev => [...prev, {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      symbol, qty, costPer, notes
    }]);
    e.currentTarget.reset();
  }

  const totalCost = rows.reduce((a, r) => a + r.qty * r.costPer, 0);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Investments</h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Track holdings with quantity and average cost. (Live prices can be added later.)
        </p>
        <form onSubmit={addRow} className="grid md:grid-cols-5 gap-3">
          <input name="symbol" className="input" placeholder="Ticker (e.g., AAPL)" />
          <input name="qty" className="input" type="number" step="0.0001" placeholder="Qty" />
          <input name="costPer" className="input" type="number" step="0.01" placeholder="Avg cost" />
          <input name="notes" className="input" placeholder="Notes (optional)" />
          <button className="btn btn-primary" type="submit">Add</button>
        </form>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Holdings</h3>
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            Total cost: <span className="font-semibold">{fmtGBP.format(totalCost)}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ color: "var(--muted)" }}>
              <tr className="text-left" style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="py-2 pr-2">Symbol</th>
                <th className="py-2 pr-2">Qty</th>
                <th className="py-2 pr-2">Avg cost</th>
                <th className="py-2 pr-2">Cost basis</th>
                <th className="py-2 pr-2">Notes</th>
                <th className="py-2 pr-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center" style={{ color: "var(--muted)" }}>No holdings yet.</td></tr>
              )}
              {rows.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2 pr-2 font-semibold">{r.symbol}</td>
                  <td className="py-2 pr-2">{r.qty}</td>
                  <td className="py-2 pr-2">{fmtGBP.format(r.costPer)}</td>
                  <td className="py-2 pr-2">{fmtGBP.format(r.qty * r.costPer)}</td>
                  <td className="py-2 pr-2">{r.notes}</td>
                  <td className="py-2 pr-2">
                    <button className="btn btn-ghost" onClick={() => setRows(prev => prev.filter(x => x.id !== r.id))}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
