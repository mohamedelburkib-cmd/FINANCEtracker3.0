import { useLocalStorage } from "../hooks/useLocalStorage.js";

const LS_DATA = "ft_data_v1";

const defaultState = {
  transactions: [],
  subscriptions: [],
  savings: {
    emergency: { targetMonths: 3, monthlyExpenses: 0, balance: 0, history: [] },
    general: { name: "General Savings", balance: 0, history: [] },
    investments: { name: "Investments (manual)", balance: 0, history: [] },
  },
};

export function useStore() {
  const [data, setData] = useLocalStorage(LS_DATA, defaultState);

  // TRANSACTIONS
  function addTransaction(t) {
    setData((prev) => ({
      ...prev,
      transactions: [t, ...prev.transactions],
    }));
  }
  function deleteTransaction(id) {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((x) => x.id !== id),
    }));
  }

  // SAVINGS
  function setSavings(next) {
    setData((prev) => ({ ...prev, savings: next }));
  }

  // SUBSCRIPTIONS
  function setSubscriptions(next) {
    setData((prev) => ({ ...prev, subscriptions: next }));
  }

  // transactions setter (used by Settings import)
  function setTransactions(next) {
    setData((prev) => ({ ...prev, transactions: next }));
  }

  return {
    // state
    transactions: data.transactions,
    subscriptions: data.subscriptions,
    savings: data.savings,
    // actions
    addTransaction,
    deleteTransaction,
    setSavings,
    setSubscriptions,
    setTransactions,
  };
}
