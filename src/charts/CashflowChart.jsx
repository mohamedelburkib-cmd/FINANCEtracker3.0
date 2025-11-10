import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend,
} from "chart.js";
import { useMemo } from "react";
import { useStore } from "../store/useStore.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function CashflowChart() {
  const { transactions } = useStore();

  const { labels, series } = useMemo(() => {
    // group by month YYYY-MM
    const byMonth = new Map();
    transactions.forEach(t => {
      const m = (t.date || "").slice(0,7) || new Date().toISOString().slice(0,7);
      const delta = t.kind === "payment" ? Math.abs(t.amount) : -Math.abs(t.amount);
      byMonth.set(m, (byMonth.get(m) || 0) + delta);
    });
    const sorted = [...byMonth.keys()].sort();
    return {
      labels: sorted,
      series: sorted.map(m => byMonth.get(m)),
    };
  }, [transactions]);

  const data = {
    labels,
    datasets: [{
      label: "Net",
      data: series,
      borderWidth: 2,
      tension: 0.35,
    }],
  };
  const options = {
    animation: { duration: 300, easing: "easeOutQuart" },
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "var(--muted)" } },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { color: "var(--muted)" }, grid: { color: "rgba(0,0,0,0.06)" } },
      y: { ticks: { color: "var(--muted)" }, grid: { color: "rgba(0,0,0,0.06)" } },
    },
  };

  return <Line data={data} options={options} />;
}
