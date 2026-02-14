import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-700 to-orange-500 p-8 text-white md:p-14">
      <div className="max-w-2xl">
        <p className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-xs tracking-[0.2em]">
          UAE HOME SERVICES
        </p>
        <h1 className="text-4xl font-black leading-tight md:text-5xl">
          Book trusted professionals for every home task
        </h1>
        <p className="mt-4 text-base text-white/90 md:text-lg">
          Electrician, handyman, cleaning, AC, plumbing and more. Fast booking, transparent pricing, and real-time
          booking updates.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/services" className="rounded-xl bg-white px-5 py-3 font-semibold text-teal-900 hover:bg-slate-100">
            Explore services
          </Link>
          <Link to="/register" className="rounded-xl border border-white/70 px-5 py-3 font-semibold hover:bg-white/10">
            Create account
          </Link>
        </div>
      </div>
    </section>
  );
}
