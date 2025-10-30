import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SpendByCategoryChart({ data }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Spending by Category (YTD)</h3>
      <Doughnut
        data={{
          labels: data.map((d) => d.label),
          datasets: [{ data: data.map((d) => d.value) }],
        }}
        options={{
          plugins: { legend: { position: "bottom", labels: { color: "#e5e7eb" } } },
        }}
      />
    </div>
  );
}
