import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/apiSlice.js";
import { setCredentials } from "../../store/authSlice.js";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, state] = useLoginMutation();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }));
      toast.success("Login successful");
      navigate(location.state?.from || (result.user.role === "admin" ? "/admin/analytics" : "/dashboard/bookings"));
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <form onSubmit={form.handleSubmit(onSubmit)} className="card p-6">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <div className="mt-4 space-y-3">
          <input placeholder="Email" {...form.register("email")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input
            placeholder="Password"
            type="password"
            {...form.register("password")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <p className="mt-2 text-sm text-red-600">{form.formState.errors.email?.message || form.formState.errors.password?.message}</p>
        <button type="submit" disabled={state.isLoading} className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
          {state.isLoading ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          New account? <Link to="/register" className="font-semibold text-teal-700">Register</Link>
        </p>
      </form>
    </section>
  );
}
