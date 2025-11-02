import { useLocalStorage } from './useLocalStorage';

export function useInvestments() {
  const [investments, setInvestments] = useLocalStorage('ft_investments', []);

  const addInvestment = (inv) => {
    const newInv = {
      ...inv,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      currentValue: inv.amount, // seed with initial
    };
    setInvestments((prev) => [newInv, ...prev]);
  };

  const updateValue = (id, newValue) => {
    setInvestments((prev) =>
      prev.map((i) => (i.id === id ? { ...i, currentValue: newValue } : i))
    );
  };

  const removeInvestment = (id) => {
    setInvestments((prev) => prev.filter((i) => i.id !== id));
  };

  const totalInvested = investments.reduce((s, i) => s + i.amount, 0);
  const totalCurrent = investments.reduce((s, i) => s + i.currentValue, 0);
  const totalGainLoss = totalCurrent - totalInvested;

  return {
    investments,
    addInvestment,
    updateValue,
    removeInvestment,
    totalInvested,
    totalCurrent,
    totalGainLoss,
  };
}
