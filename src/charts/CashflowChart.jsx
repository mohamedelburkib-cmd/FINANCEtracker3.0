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
import { groupBy, sum } from "../utils/format.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export default function CashflowChart({ transactions }) {
  const g = groupBy(transactions, (t) => t.date.slice(0, 7)); // YYYY-MM
  const months = Object.keys(g).sort();
  const data = months.map((m) => {
    const inc = sum(g[m].filter((t) => t.kind === "payment").map((t) => t.amount));
    const out = sum(g[m].filter((t) => t.kind !== "payment").map((t) => t.amount));
    return inc - out;
  });

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Monthly Net Cashflow</h3>
      <Line
        data={{
          labels: months,
          datasets: [{ label: "Net", data }],
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
  );
}
