import React, { useState } from "react";
import AddressStepWithMap from "./steps/AddressStepWithMap";
import Stepper from "./Stepper";
import { Calendar, Clock, User, Phone, Home, FileText, Package, Users, ShoppingBag } from "lucide-react";
import useBookingForm from "./useBookingForm";
import generateId from "./generateId";
import ModalLayout from "./ModalLayout";
import BookingDetails from "./steps/BookingDetails";
import ReviewStep from "./steps/ReviewStep";
import ContactStep from "./steps/ContactStep";
import SuccessStep from "./steps/SuccessStep";

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


