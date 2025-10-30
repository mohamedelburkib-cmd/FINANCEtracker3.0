import { useState } from "react";
import { useStore } from "../store/useStore.js";
import { fmtGBP, todayISO, parseAmount } from "../utils/format.js";
import { v4 as uuid } from "uuid";

export default function Transactions() {
  const { transactions, setTransactions } = useStore();
  const [form, setForm] = useState({
    kind: "expense",
    amount: "",
    date: todayISO(),
    category: "",
    note: "",
  });

  function addTx(e) {
    e.preventDefault();
    const tx = { id: uuid(), ...form, amount: parseAmount(form.amount) };
    setTransactions([tx, ...transactions]);
    setForm({ kind: "expense", amount: "", date: todayISO(), category: "", note: "" });
  }

  function remove(id) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Add Transaction</h3>
        <form className="grid grid-cols-2 gap-3" onSubmit={addTx}>
          <div className="col-span-2">
            <label className="text-sm font-semibold text-slate-300">Type</label>
            <select
              className="input"
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="subscription">Subscription</option>
              <option value="payment">Income / Payment</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300">Amount (£)</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300">Date</label>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-semibold text-slate-300">Category</label>
            <input
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Groceries, Rent, Salary..."
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-semibold text-slate-300">Note</label>
            <input
              className="input"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <button className="btn btn-primary col-span-2" type="submit">
            Add
          </button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold mb-2">Transactions</h3>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-300">
            <tr>
              <th className="py-2 pr-2">Date</th>
              <th className="py-2 pr-2">Type</th>
              <th className="py-2 pr-2">Category</th>
              <th className="py-2 pr-2">Amount</th>
              <th className="py-2 pr-2" />
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-slate-700">
                <td className="py-2 pr-2">{t.date}</td>
                <td className="py-2 pr-2 capitalize">{t.kind}</td>
                <td className="py-2 pr-2">{t.category || "—"}</td>
                <td className="py-2 pr-2">{fmtGBP.format(t.amount)}</td>
                <td className="py-2 pr-2 text-right">
                  <button className="btn btn-ghost" onClick={() => remove(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
