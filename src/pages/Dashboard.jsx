import { useMemo } from "react";
import { useStore } from "../store/useStore.js";
import { fmtGBP, sum, groupBy } from "../utils/format.js";
import CashflowChart from "../charts/CashflowChart.jsx";
import SpendByCategoryChart from "../charts/SpendByCategoryChart.jsx";

export default function Dashboard() {
  const { transactions, savings } = useStore();
  const totalIncome = useMemo(
    () => sum(transactions.filter((t) => t.kind === "payment").map((t) => t.amount)),
    [transactions]
  );
  const totalExpense = useMemo(
    () => sum(transactions.filter((t) => t.kind !== "payment").map((t) => t.amount)),
    [transactions]
  );
  const net = totalIncome - totalExpense;

  const byCat = useMemo(() => {
    const exp = transactions.filter((t) => t.kind !== "payment");
    const g = groupBy(exp, (x) => x.category || "Uncategorized");
    return Object.entries(g)
      .map(([k, v]) => ({ label: k, value: sum(v.map((x) => x.amount)) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const cash =
    (savings?.general?.balance || 0) +
    (savings?.emergency?.balance || 0) +
    (savings?.investments?.balance || 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-slate-400 text-sm">Income</div>
          <div className="text-2xl font-bold">{fmtGBP.format(totalIncome)}</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm">Expenses</div>
          <div className="text-2xl font-bold">{fmtGBP.format(totalExpense)}</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm">Net</div>
          <div className="text-2xl font-bold">{fmtGBP.format(net)}</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm">Total Savings</div>
          <div className="text-2xl font-bold">{fmtGBP.format(cash)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <SpendByCategoryChart data={byCat} />
        <CashflowChart transactions={transactions} />
      </div>
    </div>
  );
}
