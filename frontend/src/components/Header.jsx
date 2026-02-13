import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-blue-900 to-teal-900 text-transparent`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="hover:text-teal-600">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center font-bold bg-[#00d492] text-white`}
            >
              JL
            </div>
            <div>
              <div className={`text-lg font-bold text-white`}>JustLife</div>
              <div className="text-xs text-gray-200">UAE Services</div>
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-lg text-gray-100">
          <Link to="/" className="hover:text-teal-600">
            Home
          </Link>
          <Link to="/services" className="hover:text-teal-600">
            Services
          </Link>
        </nav>
        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
          <Button variant={"outline"}>Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button className="hidden md:inline-block bg-emerald-500">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
