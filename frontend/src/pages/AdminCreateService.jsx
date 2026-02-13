import React, { useState } from "react";
import axios from "axios";

export default function AdminCreateService() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    price: "",
    icon: "",
    image: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/services/create",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Service created!");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-[100px]">
      <h2 className="text-2xl font-bold mb-4">Create Service</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Title"
          className="border p-3 w-full rounded"
          onChange={handleChange}
        />

        <textarea
          name="subtitle"
          placeholder="Subtitle"
          className="border p-3 w-full rounded"
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price"
          className="border p-3 w-full rounded"
          onChange={handleChange}
        />

        <input
          name="icon"
          placeholder="Icon (emoji)"
          className="border p-3 w-full rounded"
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="/images/services/cleaning.webp"
          className="border p-3 w-full rounded"
          onChange={handleChange}
        />

        <button
          className="bg-blue-600 text-white p-3 rounded-xl w-full"
          type="submit"
        >
          Create
        </button>

      </form>
    </div>
  );
}
