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
        // allow selecting the same file again later
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
      investments: { name: "Investments (manual)", balance: 0, history: 0 ? [] : [] },
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
        </button>

        <span className="text-sm text-slate-400">
          Signed in as <span className="font-semibold">@{session?.username}</span>
        </span>
      </div>

      <div className="pt-2 border-t border-slate-700">
        <h4 className="font-semibold mb-2">Tips</h4>
        <ul className="list-disc pl-6 text-sm text-slate-300 space-y-1">
          <li>
            Use <strong>Subscriptions</strong> to track recurring costs; add a matching
            transaction monthly for accurate charts.
          </li>
          <li>
            Keep categories consistent (e.g., “Rent”, “Groceries”, “Fuel”) to
            get clearer insights on the dashboard.
          </li>
          <li>
            Add contributions under <strong>Savings</strong>; the{" "}
            <strong>Projections</strong> page uses your contribution history.
          </li>
          <li>Back up regularly with Export JSON.</li>
        </ul>
      </div>
    </div>
  );
}
