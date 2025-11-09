import { NavLink } from "react-router-dom";
import { LayoutGrid, CreditCard, CalendarClock, PiggyBank, Calculator, LineChart, Settings, Wallet } from "lucide-react";

export default function Nav({ collapsed }) {
  const item = (to, label, Icon) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `navlink ${isActive ? "navlink-active" : ""} ${collapsed ? "justify-center" : ""}`
      }
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );

  return (
    <nav className="space-y-1">
      {item("/", "Dashboard", LayoutGrid)}
      {item("/transactions", "Transactions", CreditCard)}
      {item("/subscriptions", "Subscriptions", CalendarClock)}
      {item("/savings", "Savings", PiggyBank)}
      {item("/calculator", "Emergency Calc", Calculator)}
      {item("/projections", "Projections", LineChart)}
      {item("/investments", "Investments", Wallet)}
      <div className="pt-3 border-t border-slate-800/60" />
      {item("/settings", "Settings", Settings)}
    </nav>
  );
}
