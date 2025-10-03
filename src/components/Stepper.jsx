import React from "react";

export default function Stepper({ step, labels }) {
  return (
    <div className="flex items-center justify-between w-full relative">
      {labels.map((label, index) => {
        const isActive = step === index;
        const isCompleted = step > index;

        return (
          <div key={label} className="flex-1 flex flex-col items-center relative">
            {/* Circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                ${isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : ""}
                ${isActive ? "border-emerald-500 text-emerald-600 bg-white" : ""}
                ${!isActive && !isCompleted ? "border-gray-300 text-gray-400 bg-white" : ""}`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-sm font-medium ${
                isActive || isCompleted ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {label}
            </span>

            {/* Line connector */}
            {/* Line connector */}
{index < labels.length - 1 && (
  <div
    className={`absolute top-5 left-1/2 right-0 h-0.5 
      ${isCompleted ? "bg-emerald-500" : "bg-gray-300"}
    `}
    style={{ zIndex: -1 }}
  />
)}

          </div>
        );
      })}
    </div>
  );
}
