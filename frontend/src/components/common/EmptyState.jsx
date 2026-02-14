export default function EmptyState({ title, description }) {
  return (
    <div className="card p-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  );
}
