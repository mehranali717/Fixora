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
export default HoursSelector