export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
      <span className="ml-3 text-slate-600">{text}</span>
    </div>
  );
}
