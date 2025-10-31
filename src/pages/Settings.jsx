import { useAuth } from "../hooks/useAuth.js";
import { useStore } from "../store/useStore.js";

export default function Settings() {
  const { session } = useAuth();
  const {
    transactions,
    setTransactions,
    savings,
    setSavings,
    subscriptions,
    setSubscriptions,
  } = useStore();

  function exportAll() {
    const payload = {
      transactions,
      savings,
      subscriptions,
      exportedAt: new Date().toISOString(),
      version: "v1",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-tracker-${session?.username || "user"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importAll(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data?.transactions) setTransactions(data.transactions);
        if (data?.savings) setSavings(data.savings);
        if (data?.subscriptions) setSubscriptions(data.subscriptions);
        alert("Imported successfully.");
      } catch (err) {
        alert("Import failed: " + (err?.message || String(err)));
      } finally {
        // reset the input so the same file can be chosen again
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function clearAll() {
    const ok = confirm(
      "This will clear transactions, savings, and subscriptions for this account on this device. Continue?"
    );
    if (!ok) return;
    setTransactions([]);
    setSavings({
      emergency: { targetMonths: 3, monthlyExpenses: 0, balance: 0, history: [] },
      general: { name: "General Savings", balance: 0, history: [] },
      investments: { name: "Investments (manual)", balance: 0, history: [] },
    });
    setSubscriptions([]);
    alert("Cleared.");
  }

  return (
    <div className="card space-y-6">
      <div>
        <h3 className="font-semibold text-lg">Backup & Restore</h3>
        <p className="text-sm text-slate-300">
          Export your data to a JSON file and import it later if needed. Data is
          stored <em>locally</em> in your browser per account and per domain.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={exportAll} type="button">
          Export JSON
        </button>

        <label className="btn btn-secondary cursor-pointer">
          Import JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={importAll}
          />
        </label>

        <button className="btn btn-ghost" onClick={clearAll} type="button">
          Clear all data
