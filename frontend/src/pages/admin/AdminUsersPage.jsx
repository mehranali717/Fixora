import toast from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useBlockUserMutation, useGetUsersQuery } from "../../store/apiSlice.js";

export default function AdminUsersPage() {
  const { data } = useGetUsersQuery();
  const [blockUser] = useBlockUserMutation();

  const handleToggle = async (user) => {
    try {
      await blockUser({ id: user._id, isBlocked: !user.isBlocked }).unwrap();
      toast.success(user.isBlocked ? "User activated" : "User blocked");
    } catch (error) {
      toast.error(error?.data?.message || "User update failed");
    }
  };

  return (
    <section>
      <SectionHeader title="Manage users" />
      <div className="space-y-2">
        {(data?.data || []).map((user) => (
          <article key={user._id} className="card flex items-center justify-between p-3">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-slate-600">{user.email} | {user.role}</p>
            </div>
            <button
              onClick={() => handleToggle(user)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                user.isBlocked ? "bg-emerald-600 text-white" : "bg-red-100 text-red-700"
              }`}
            >
              {user.isBlocked ? "Activate" : "Block"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
