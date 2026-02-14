import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../store/apiSlice.js";
import { setCredentials } from "../../store/authSlice.js";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  password: z.string().min(6),
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerApi, state] = useRegisterMutation();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      const result = await registerApi(values).unwrap();
      dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }));
      toast.success("Account created");
      navigate("/dashboard/bookings");
    } catch (error) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <form onSubmit={form.handleSubmit(onSubmit)} className="card p-6">
        <h1 className="text-2xl font-bold">Create account</h1>
        <div className="mt-4 space-y-3">
          <input placeholder="Full name" {...form.register("name")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input placeholder="Email" {...form.register("email")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input placeholder="Phone" {...form.register("phone")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input
            placeholder="Password"
            type="password"
            {...form.register("password")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <p className="mt-2 text-sm text-red-600">
          {form.formState.errors.name?.message ||
            form.formState.errors.email?.message ||
            form.formState.errors.phone?.message ||
            form.formState.errors.password?.message}
        </p>
        <button type="submit" disabled={state.isLoading} className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
          {state.isLoading ? "Creating..." : "Register"}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-teal-700">Sign in</Link>
        </p>
      </form>
    </section>
  );
}
