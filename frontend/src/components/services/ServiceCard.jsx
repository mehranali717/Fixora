import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <article className="card overflow-hidden">
      <div className="h-40 bg-slate-100">
        {service.images?.[0] ? (
          <img src={service.images[0]} alt={service.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-slate-400">Fixora</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{service.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">From</p>
            <p className="text-xl font-extrabold text-teal-700">AED {service.price}</p>
          </div>
          <Link to={`/services/${service._id}`} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
