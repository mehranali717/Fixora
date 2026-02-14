import toast from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from "../../store/apiSlice.js";

const statuses = ["pending", "approved", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const { data } = useGetAllBookingsQuery();
  const [updateStatus] = useUpdateBookingStatusMutation();

  const handleStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Booking status updated");
    } catch (error) {
      toast.error(error?.data?.message || "Status update failed");
    }
  };

  return (
    <section>
      <SectionHeader title="Manage bookings" />
      <div className="space-y-2">
        {(data?.data || []).map((booking) => (
          <article key={booking._id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{booking.service?.title}</p>
                <p className="text-sm text-slate-600">{booking.user?.name} | {booking.user?.email}</p>
                <p className="text-sm text-slate-600">{booking.status} | {booking.paymentStatus}</p>
              </div>
              <select
                value={booking.status}
                onChange={(e) => handleStatus(booking._id, e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
