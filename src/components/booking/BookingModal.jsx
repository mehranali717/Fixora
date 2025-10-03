import React, { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import AddressStepWithMap from "../AddressStepWithMap";
import Stepper from "../Stepper";
import { Calendar, Clock, User, Phone, Home, FileText, Package, Users, ShoppingBag } from "lucide-react";


function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function useBookingForm(initial) {
  const [formData, setFormDataState] = useState(initial);
  const update = (patch) => setFormDataState((prev) => ({ ...prev, ...patch }));
  const reset = () => setFormDataState(initial);
  return { formData, updateForm: update, resetForm: reset };
}


function ModalLayout({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {children}
      </div>
    </div>
  );
}

function HoursSelector({ value, onChange, options = [2, 3, 4, 5, 6] }) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Hours needed:</p>
      <div className="flex flex-wrap gap-2">
        {options.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => onChange(h)}
            className={`px-4 py-2 rounded-full border transition ${
              value === h
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {h} hr
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfessionalsSelector({ value, onChange, options = [1, 2, 3] }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium mb-2">Number of professionals:</p>
      <div className="flex gap-2">
        {options.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`px-4 py-2 rounded-full border transition ${
              value === p
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function Instructions({ value, onChange }) {
  return (
    <textarea
      placeholder="Any instructions or special requirements?"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-md p-2 text-sm"
    />
  );
}

function BookingDetails({ service, formData, updateForm, onNext }) {
  return (
    <div>
      <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg my-4">
        🎁 Exclusive offer for you!{" "}
        <span className="font-semibold">Flat 20% off today</span>
      </div>

      <div className="space-y-3">
        <HoursSelector
          value={formData.hours}
          onChange={(h) => updateForm({ hours: h })}
        />

        <ProfessionalsSelector
          value={formData.professionals}
          onChange={(p) => updateForm({ professionals: p })}
        />

        {service.title.toLowerCase().includes("cleaning") && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.needMaterials}
              onChange={(e) => updateForm({ needMaterials: e.target.checked })}
            />
            Need cleaning materials?
          </label>
        )}

        <Instructions
          value={formData.instructions}
          onChange={(val) => updateForm({ instructions: val })}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button className="bg-emerald-500" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}


function ContactStep({ formData, updateForm, service, onBack, onConfirm }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Your Details</h3>
      <div className="space-y-3">
        <Input
          placeholder="Full name"
          value={formData.name}
          onChange={(e) => updateForm({ name: e.target.value })}
          className="w-full"
        />

        <div className="flex gap-2">
          <span className="flex items-center px-3 bg-emerald-50 border border-emerald-500 rounded-l-md">
            +971
          </span>
          <Input
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => updateForm({ phone: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => updateForm({ date: e.target.value })}
          />
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => updateForm({ time: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Price: <span className="font-semibold">{service.price}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button className="bg-emerald-500" onClick={onConfirm}>
            Confirm Booking
          </Button>
        </div>
      </div>


    </div>
  );
}

function SuccessStep({ reference, onClose }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-emerald-500 mb-2">✓ Booked</div>
      <p className="mb-4">
        Your booking reference: <strong>{reference}</strong>
      </p>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
}




 function ReviewStep({ formData, service, onBack, onConfirm }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Review Your Booking</h3>

      <div className="space-y-6">
        {/* Service Details */}
        <div className="border rounded-xl p-4 bg-emerald-50">
          <h4 className="text-sm font-medium text-emerald-700 mb-3 flex items-center gap-2">
            <ShoppingBag size={16} /> Service Details
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-center gap-2">
              <Package size={16} className="text-emerald-500" />
              <span><strong>Service:</strong> {service.title}</span>
            </li>
            <li className="flex items-center gap-2">
              <Users size={16} className="text-emerald-500" />
              <span><strong>Professionals:</strong> {formData.professionals}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              <span><strong>Hours:</strong> {formData.hours} hr</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText size={16} className="text-emerald-500" />
              <span><strong>Materials Needed:</strong> {formData.needMaterials ? "Yes" : "No"}</span>
            </li>
            <li className="flex items-center gap-2 text-emerald-700 font-semibold">
              💰 Total Price: {service.price}
            </li>
          </ul>
        </div>

        {/* Customer Details */}
        <div className="border rounded-xl p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <User size={16} /> Your Details
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-center gap-2">
              <User size={16} className="text-emerald-500" />
              <span>{formData.name}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-emerald-500" />
              <span>{formData.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" />
              <span>{formData.date}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              <span>{formData.time}</span>
            </li>
            <li className="flex items-center gap-2">
              <Home size={16} className="text-emerald-500" />
              <span>{formData.address}</span>
            </li>
            {formData.instructions && (
              <li className="flex items-start gap-2">
                <FileText size={16} className="text-emerald-500 mt-1" />
                <span>{formData.instructions}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end mt-6 gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-emerald-500" onClick={onConfirm}>
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}



export default function BookingModal({ service, onClose }) {
  const [step, setStep] = useState(1);
  const { formData, updateForm, resetForm } = useBookingForm({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    hours: 2,
    professionals: 1,
    needMaterials: false,
    instructions: "",
  });
  const [confirmed, setConfirmed] = useState(null);

  function handleSubmit() {
    const booking = {
      id: generateId(),
      serviceId: service.id,
      serviceTitle: service.title,
      price: service.price,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(
      localStorage.getItem("justlife_bookings") || "[]"
    );
    existing.unshift(booking);
    localStorage.setItem(
      "justlife_bookings",
      JSON.stringify(existing, null, 2)
    );
    setConfirmed(booking.id);
    setStep(4);
  }

  return (
    <ModalLayout onClose={onClose}>
<Stepper step={step} labels={["Details", "Address", "Contact", "Review", "Done"]} />

    {step === 1 && (
  <BookingDetails
    service={service}
    formData={formData}
    updateForm={updateForm}
    onNext={() => setStep(2)}
  />
)}

{step === 2 && (
  <AddressStepWithMap
    formData={formData}
    updateForm={updateForm}
    onBack={() => setStep(1)}
    onNext={() => setStep(3)}
  />
)}

{step === 3 && (
  <ContactStep
    formData={formData}
    updateForm={updateForm}
    service={service}
    onBack={() => setStep(2)}
    onConfirm={() => setStep(4)}  
  />
)}

{step === 4 && (
  <ReviewStep
    formData={formData}
    service={service}
    onBack={() => setStep(3)}
    onConfirm={handleSubmit}
  />
)}

{step === 5 && confirmed && (
  <SuccessStep
    reference={confirmed}
    onClose={() => {
      resetForm();
      onClose();
    }}
  />
)}

    </ModalLayout>
  );
}


