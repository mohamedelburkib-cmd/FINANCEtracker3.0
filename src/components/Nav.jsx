import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/transactions", label: "Transactions" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/savings", label: "Savings" },
  { to: "/calculator", label: "Emergency Calc" },
  { to: "/projections", label: "Projections" },
  { to: "/settings", label: "Settings" },
];

export default function Nav() {
  return (
    <nav className="mb-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `card text-center font-medium transition ${
              isActive ? "outline outline-2 outline-indigo-500/60" : ""
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
