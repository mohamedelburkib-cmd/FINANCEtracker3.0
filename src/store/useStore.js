import { useLocalStorage } from "../hooks/useLocalStorage.js";

const LS_DATA = "ft_data_v1";

const defaultState = {
  transactions: [],
  subscriptions: [],
  savings: {
    emergency: { targetMonths: 3, monthlyExpenses: 0, balance: 0, history: [] },
    general: { name: "General Savings", balance: 0, history: [] },
    investments: { name: "Investments (manual)", balance: 0, history: [] }
  },
  goals: []
};

export function useStore() {
  const [data, setData] = useLocalStorage(LS_DATA, defaultState);

  // Transactions
  function addTransaction(t) {
    setData(prev => ({ ...prev, transactions: [t, ...prev.transactions] }));
  }
  function deleteTransaction(id) {
    setData(prev => ({ ...prev, transactions: prev.transactions.filter(x => x.id !== id) }));
  }
  function setTransactions(next) {
    setData(prev => ({ ...prev, transactions: next }));
  }

  // Savings
  function setSavings(next) {
    setData(prev => ({ ...prev, savings: next }));
  }

  // Subscriptions
  function setSubscriptions(next) {
    setData(prev => ({ ...prev, subscriptions: next }));
  }

  // Goals
  function addGoal(g) {
    setData(prev => ({ ...prev, goals: [g, ...prev.goals] }));
  }
  function updateGoal(id, partial) {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => (g.id === id ? { ...g, ...partial } : g))
    }));
  }
  function deleteGoal(id) {
    setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  }

  return {
    transactions: data.transactions,
    subscriptions: data.subscriptions,
    savings: data.savings,
    goals: data.goals,
    addTransaction, deleteTransaction, setTransactions,
    setSavings, setSubscriptions,
    addGoal, updateGoal, deleteGoal
  };
}
