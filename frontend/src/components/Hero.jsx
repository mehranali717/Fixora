import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat pt-[110px]"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-teal-700/40 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 pt-28 pb-20  grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Book trusted services across the UAE
          </h1>
          <p className="text-white mt-4 max-w-xl">
            Cleaning, plumbing, electrical, delivery and more. Transparent
            pricing and verified professionals near you.
          </p>

          <div className="mt-6 flex max-w-md">
            <Input
              placeholder="What service do you need?"
              className="pl-4"
              aria-label="service-search"
            />
            <Button className="rounded-none rounded-r-lg">Search</Button>
          </div>

          <div className="mt-4 text-sm text-white">
            Serving Dubai, Abu Dhabi, Sharjah & more.
          </div>
        </div>

        <div className="flex justify-center ">
          <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-[#00d492]">
            <h4 className="font-semibold">Popular near you</h4>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li>Home Cleaning — from AED 99</li>
              <li>Plumbing — emergency visits from AED 120</li>
              <li>Electrician — certified pros</li>
            </ul>
            <div className="mt-4">
              <Link to="/services">
                <Button className="w-full">Browse all services</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
