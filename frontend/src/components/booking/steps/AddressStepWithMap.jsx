// AddressStepWithMap.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Input from "../../../ui/Input";
import Button from "../../../ui/Button";

// Custom emerald marker using inline SVG
const emeraldMarker = new L.DivIcon({
  className: "",
  html: `
    <div class="flex flex-col items-center">
      <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" 
             class="w-3 h-3 text-white" fill="none" 
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2z" />
        </svg>
      </div>
      <div class="w-1 h-2 bg-emerald-600"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

// 🔹 Helper function for reverse geocoding
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    return data.display_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  }
}

function LocationMarker({ markerPos, setMarkerPos, updateForm }) {
  const map = useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPos([lat, lng]);
      const address = await reverseGeocode(lat, lng);
      updateForm({ lat, lng, address });
    },
  });

  return markerPos ? (
    <Marker
      position={markerPos}
      icon={emeraldMarker}
      draggable
      eventHandlers={{
        dragend: async (e) => {
          const { lat, lng } = e.target.getLatLng();
          setMarkerPos([lat, lng]);
          const address = await reverseGeocode(lat, lng);
          updateForm({ lat, lng, address });
        },
      }}
    >
      <Popup>
        <div className="text-sm">
          <div className="font-semibold">
            📍 {markerPos[0].toFixed(5)}, {markerPos[1].toFixed(5)}
          </div>
        </div>
      </Popup>
    </Marker>
  ) : null;
}


export default function AddressStepWithMap({ formData, updateForm, onBack, onNext }) {
  const provider = useMemo(() => new OpenStreetMapProvider(), []);
  const initialCenter = [25.2048, 55.2708]; // Dubai
  const [markerPos, setMarkerPos] = useState(
    formData.lat && formData.lng ? [formData.lat, formData.lng] : initialCenter
  );

  // Handle "Enter" search from the Input
  const handleEnterSearch = async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const query = formData.address;
    if (!query) return;
    try {
      const results = await provider.search({ query });
      if (results?.length) {
        const { x: lng, y: lat, label } = results[0];
        setMarkerPos([lat, lng]);
        updateForm({ address: label, lat, lng });
      }
    } catch (err) {
      console.error("Search error", err);
    }
  };

  // "Use my location" button
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setMarkerPos([latitude, longitude]);
      updateForm({
        lat: latitude,
        lng: longitude,
        address: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
      });
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Select Address</h3>

      <Input
        placeholder="Search location..."
        onChange={(e) => updateForm({ address: e.target.value })}
        value={formData.address}
        className="mb-3 w-full"
        onKeyDown={handleEnterSearch}
      />

<div className="relative h-64 rounded-2xl overflow-hidden shadow-md bg-emerald-50 border border-emerald-100">
        <MapContainer
          center={markerPos}
          zoom={12}
          className="w-full h-full"
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          <LocationMarker
            markerPos={markerPos}
            setMarkerPos={setMarkerPos}
            updateForm={updateForm}
          />
        </MapContainer>

        {/* Floating button */}
        <button
          onClick={handleUseMyLocation}
          className="absolute bottom-3 right-3 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition"
        >
          📍
        </button>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-emerald-500" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
