// src/pages/Dashboard.jsx
import CashflowChart from "../charts/CashflowChart.jsx";
import SpendByCategoryChart from "../charts/SpendByCategoryChart.jsx";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card chart-card">
          <h3 className="font-semibold mb-2">Cashflow</h3>
          <CashflowChart />
        </div>
        <div className="card chart-card">
          <h3 className="font-semibold mb-2">Spend by Category</h3>
          <SpendByCategoryChart />
        </div>
      </div>
    </div>
  );
}
