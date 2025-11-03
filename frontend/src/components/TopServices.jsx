import services from "../data/services.json";
import ServiceCard from "../ui/ServiceCard";

export default function TopServices() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-blue-900 to-teal-900 bg-clip-text text-transparent">
            Our Home Services
          </span>
        </h2>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Reliable home services across the UAE —{" "}
          <span className="font-semibold">cleaning</span>,
          <span className="font-semibold"> repairs</span>, and
          <span className="font-semibold"> maintenance</span>. Transparent
          pricing, verified professionals, and hassle-free booking.
        </p>
        <div className="flex items-center justify-center mt-6">
          <span className="h-[2px] w-12 bg-gradient-to-r from-teal-400 to-blue-500"></span>
          <svg
            className="w-6 h-6 text-blue-500 mx-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm2 9H8a1 1 0 010-2h4a1 1 0 010 2z" />
          </svg>
          <span className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-teal-400"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.slice(0,6).map((service) => (
          <ServiceCard
            id={service.id}
            title={service.title}
            subtitle={service.subtitle}
            image={service.image}
            price={service.price}
          />
        ))}
      </div>
    </section>
  );
}
