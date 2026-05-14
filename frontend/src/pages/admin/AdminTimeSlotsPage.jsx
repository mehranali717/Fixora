import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SectionHeader from "../../components/common/SectionHeader.jsx";
import { useGetTimeSlotsQuery, useUpsertTimeSlotsMutation } from "../../store/apiSlice.js";

const DEFAULT_SLOTS = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
];

export default function AdminTimeSlotsPage() {
  const today = new Date().toISOString().split("T")[0];
  const [dateKey, setDateKey] = useState(today);
  const [city, setCity] = useState("Dubai");
  const [isDateBlocked, setIsDateBlocked] = useState(false);
  const [isFridayEnabled, setIsFridayEnabled] = useState(true);
  const [ramadanEnabled, setRamadanEnabled] = useState(false);
  const [slots, setSlots] = useState(
    DEFAULT_SLOTS.map((label) => ({ label, capacity: 8, isBlocked: false }))
  );

  const { data, refetch } = useGetTimeSlotsQuery({ date: dateKey, city });
  const [upsertTimeSlots, saveState] = useUpsertTimeSlotsMutation();

  const availability = data?.data;

  useEffect(() => {
    if (!availability) return;
    setIsDateBlocked(Boolean(availability.isDateBlocked));
    setIsFridayEnabled(Boolean(availability.isFridayEnabled));
    setRamadanEnabled(Boolean(availability.ramadanEnabled));
    setSlots((availability.slots || []).map((slot) => ({
      label: slot.label,
      capacity: slot.capacity,
      isBlocked: slot.isBlocked,
    })));
  }, [availability]);

  const handleSlotChange = (index, patch) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)));
  };

  const handleSave = async () => {
    try {
      await upsertTimeSlots({
        dateKey,
        city,
        isDateBlocked,
        isFridayEnabled,
        ramadanEnabled,
        ramadanSlots: ramadanEnabled ? slots.filter((slot) => !slot.isBlocked).map((slot) => slot.label) : [],
        slots,
      }).unwrap();
      toast.success("Time slots updated");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update slots");
    }
  };

  return (
    <section>
      <SectionHeader title="Time Slot Management" subtitle="Block dates, configure capacities, and tune Friday/Ramadan availability." />

      <div className="card mb-4 grid gap-3 p-4 md:grid-cols-3">
        <input type="date" value={dateKey} min={today} onChange={(e) => setDateKey(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
        <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
          <option value="Dubai">Dubai</option>
          <option value="Abu Dhabi">Abu Dhabi</option>
        </select>
        <button onClick={() => refetch()} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Refresh availability</button>
      </div>

      <div className="card mb-4 space-y-3 p-4">
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={isDateBlocked} onChange={(e) => setIsDateBlocked(e.target.checked)} /> Block entire date</label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={isFridayEnabled} onChange={(e) => setIsFridayEnabled(e.target.checked)} /> Friday available</label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={ramadanEnabled} onChange={(e) => setRamadanEnabled(e.target.checked)} /> Ramadan timing enabled</label>
      </div>

      <div className="card space-y-3 p-4">
        {slots.map((slot, index) => (
          <div key={slot.label} className="grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <p className="font-semibold">{slot.label}</p>
            <input type="number" min="0" value={slot.capacity} onChange={(e) => handleSlotChange(index, { capacity: Number(e.target.value || 0) })} className="w-24 rounded-lg border border-slate-300 px-2 py-1" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={slot.isBlocked} onChange={(e) => handleSlotChange(index, { isBlocked: e.target.checked })} /> Block</label>
          </div>
        ))}

        <button onClick={handleSave} disabled={saveState.isLoading} className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
          {saveState.isLoading ? "Saving..." : "Save configuration"}
        </button>
      </div>
    </section>
  );
}
