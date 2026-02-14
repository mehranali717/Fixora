import Loader from "../../components/common/Loader.jsx";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useGetAnalyticsQuery } from "../../store/apiSlice.js";

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useGetAnalyticsQuery();
  const analytics = data?.data;

  if (isLoading) return <Loader text="Loading analytics..." />;

  return (
    <section>
      <SectionHeader title="Analytics Dashboard" subtitle="Business metrics and latest booking performance." />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4"><p className="text-sm text-slate-500">Total users</p><p className="text-3xl font-black">{analytics?.totalUsers || 0}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Total bookings</p><p className="text-3xl font-black">{analytics?.totalBookings || 0}</p></div>
        <div className="card p-4"><p className="text-sm text-slate-500">Revenue</p><p className="text-3xl font-black">AED {analytics?.revenue || 0}</p></div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h3 className="text-lg font-bold">Recent bookings</h3>
          <div className="mt-3 space-y-2">
            {(analytics?.recentBookings || []).map((booking) => (
              <div key={booking._id} className="rounded-lg border border-slate-200 p-2 text-sm">
                {booking.user?.name} booked {booking.service?.title} - {booking.status}
              </div>
            ))}
          </div>
        </div>
        <div className="card p-4">
          <h3 className="text-lg font-bold">Service performance</h3>
          <div className="mt-3 space-y-2">
            {(analytics?.servicePerformance || []).map((service) => (
              <div key={service._id} className="rounded-lg border border-slate-200 p-2 text-sm">
                {service.title}: {service.bookings} bookings | AED {service.revenue}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
