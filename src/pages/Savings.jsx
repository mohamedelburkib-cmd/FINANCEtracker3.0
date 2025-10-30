import { useState } from "react";
import { useStore } from "../store/useStore.js";
import { fmtGBP, parseAmount } from "../utils/format.js";

export default function Savings() {
  const { savings, setSavings } = useStore();
  const [tab, setTab] = useState("emergency");
  const acct = savings[tab];
  const [amount, setAmount] = useState("");

  function deposit(e) {
    e.preventDefault();
    const a = parseAmount(amount);
    if (!a) return;
    const now = new Date().toISOString();
    const updated = { ...savings };
    updated[tab] = {
      ...acct,
      balance: (acct.balance || 0) + a,
      history: [{ date: now, amount: a }, ...(acct.history || [])],
    };
    setSavings(updated);
    setAmount("");
  }

  return (
    <div className="card">
      <div className="flex gap-2 mb-4 flex-wrap">
        {["emergency", "general", "investments"].map((k) => (
          <button
            key={k}
            className={`btn ${tab === k ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab(k)}
          >
            {k}
          </button>
        ))}
      </div>

      {tab === "emergency" && (
        <div className="mb-4 grid md:grid-cols-3 gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-300">Target months</div>
            <input
              className="input"
              type="number"
              min="0"
              value={acct.targetMonths}
              onChange={(e) =>
                setSavings({
                  ...savings,
                  emergency: { ...acct, targetMonths: Number(e.target.value) },
                })
              }
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-300">
              Monthly expenses (£)
            </div>
            <input
              className="input"
              type="number"
              min="0"
              value={acct.monthlyExpenses}
              onChange={(e) =>
                setSavings({
                  ...savings,
                  emergency: { ...acct, monthlyExpenses: Number(e.target.value) },
                })
              }
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-slate-300">
              Target fund:{" "}
              <span className="font-semibold">
                {fmtGBP.format((acct.targetMonths || 0) * (acct.monthlyExpenses || 0))}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm text-slate-300">Balance</div>
        <div className="text-2xl font-bold">{fmtGBP.format(acct.balance || 0)}</div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={deposit}>
        <div className="md:col-span-2">
          <div className="text-sm font-semibold text-slate-300">Add money (£)</div>
          <input
            className="input"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>
        <div className="flex items-end">
          <button className="btn btn-primary w-full" type="submit">
            Add
          </button>
        </div>
      </form>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Recent contributions</h4>
        {(acct.history || []).length === 0 ? (
          <div className="text-sm text-slate-400">No contributions yet</div>
        ) : (
          <ul className="space-y-2">
            {(acct.history || []).map((h, i) => (
              <li
                key={i}
                className="flex justify-between text-sm border-b border-slate-700 pb-1"
              >
                <span>{new Date(h.date).toLocaleString()}</span>
                <span className="font-medium">{fmtGBP.format(h.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
