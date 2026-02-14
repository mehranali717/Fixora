import toast from "react-hot-toast";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import {
  useCancelBookingMutation,
  useCreateCheckoutMutation,
  useGetMyBookingsQuery,
} from "../../store/apiSlice.js";

export default function UserBookingsPage() {
  const { data, isLoading, isError } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [createCheckout] = useCreateCheckoutMutation();
  const bookings = data?.data || [];

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id).unwrap();
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error(error?.data?.message || "Cancel failed");
    }
  };

  const handlePay = async (id) => {
    try {
      const result = await createCheckout(id).unwrap();
      if (result?.data?.url) window.location.href = result.data.url;
    } catch (error) {
      toast.error(error?.data?.message || "Payment init failed");
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <SectionHeader title="My bookings" subtitle="Track status, pay online, or cancel upcoming bookings." />
      {isLoading ? <Loader text="Loading bookings..." /> : null}
      {isError ? <EmptyState title="Unable to load bookings" description="Try again in a moment." /> : null}
      {!isLoading && !bookings.length ? <EmptyState title="No bookings yet" description="Browse services and make your first booking." /> : null}

      <div className="space-y-3">
        {bookings.map((booking) => (
          <article key={booking._id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{booking.service?.title}</p>
                <p className="text-sm text-slate-600">{new Date(booking.date).toLocaleDateString()} | {booking.timeSlot}</p>
                <p className="text-sm text-slate-600">{booking.address}</p>
                <p className="mt-1 text-sm">Status: <strong>{booking.status}</strong> | Payment: <strong>{booking.paymentStatus}</strong></p>
              </div>
              <div className="flex gap-2">
                {booking.paymentStatus === "unpaid" ? (
                  <button onClick={() => handlePay(booking._id)} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">
                    Pay now
                  </button>
                ) : null}
                {booking.status !== "completed" && booking.status !== "cancelled" ? (
                  <button onClick={() => handleCancel(booking._id)} className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700">
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
