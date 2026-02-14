import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-semibold ${
    isActive ? "bg-white text-teal-800" : "text-white/90 hover:bg-white/15"
  }`;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="grid min-h-screen md:grid-cols-[auto_1fr]">
      <aside className={`bg-teal-900 p-4 ${collapsed ? "w-20" : "w-64"}`}>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="mb-4 rounded-lg bg-white/20 px-3 py-2 text-xs font-bold tracking-wide text-white"
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
        <Link to="/" className="mb-4 block text-xl font-black text-white">
          {collapsed ? "F" : "Fixora Admin"}
        </Link>
        <nav className="space-y-1">
          <NavLink to="/admin/analytics" className={linkClass}>Overview</NavLink>
          <NavLink to="/admin/services" className={linkClass}>Services</NavLink>
          <NavLink to="/admin/categories" className={linkClass}>Categories</NavLink>
          <NavLink to="/admin/bookings" className={linkClass}>Bookings</NavLink>
          <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
        </nav>
      </aside>
      <main className="bg-slate-50 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
