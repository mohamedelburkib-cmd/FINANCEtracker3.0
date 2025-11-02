import { useLocalStorage } from "./useLocalStorage.js";
import { useState, useEffect } from "react";

export function useTransactionManager() {
  const [transactions, setTransactions] = useLocalStorage("ft_transactions", []);
  const [categories] = useState([
    "Food & Dining",
    "Transportation", 
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Income",
    "Other"
  ]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-sm text-center mb-4">
              Or try these quick options:
            </p>
            <div className="space-y-2">
              <button
                onClick={handleDemo}
                disabled={loading}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                🚀 Demo Account
              </button>
              <button
                onClick={handleMaster}
                disabled={loading}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                👑 Master Login
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-slate-300 text-sm">Track Expenses</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-slate-300 text-sm">Smart Insights</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-slate-300 text-sm">Set Goals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
