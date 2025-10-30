import { useAuth } from "../hooks/useAuth.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export function useStore() {
  const { session } = useAuth();
  const uid = session?.userId || "anon";

  const [transactions, setTransactions] = useLocalStorage(`ft_tx_${uid}`, []);
  const [savings, setSavings] = useLocalStorage(`ft_sv_${uid}`, {
    emergency: { targetMonths: 3, monthlyExpenses: 0, balance: 0, history: [] },
    general: { name: "General Savings", balance: 0, history: [] },
    investments: { name: "Investments (manual)", balance: 0, history: [] },
  });
  const [subscriptions, setSubscriptions] = useLocalStorage(
    `ft_sub_${uid}`,
    []
  );

  return {
    transactions,
    setTransactions,
    savings,
    setSavings,
    subscriptions,
    setSubscriptions,
  };
}
