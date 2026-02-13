import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../ui/Button";
import BookingModal from "../components/booking";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openBook, setOpenBook] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/services/${id}`)
      .then(res => {
        setService(res.data);
      })
      .catch(() => setService(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-[150px] text-center text-gray-500">
        Loading service...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto pt-[100px] p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Service not found</h2>
          <p className="text-gray-600 mt-2">
            Maybe it was removed or the link is wrong.
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate("/services")}>
              Back to services
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-[100px] p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-80 object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
              {service.icon || "?"}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-blue-900">{service.title}</h1>
          <div className="mt-3 space-y-2">
            {service.subtitle?.split("\n").map((line, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="text-emerald-500">✔</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-emerald-500 font-semibold">
            Price: {service.price}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              className="bg-emerald-500"
              onClick={() => setOpenBook(true)}
            >
              Book Now
            </Button>
            <Button variant="outline" onClick={() => navigate("/services")}>
              Back to services
            </Button>
          </div>
        </div>
      </div>

      {openBook && (
        <BookingModal
          service={{
            id: service._id,
            title: service.title,
            price: service.price,
          }}
          onClose={() => setOpenBook(false)}
        />
      )}
    </div>
  );
}
