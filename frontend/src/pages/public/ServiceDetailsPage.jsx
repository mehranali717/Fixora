import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import {
  useCreateBookingMutation,
  useCreateCheckoutMutation,
  useGetServiceByIdQuery,
  useGetServiceReviewsQuery,
  useGetTimeSlotsQuery,
} from "../../store/apiSlice.js";

const STEP_TITLES = ["Service", "Configuration", "Review", "Payment"];

const cityOptions = ["Dubai", "Abu Dhabi"];
const propertyTypeOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "office", label: "Office" },
];

const issueTypes = ["Power outage", "Short circuit", "Lighting issue", "Socket/switch issue", "Other"];

const round2 = (value) => Math.round(value * 100) / 100;

const detectServiceType = (service) => {
  const name = `${service?.title || ""} ${service?.category?.name || ""}`.toLowerCase();
  if (name.includes("clean")) return "cleaning";
  if (name.includes("electric")) return "electrical";
  if (name.includes("handyman")) return "handyman";
  return "general";
};

const deriveVariants = (serviceType) => {
  if (serviceType === "cleaning") return ["2 Hours", "3 Hours", "4 Hours"];
  if (serviceType === "electrical") return ["Inspection", "Repair", "Installation"];
  if (serviceType === "handyman") return ["Quick Fix", "Standard", "Complex"];
  return ["Standard"];
};

