// src/pages/Signup.jsx
import { useState } from "react";
import api, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // default to admin (you can change to "user")
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) return "Valid email is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // call backend register endpoint
      const res = await api.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role, // here role = "admin"
      });

      // If your backend returns token on register, store it; else you may login next
      // Example: assume res.data.token
      if (res.data?.token) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        setAuthToken(token);
      }

      setSuccess("Account created successfully. Redirecting...");
      // wait a bit then redirect (or redirect immediately)
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      // read backend error message
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create an admin account</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 mb-3 rounded">{success}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>

          {/* Optional: expose role selection if you want; hidden if you always create admin */}
          <div className="hidden">
            <label className="block text-sm font-medium mb-1">Role</label>
            <select name="role" value={form.role} onChange={onChange} className="w-full border rounded px-3 py-2">
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
