import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";
import { useStore } from "../store/useStore.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SpendByCategoryChart() {
  const { transactions } = useStore();

  const { labels, values } = useMemo(() => {
    const byCat = new Map();
    transactions.forEach(t => {
      if (t.kind === "expense") {
        const key = t.category || "Other";
        byCat.set(key, (byCat.get(key) || 0) + Math.abs(t.amount));
      }
    });
    const labels = [...byCat.keys()];
    const values = labels.map(k => byCat.get(k));
    return { labels, values };
  }, [transactions]);

  const data = {
    labels,
    datasets: [{
      data: values,
    }],
  };

  const options = {
    animation: { duration: 300, easing: "easeOutQuart" },
    plugins: {
      legend: { position: "bottom", labels: { color: "var(--muted)" } },
      tooltip: { enabled: true },
    },
    hover: {
      onHover: (evt, active) => {
        evt.native.target.style.cursor = active?.length ? "pointer" : "default";
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
