import { useState } from "react";

export default function useBookingForm(initial) {
  const [formData, setFormDataState] = useState(initial);
  const update = (patch) => setFormDataState((prev) => ({ ...prev, ...patch }));
  const reset = () => setFormDataState(initial);
  return { formData, updateForm: update, resetForm: reset };
}