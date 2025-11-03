import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const voidClick = (e) => e.preventDefault();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand + About */}
        <div>
          <h2 className="text-2xl font-bold text-white">JustLife UAE</h2>
          <p className="mt-4 text-sm leading-relaxed">
            Your trusted partner for home and lifestyle services across UAE. 
            From cleaning to beauty, we bring convenience right to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-emerald-400">Services</Link></li>
            <li><Link to="#" onClick={voidClick} className="hover:text-emerald-400">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" onClick={voidClick} className="hover:text-emerald-400">Terms & Conditions</Link></li>
            <li><Link to="#" onClick={voidClick} className="hover:text-emerald-400">Privacy Policy</Link></li>
            <li><Link to="#" onClick={voidClick} className="hover:text-emerald-400">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <p className="text-sm">📍 Dubai, United Arab Emirates</p>
          <p className="text-sm">📞 +971 55 123 4567</p>
          <p className="text-sm">📧 support@justlife.ae</p>

          {/* Social Media */}
          <div className="flex space-x-4 mt-4">
            <Link to="#" onClick={voidClick} className="hover:text-emerald-400"><Facebook size={20} /></Link>
            <Link to="#" onClick={voidClick} className="hover:text-emerald-400"><Twitter size={20} /></Link>
            <Link to="#" onClick={voidClick} className="hover:text-emerald-400"><Instagram size={20} /></Link>
            <Link to="#" onClick={voidClick} className="hover:text-emerald-400"><Linkedin size={20} /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} JustLife UAE — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
