import { useAuth } from "../hooks/useAuth.js";
import { useStore } from "../store/useStore.js";

export default function Settings() {
  const { session } = useAuth();
  const store = useStore();

  function exportAll() {
    const blob = new Blob([JSON.stringify(store, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-tracker-${session.email}.json`;
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
        if (!data) throw new Error("Invalid file");
        if (data.transactions) store.setTransactions(data.transactions);
        if (data.savings) store.setSavings(data.savings);
        if (data.subscriptions) store.setSubscriptions(data.subscriptions);
        alert("Imported!");
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold">Backup & Restore</h3>
      <div className="flex gap-2 items-center flex-wrap">
        <button className="btn btn-primary" onClick={exportAll}>
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
        <span className="text-sm text-slate-300">
          Data is stored locally in your browser (per account).
        </span>
      </div>
      <div className="pt-2 border-t border-slate-700">
        <h4 className="font-semibold mb-1">Tips & Suggestions</h4>
        <ul className="list-disc pl-6 text-sm text-slate-300 space-y-1">
          <li>
            Use Subscriptions to list recurring costs—then add matching transactions monthly.
          </li>
          <li>Keep categories consistent for better charts.</li>
          <li>Add savings contributions under the Savings tab; projections use that history.</li>
          <li>Back up your data regularly with Export JSON (you can Import later).</li>
        </ul>
      </div>
    </div>
  );
}
