import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import {
  useCreateBookingMutation,
  useGetServiceByIdQuery,
  useGetServiceReviewsQuery,
} from "../../store/apiSlice.js";

const bookingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(2, "Time slot is required"),
  address: z.string().min(5, "Address is required"),
});

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetServiceByIdQuery(id);
  const reviewsQuery = useGetServiceReviewsQuery(id);
  const [createBooking, bookingState] = useCreateBookingMutation();
  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { date: "", timeSlot: "", address: "" },
  });

  const onSubmit = async (values) => {
    try {
      await createBooking({ ...values, service: id }).unwrap();
      toast.success("Booking created");
      form.reset();
    } catch (error) {
      toast.error(error?.data?.message || "Booking failed");
    }
  };

  if (isLoading) return <Loader text="Loading service..." />;
  if (isError || !data?.data) return <EmptyState title="Service unavailable" description="The service may have been removed." />;

  const service = data.data;
  const reviews = reviewsQuery.data?.data || [];

  return (
    <section className="grid gap-6 lg:grid-cols-5">
      <article className="card lg:col-span-3">
        {service.images?.[0] ? (
          <img src={service.images[0]} alt={service.title} className="h-64 w-full rounded-t-2xl object-cover" />
        ) : null}
        <div className="p-5">
          <h1 className="text-3xl font-black">{service.title}</h1>
          <p className="mt-3 text-slate-700">{service.description}</p>
          <div className="mt-5 flex gap-6">
            <p className="text-lg">
              <span className="text-slate-500">Price:</span> <strong>AED {service.price}</strong>
            </p>
            <p className="text-lg">
              <span className="text-slate-500">Duration:</span> <strong>{service.duration} mins</strong>
            </p>
          </div>
        </div>
      </article>

      <aside className="space-y-6 lg:col-span-2">
        <form onSubmit={form.handleSubmit(onSubmit)} className="card p-5">
          <h3 className="text-xl font-bold">Book this service</h3>
          <div className="mt-3 space-y-3">
            <input type="date" {...form.register("date")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            <input placeholder="Time slot (e.g. 10:00 AM - 12:00 PM)" {...form.register("timeSlot")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            <textarea placeholder="Address" {...form.register("address")} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </div>
          <p className="mt-2 text-sm text-red-600">
            {form.formState.errors.date?.message || form.formState.errors.timeSlot?.message || form.formState.errors.address?.message}
          </p>
          <button
            type="submit"
            disabled={bookingState.isLoading}
            className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {bookingState.isLoading ? "Booking..." : "Book now"}
          </button>
        </form>

        <div className="card p-5">
          <h3 className="text-xl font-bold">Reviews</h3>
          <div className="mt-3 space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <div key={review._id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-semibold">{review.user?.name || "User"} - {review.rating}/5</p>
                <p className="text-sm text-slate-600">{review.comment || "No comment"}</p>
              </div>
            ))}
            {!reviews.length ? <p className="text-sm text-slate-600">No reviews yet.</p> : null}
          </div>
        </div>
      </aside>
    </section>
  );
}
