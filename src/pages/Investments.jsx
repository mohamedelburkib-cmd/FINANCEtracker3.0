import { useState } from 'react';
import { useInvestments } from '../hooks/useInvestments';

const fmt = (v) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(v);

export default function Investments() {
  const { investments, addInvestment, updateValue, removeInvestment, totalInvested, totalCurrent, totalGainLoss } =
    useInvestments();

  const [form, setForm] = useState({ name: '', symbol: '', amount: '', type: 'stock' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    addInvestment({ ...form, amount: Number(form.amount) });
    setForm({ name: '', symbol: '', amount: '', type: 'stock' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Investments</h1>
        <p className="text-text-muted">Track your portfolio performance</p>
      </header>

      {/* KPI Cards */}
      <section className="grid-auto">
        <div className="card">
          <p className="text-text-muted text-sm">Total Invested</p>
          <p className="text-2xl font-semibold">{fmt(totalInvested)}</p>
        </div>
        <div className="card">
          <p className="text-text-muted text-sm">Current Value</p>
          <p className="text-2xl font-semibold">{fmt(totalCurrent)}</p>
        </div>
        <div className="card">
          <p className="text-text-muted text-sm">Gain / Loss</p>
          <p className={`text-2xl font-semibold ${totalGainLoss >= 0 ? 'text-success' : 'text-danger'}`}>
            {fmt(totalGainLoss)}
          </p>
        </div>
      </section>

      {/* Add Form */}
      <section className="card">
        <h2 className="text-lg font-semibold mb-4">Add Investment</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="input"
            placeholder="Name (e.g. Apple)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Symbol (e.g. AAPL)"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
      </section>

      {/* List */}
      <section className="card">
        <h2 className="text-lg font-semibold mb-4">Holdings</h2>
        {investments.length === 0 ? (
          <p className="text-text-muted">No investments yet</p>
        ) : (
          <div className="space-y-3">
            {investments.map((inv) => {
              const gain = inv.currentValue - inv.amount;
              return (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-text-primary">
                      {inv.name} {inv.symbol && `(${inv.symbol})`}
                    </p>
                    <p className="text-sm text-text-muted">{inv.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{fmt(inv.currentValue)}</p>
                    <p className={`text-sm ${gain >= 0 ? 'text-success' : 'text-danger'}`}>
                      {gain >= 0 ? '+' : ''}{fmt(gain)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeInvestment(inv.id)}
                    className="ml-4 btn btn-danger text-sm"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
