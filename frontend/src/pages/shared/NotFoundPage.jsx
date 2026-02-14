import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-2xl py-16 text-center">
      <h1 className="text-5xl font-black">404</h1>
      <p className="mt-3 text-slate-600">The page you requested does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">
        Back to home
      </Link>
    </section>
  );
}
