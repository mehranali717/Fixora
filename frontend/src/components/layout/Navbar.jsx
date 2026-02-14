import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLogoutApiMutation } from "../../store/apiSlice.js";
import { logout } from "../../store/authSlice.js";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-teal-50"
  }`;

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutApiMutation();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-black text-teal-800">
          Fixora UAE
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/services" className={navClass}>
            Services
          </NavLink>
          {!user ? (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              {user.role === "admin" ? (
                <NavLink to="/admin/analytics" className={navClass}>
                  Admin
                </NavLink>
              ) : (
                <NavLink to="/dashboard/bookings" className={navClass}>
                  Dashboard
                </NavLink>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
