import { useState } from "react";
import { useStore } from "../store/useStore.js";
import { fmtGBP, todayISO, parseAmount } from "../utils/format.js";
import { v4 as uuid } from "uuid";

export default function Subscriptions() {
  const { subscriptions, setSubscriptions } = useStore();
  const [form, setForm] = useState({
    name: "",
    amount: "",
    cadence: "monthly",
    start: todayISO(),
  });

  function addSub(e) {
    e.preventDefault();
    const s = { id: uuid(), ...form, amount: parseAmount(form.amount) };
    setSubscriptions([s, ...subscriptions]);
    setForm({ name: "", amount: "", cadence: "monthly", start: todayISO() });
  }
  function remove(id) {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Add Subscription</h3>
        <form className="grid grid-cols-2 gap-3" onSubmit={addSub}>
          <div className="col-span-2">
            <label className="text-sm font-semibold text-slate-300">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Netflix, Gym..."
            />
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
            <label className="text-sm font-semibold text-slate-300">Cadence</label>
            <select
              className="input"
              value={form.cadence}
              onChange={(e) => setForm({ ...form, cadence: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-semibold text-slate-300">Start date</label>
            <input
              className="input"
              type="date"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              required
            />
          </div>
          <button className="btn btn-primary col-span-2" type="submit">
            Add
          </button>
        </form>
      </div>

      <div className="card overflow-x-auto">
        <h3 className="font-semibold mb-2">Subscriptions</h3>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-300">
            <tr>
              <th className="py-2 pr-2">Name</th>
              <th className="py-2 pr-2">Cadence</th>
              <th className="py-2 pr-2">Amount</th>
              <th className="py-2 pr-2">Start</th>
              <th className="py-2 pr-2" />
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id} className="border-t border-slate-700">
                <td className="py-2 pr-2">{s.name}</td>
                <td className="py-2 pr-2 capitalize">{s.cadence}</td>
                <td className="py-2 pr-2">{fmtGBP.format(s.amount)}</td>
                <td className="py-2 pr-2">{s.start}</td>
                <td className="py-2 pr-2 text-right">
                  <button className="btn btn-ghost" onClick={() => remove(s.id)}>
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
