import { useEffect, useState } from "react";
import { useTransactionManager } from "../hooks/useTransactionManager.js";
import { useSubscriptionManager } from "../hooks/useSubscriptionManager.js";
import { Link } from "react-router-dom";

const fmtGBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export default function Dashboard() {
  const { transactions } = useTransactionManager();
  const { subscriptions } = useSubscriptionManager();

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [monthlySubscriptions, setMonthlySubscriptions] = useState(0);

  useEffect(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    setTotalIncome(income);
    setTotalExpenses(expenses);
    setBalance(income - expenses);

    const monthlySubs = subscriptions
      .filter((s) => s.frequency === "monthly")
      .reduce((sum, s) => sum + s.amount, 0);
    setMonthlySubscriptions(monthlySubs);
  }, [transactions, subscriptions]);

  const recentTransactions = transactions.slice(-5).reverse();

  const stats = [
    {
      title: "Total Balance",
      value: fmtGBP.format(balance),
      icon: "💰",
      color: balance >= 0 ? "from-green-500 to-emerald-600" : "from-red-500 to-rose-600",
      textColor: balance >= 0 ? "text-green-400" : "text-red-400",
    },
    {
      title: "Total Income",
      value: fmtGBP.format(totalIncome),
      icon: "📈",
      color: "from-blue-500 to-cyan-600",
      textColor: "text-blue-400",
    },
    {
      title: "Total Expenses",
      value: fmtGBP.format(totalExpenses),
      icon: "📉",
      color: "from-orange-500 to-red-600",
      textColor: "text-orange-400",
    },
    {
      title: "Monthly Subscriptions",
      value: fmtGBP.format(monthlySubscriptions),
      icon: "🔄",
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl p-8 border border-indigo-500/30">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-300">Track your financial health at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
            </div>
            <h3 className="text-slate-300 font-medium">{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="card bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
            <Link
              to="/transactions"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "⬆️" : "⬇️"}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.title}</p>
                      <p className="text-slate-400 text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {fmtGBP.format(transaction.amount)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No transactions yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-gradient-to-br from-slate-800 to-slate-900">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/transactions"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all"
            >
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="text-white font-medium">Add Transaction</h3>
                <p className="text-slate-400 text-sm">Record income or expense</p>
              </div>
            </Link>
            <Link
              to="/subscriptions"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all"
            >
              <span className="text-2xl">🔄</span>
              <div>
                <h3 className="text-white font-medium">Manage Subscriptions</h3>
                <p className="text-slate-400 text-sm">Track recurring payments</p>
              </div>
            </Link>
            <Link
              to="/emergency-calc"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all"
            >
              <span className="text-2xl">🚨</span>
              <div>
                <h3 className="text-white font-medium">Emergency Fund</h3>
                <p className="text-slate-400 text-sm">Calculate your safety net</p>
              </div>
            </Link>
            <Link
              to="/projections"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-xl border border-orange-500/30 hover:border-orange-500/50 transition-all"
            >
              <span className="text-2xl">📈</span>
              <div>
                <h3 className="text-white font-medium">Financial Projections</h3>
                <p className="text-slate-400 text-sm">Plan your financial future</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
