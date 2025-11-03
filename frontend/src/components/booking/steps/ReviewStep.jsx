import { Calendar, Clock, FileText, Home, Package, Phone, ShoppingBag, User, Users } from "lucide-react";
import Button from "../../../ui/Button";

 function ReviewStep({ formData, service, onBack, onConfirm }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Review Your Booking</h3>

      <div className="space-y-6">
        {/* Service Details */}
        <div className="border rounded-xl p-4 bg-emerald-50">
          <h4 className="text-sm font-medium text-emerald-700 mb-3 flex items-center gap-2">
            <ShoppingBag size={16} /> Service Details
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-center gap-2">
              <Package size={16} className="text-emerald-500" />
              <span><strong>Service:</strong> {service.title}</span>
            </li>
            <li className="flex items-center gap-2">
              <Users size={16} className="text-emerald-500" />
              <span><strong>Professionals:</strong> {formData.professionals}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              <span><strong>Hours:</strong> {formData.hours} hr</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText size={16} className="text-emerald-500" />
              <span><strong>Materials Needed:</strong> {formData.needMaterials ? "Yes" : "No"}</span>
            </li>
            <li className="flex items-center gap-2 text-emerald-700 font-semibold">
              💰 Total Price: {service.price}
            </li>
          </ul>
        </div>

        {/* Customer Details */}
        <div className="border rounded-xl p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <User size={16} /> Your Details
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-center gap-2">
              <User size={16} className="text-emerald-500" />
              <span>{formData.name}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-emerald-500" />
              <span>{formData.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" />
              <span>{formData.date}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-emerald-500" />
              <span>{formData.time}</span>
            </li>
            <li className="flex items-center gap-2">
              <Home size={16} className="text-emerald-500" />
              <span>{formData.address}</span>
            </li>
            {formData.instructions && (
              <li className="flex items-start gap-2">
                <FileText size={16} className="text-emerald-500 mt-1" />
                <span>{formData.instructions}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end mt-6 gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-emerald-500" onClick={onConfirm}>
          Confirm Booking
        </Button>
      </div>
    </div>
  );
}

export default ReviewStep