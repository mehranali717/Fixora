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
export default Instructions