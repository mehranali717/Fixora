import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useGetAllBookingsQuery, useGetServicesQuery, useUpdateBookingStatusMutation } from "../../store/apiSlice.js";

const statuses = ["pending", "confirmed", "completed", "cancelled", "refunded"];

export default function AdminBookingsPage() {
  const [filters, setFilters] = useState({ date: "", status: "", service: "" });
  const { data } = useGetAllBookingsQuery(filters);
  const { data: servicesData } = useGetServicesQuery({});
  const [updateStatus] = useUpdateBookingStatusMutation();

  const bookings = data?.data || [];
  const services = useMemo(() => servicesData?.data || [], [servicesData]);

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

      <div className="card mb-3 grid gap-3 p-3 md:grid-cols-3">
        <input type="date" value={filters.date} onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2" />
        <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2">
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select value={filters.service} onChange={(e) => setFilters((prev) => ({ ...prev, service: e.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2">
          <option value="">All services</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>{service.title}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {bookings.map((booking) => (
          <article key={booking._id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{booking.service?.title} <span className="text-xs text-slate-500">#{booking.bookingId}</span></p>
                <p className="text-sm text-slate-600">{booking.user?.name} | {booking.user?.email}</p>
                <p className="text-sm text-slate-600">{booking.dateKey} | {booking.timeSlot} | {booking.address?.city}</p>
                <p className="text-sm text-slate-600">{booking.status} | {booking.paymentStatus}</p>
                <p className="text-sm font-semibold text-teal-700">AED {booking.pricing?.total ?? 0}</p>
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