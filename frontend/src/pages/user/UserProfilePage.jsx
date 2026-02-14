import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useUpdateProfileMutation } from "../../store/apiSlice.js";
import { setCredentials } from "../../store/authSlice.js";

export default function UserProfilePage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [updateProfile, state] = useUpdateProfileMutation();
  const form = useForm({ defaultValues: { name: "", email: "", phone: "" } });

  useEffect(() => {
    if (auth.user) {
      form.reset({
        name: auth.user.name || "",
        email: auth.user.email || "",
        phone: auth.user.phone || "",
      });
    }
  }, [auth.user, form]);

  const onSubmit = async (values) => {
    try {
      const result = await updateProfile(values).unwrap();
      dispatch(setCredentials({ accessToken: auth.accessToken, user: result.data }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <SectionHeader title="Profile settings" subtitle="Keep your account details current for smooth bookings." />
      <form onSubmit={form.handleSubmit(onSubmit)} className="card p-6">
        <div className="space-y-3">
          <input {...form.register("name")} placeholder="Name" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input {...form.register("email")} placeholder="Email" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input {...form.register("phone")} placeholder="Phone" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <button type="submit" disabled={state.isLoading} className="mt-4 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
          {state.isLoading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}
