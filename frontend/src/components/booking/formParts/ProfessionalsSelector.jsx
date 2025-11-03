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
export default ProfessionalsSelector