const buildPricingPreview = (basePrice, details) => {
  let addOnsPrice = 0;
  let urgencyFee = 0;

  if (Number(details.cleaners) > 1) addOnsPrice += (Number(details.cleaners) - 1) * 35;
  if (details.bringMaterials) addOnsPrice += 25;
  if (details.insideCabinets) addOnsPrice += 20;
  if (details.ironingRequired) addOnsPrice += 15;
  if (Number(details.itemsToFix) > 1) addOnsPrice += (Number(details.itemsToFix) - 1) * 20;
  if (details.urgencyLevel === "emergency") urgencyFee = 120;

  const vat = round2((basePrice + addOnsPrice + urgencyFee) * 0.05);
  return {
    basePrice,
    addOnsPrice,
    urgencyFee,
    vat,
    total: round2(basePrice + addOnsPrice + urgencyFee + vat),
  };
};

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetServiceByIdQuery(id);
  const reviewsQuery = useGetServiceReviewsQuery(id);
  const [createBooking, createBookingState] = useCreateBookingMutation();
  const [createCheckout, checkoutState] = useCreateCheckoutMutation();

  const [step, setStep] = useState(0);

  const service = data?.data;
  const detectedType = detectServiceType(service);

  const [form, setForm] = useState({
    serviceType: detectedType,
    serviceVariant: "",
    propertyType: "apartment",
    rooms: 1,
    city: "Dubai",
    fullAddress: "",
    landmark: "",
    specialInstructions: "",
    date: "",
    timeSlot: "",
    cleaners: 1,
    bringMaterials: false,
    insideCabinets: false,
    ironingRequired: false,
    issueType: "",
    urgencyLevel: "standard",
    itemsToFix: 1,
    tasksDescription: "",
    images: [],
    paymentMethod: "card",
  });

  const variants = useMemo(() => deriveVariants(form.serviceType || detectedType), [form.serviceType, detectedType]);

  const slotsQuery = useGetTimeSlotsQuery(
    { date: form.date, city: form.city },
    { skip: !form.date || !form.city }
  );

  const pricingPreview = useMemo(
    () => buildPricingPreview(Number(service?.price || 0), form),
    [service?.price, form]
  );

  const activeSlots = slotsQuery.data?.data?.slots?.filter((slot) => !slot.isBlocked) || [];
  const reviews = reviewsQuery.data?.data || [];

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validateStep = () => {
    if (step === 0) {
      if (!form.serviceType) return "Service type is required";
      if (!form.serviceVariant) return "Service variant is required";
    }

    if (step === 1) {
      if (!form.fullAddress || form.fullAddress.trim().length < 8) return "Detailed address is required";
      if (!form.date) return "Date is required";
      if (!form.timeSlot) return "Time slot is required";
      if (new Date(form.date) < new Date(new Date().toDateString())) return "Past dates are not allowed";
      if (slotsQuery.data?.data?.isDateBlocked) return "Selected date is blocked";
      if (form.serviceType === "electrical" && !form.issueType) return "Issue type is required for electrical service";
      if (form.serviceType === "handyman" && !form.tasksDescription.trim()) return "Task description is required for handyman";
    }

    return "";
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) {
      toast.error(error);
      return;
    }

    setStep((prev) => Math.min(prev + 1, STEP_TITLES.length - 1));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmitBooking = async () => {
    try {
      const payload = {
        service: id,
        serviceVariant: form.serviceVariant,
        date: form.date,
        timeSlot: form.timeSlot,
        paymentMethod: form.paymentMethod,
        address: {
          propertyType: form.propertyType,
          fullAddress: form.fullAddress,
          landmark: form.landmark,
          city: form.city,
        },
        serviceDetails: {
          serviceType: form.serviceType,
          serviceVariant: form.serviceVariant,
          rooms: Number(form.rooms),
          cleaners: Number(form.cleaners),
          bringMaterials: Boolean(form.bringMaterials),
          insideCabinets: Boolean(form.insideCabinets),
          ironingRequired: Boolean(form.ironingRequired),
          issueType: form.issueType,
          urgencyLevel: form.urgencyLevel,
          itemsToFix: Number(form.itemsToFix),
          tasksDescription: form.tasksDescription,
          specialInstructions: form.specialInstructions,
        },
        images: form.images,
      };

      const bookingResponse = await createBooking(payload).unwrap();
      const booking = bookingResponse?.data;

      if (form.paymentMethod === "card") {
        const checkout = await createCheckout(booking._id).unwrap();
        if (checkout?.data?.url) {
          window.location.href = checkout.data.url;
          return;
        }
      }

      toast.success(`Booking ${booking.bookingId} created`);
      navigate("/dashboard/bookings");
    } catch (error) {
      toast.error(error?.data?.message || "Booking failed");
    }
  };

  if (isLoading) return <Loader text="Loading service..." />;
  if (isError || !service) return <EmptyState title="Service unavailable" description="The service may have been removed." />;

  return (
    <section className="grid gap-4 lg:grid-cols-5">
      <article className="card lg:col-span-3">
        {service.images?.[0] ? (
          <img src={service.images[0]} alt={service.title} className="h-56 w-full rounded-t-2xl object-cover" />
        ) : null}
        <div className="space-y-4 p-4 sm:p-5">
          <h1 className="text-2xl font-black sm:text-3xl">{service.title}</h1>
          <p className="text-slate-700">{service.description}</p>

          <div className="grid gap-2 sm:grid-cols-4">
            {STEP_TITLES.map((title, index) => (
              <div key={title} className={`rounded-xl border px-3 py-2 text-xs font-semibold sm:text-sm ${index <= step ? "border-teal-700 bg-teal-50 text-teal-800" : "border-slate-200 text-slate-500"}`}>
                {index + 1}. {title}
              </div>
            ))}
          </div>

          {step === 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={form.serviceType} onChange={(e) => update("serviceType", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                <option value="cleaning">Cleaning</option>
                <option value="electrical">Electrical</option>
                <option value="handyman">Handyman</option>
                <option value="general">General</option>
              </select>
              <select value={form.serviceVariant} onChange={(e) => update("serviceVariant", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Select service variant</option>
                {variants.map((variant) => (
                  <option key={variant} value={variant}>{variant}</option>
                ))}
              </select>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                  {propertyTypeOptions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <input type="number" min="1" value={form.rooms} onChange={(e) => update("rooms", Number(e.target.value || 1))} placeholder="Number of rooms" className="rounded-lg border border-slate-300 px-3 py-2" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select value={form.city} onChange={(e) => update("city", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => update("date", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
              </div>

              {slotsQuery.data?.data?.isDateBlocked ? <p className="text-sm font-semibold text-red-600">Selected date is blocked.</p> : null}
              <select value={form.timeSlot} onChange={(e) => update("timeSlot", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" disabled={!activeSlots.length}>
                <option value="">Select time slot</option>
                {activeSlots.map((slot) => (
                  <option key={slot.label} value={slot.label}>{slot.label} ({slot.remaining} left)</option>
                ))}
              </select>

              <textarea value={form.fullAddress} onChange={(e) => update("fullAddress", e.target.value)} placeholder="Detailed address" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <input value={form.landmark} onChange={(e) => update("landmark", e.target.value)} placeholder="Landmark (optional)" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <textarea value={form.specialInstructions} onChange={(e) => update("specialInstructions", e.target.value)} placeholder="Special instructions" className="w-full rounded-lg border border-slate-300 px-3 py-2" />

              {form.serviceType === "cleaning" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <input type="number" min="1" value={form.cleaners} onChange={(e) => update("cleaners", Number(e.target.value || 1))} placeholder="Number of cleaners" className="rounded-lg border border-slate-300 px-3 py-2" />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.bringMaterials} onChange={(e) => update("bringMaterials", e.target.checked)} /> Bring materials</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.insideCabinets} onChange={(e) => update("insideCabinets", e.target.checked)} /> Inside cabinets</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.ironingRequired} onChange={(e) => update("ironingRequired", e.target.checked)} /> Ironing required</label>
                </div>
              ) : null}

              {form.serviceType === "electrical" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <select value={form.issueType} onChange={(e) => update("issueType", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Issue type</option>
                    {issueTypes.map((issue) => (
                      <option key={issue} value={issue}>{issue}</option>
                    ))}
                  </select>
                  <select value={form.urgencyLevel} onChange={(e) => update("urgencyLevel", e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                    <option value="standard">Standard</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              ) : null}

              {form.serviceType === "handyman" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <input type="number" min="1" value={form.itemsToFix} onChange={(e) => update("itemsToFix", Number(e.target.value || 1))} placeholder="Number of items to fix" className="rounded-lg border border-slate-300 px-3 py-2" />
                  <textarea value={form.tasksDescription} onChange={(e) => update("tasksDescription", e.target.value)} placeholder="Task description" className="rounded-lg border border-slate-300 px-3 py-2" />
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-2 rounded-xl border border-slate-200 p-4 text-sm">
              <p><strong>Service:</strong> {service.title} ({form.serviceVariant})</p>
              <p><strong>Date:</strong> {form.date}</p>
              <p><strong>Time Slot:</strong> {form.timeSlot}</p>
              <p><strong>Address:</strong> {form.fullAddress}, {form.city}</p>
              <p><strong>Add-ons:</strong> AED {pricingPreview.addOnsPrice.toFixed(2)}</p>
              <p><strong>Urgency Fee:</strong> AED {pricingPreview.urgencyFee.toFixed(2)}</p>
              <p><strong>VAT (5%):</strong> AED {pricingPreview.vat.toFixed(2)}</p>
              <p className="text-base font-bold">Total: AED {pricingPreview.total.toFixed(2)}</p>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3">
              <select value={form.paymentMethod} onChange={(e) => update("paymentMethod", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="card">Card (Stripe)</option>
                <option value="cash">Cash on Service</option>
              </select>
              <button type="button" onClick={handleSubmitBooking} disabled={createBookingState.isLoading || checkoutState.isLoading} className="w-full rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
                {createBookingState.isLoading || checkoutState.isLoading ? "Processing..." : "Confirm & Continue"}
              </button>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={handleBack} disabled={step === 0} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">
              Back
            </button>
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
                Next
              </button>
            ) : null}
          </div>
        </div>
      </article>

      <aside className="space-y-4 lg:col-span-2">
        <div className="card p-4">
          <h3 className="text-lg font-bold">Live Price Summary</h3>
          <p className="mt-2 text-sm">Base: AED {pricingPreview.basePrice.toFixed(2)}</p>
          <p className="text-sm">Add-ons: AED {pricingPreview.addOnsPrice.toFixed(2)}</p>
          <p className="text-sm">Urgency: AED {pricingPreview.urgencyFee.toFixed(2)}</p>
          <p className="text-sm">VAT: AED {pricingPreview.vat.toFixed(2)}</p>
          <p className="mt-2 text-lg font-extrabold text-teal-700">Total AED {pricingPreview.total.toFixed(2)}</p>
        </div>

        <div className="card p-4">
          <h3 className="text-lg font-bold">Recent Reviews</h3>
          <div className="mt-3 space-y-2">
            {reviews.slice(0, 4).map((review) => (
              <div key={review._id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold">{review.user?.name || "User"} - {review.rating}/5</p>
                <p className="text-sm text-slate-600">{review.comment || "No comment"}</p>
              </div>
            ))}
            {!reviews.length ? <p className="text-sm text-slate-600">No reviews yet.</p> : null}
          </div>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white p-3 shadow-[0_-6px_20px_rgba(15,23,42,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Estimated total</p>
            <p className="text-base font-extrabold text-teal-700">AED {pricingPreview.total.toFixed(2)}</p>
          </div>
          <button type="button" onClick={step < 3 ? handleNext : handleSubmitBooking} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
            {step < 3 ? "Next" : "Confirm"}
          </button>
        </div>
      </div>
    </section>
  );
}