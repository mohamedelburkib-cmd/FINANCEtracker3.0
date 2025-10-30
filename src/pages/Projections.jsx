import { useMemo, useState } from "react";
import { useStore } from "../store/useStore.js";
import { fmtGBP, sum, weeksBetween } from "../utils/format.js";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export default function Projections() {
  const { savings } = useStore();
  const history = savings.general.history || [];
  const [weeks, setWeeks] = useState(26);
  const startBalance = savings.general.balance || 0;

  const weeklyAvg = useMemo(() => {
    if (history.length < 1) return 0;
    const sorted = [...history].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const first = sorted[0].date;
    const last = sorted[sorted.length - 1].date;
    const spanWeeks = Math.max(weeksBetween(first, last), 1 / 7);
    const total = sum(sorted.map((h) => h.amount));
    return total / spanWeeks;
  }, [history]);

  const labels = Array.from({ length: weeks + 1 }, (_, i) => `W${i}`);
  let bal = startBalance;
  const data = labels.map((_, i) => {
    if (i > 0) bal += weeklyAvg;
    return bal;
  });

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Predictive Savings Projection</h3>
        <p className="text-sm text-slate-300 mb-2">
          Uses your average weekly contribution (based on history) to project forward.
        </p>
        <div className="mb-3">
          <div className="text-sm font-semibold text-slate-300">Weeks ahead</div>
          <input
            className="input"
            type="number"
            min="1"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
          />
        </div>
        <div className="text-sm text-slate-300">
          Current avg weekly contribution:{" "}
          <span className="font-semibold">{fmtGBP.format(weeklyAvg)}</span>
        </div>
      </div>
      <div className="card">
        <Line
          data={{
            labels,
            datasets: [{ label: "Projected Balance", data }],
          }}
          options={{
            scales: {
              y: { beginAtZero: true, ticks: { color: "#e5e7eb" } },
              x: { ticks: { color: "#e5e7eb" } },
            },
            plugins: { legend: { labels: { color: "#e5e7eb" } } },
          }}
        />
      </div>
    </div>
  );
}
