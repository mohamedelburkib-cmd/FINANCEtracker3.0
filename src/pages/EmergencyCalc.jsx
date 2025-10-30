import { useMemo, useState } from "react";
import { useStore } from "../store/useStore.js";
import { groupBy, sum, fmtGBP } from "../utils/format.js";

export default function EmergencyCalc() {
  const { transactions } = useStore();
  const [months, setMonths] = useState(3);

  const avgMonthly = useMemo(() => {
    const exp = transactions.filter((t) => t.kind !== "payment");
    const byMonth = groupBy(exp, (t) => t.date.slice(0, 7));
    const vals = Object.values(byMonth).map((list) => sum(list.map((x) => x.amount)));
    return vals.length ? sum(vals) / vals.length : 0;
  }, [transactions]);

  const target = months * avgMonthly;

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Emergency Fund Calculator</h3>
      <p className="text-sm text-slate-300 mb-4">
        We estimate your average monthly expenses from your transactions.
      </p>
      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-300">
            Average monthly spend
          </div>
          <div className="text-xl font-bold">{fmtGBP.format(avgMonthly)}</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-300">Months of cover</div>
          <input
            className="input"
            type="number"
            min="0"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-300">Target fund</div>
          <div className="text-xl font-bold">{fmtGBP.format(target)}</div>
        </div>
      </div>
    </div>
  );
}
