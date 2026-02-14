import { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useCreateReviewMutation, useGetMyBookingsQuery } from "../../store/apiSlice.js";

export default function UserReviewsPage() {
  const { data } = useGetMyBookingsQuery();
  const [createReview, state] = useCreateReviewMutation();
  const completedBookings = useMemo(
    () => (data?.data || []).filter((booking) => booking.status === "completed"),
    [data]
  );

  const form = useForm({
    defaultValues: { service: "", rating: 5, comment: "" },
  });

  const onSubmit = async (values) => {
    try {
      await createReview({ ...values, rating: Number(values.rating) }).unwrap();
      toast.success("Review submitted");
      form.reset({ service: "", rating: 5, comment: "" });
    } catch (error) {
      toast.error(error?.data?.message || "Review failed");
    }
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <SectionHeader title="Leave a review" subtitle="Rate services after completed bookings." />
      <form onSubmit={form.handleSubmit(onSubmit)} className="card p-6">
        <select {...form.register("service")} className="w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="">Select service</option>
          {completedBookings.map((booking) => (
            <option key={booking._id} value={booking.service?._id}>
              {booking.service?.title}
            </option>
          ))}
        </select>
        <select {...form.register("rating")} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} stars
            </option>
          ))}
        </select>
        <textarea {...form.register("comment")} placeholder="Comment" className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2" />
        <button type="submit" disabled={state.isLoading} className="mt-4 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
          {state.isLoading ? "Submitting..." : "Submit review"}
        </button>
      </form>
    </section>
  );
}
