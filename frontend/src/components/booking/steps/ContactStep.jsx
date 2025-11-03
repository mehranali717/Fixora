import Button from "../../../ui/Button";
import Input from "../../../ui/Input";

function ContactStep({ formData, updateForm, service, onBack, onConfirm }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Your Details</h3>
      <div className="space-y-3">
        <Input
          placeholder="Full name"
          value={formData.name}
          onChange={(e) => updateForm({ name: e.target.value })}
          className="w-full"
        />

        <div className="flex gap-2">
          <span className="flex items-center px-3 bg-emerald-50 border border-emerald-500 rounded-l-md">
            +971
          </span>
          <Input
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => updateForm({ phone: e.target.value })}
          />
        </div>

        <div className="flex gap-2">
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => updateForm({ date: e.target.value })}
          />
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => updateForm({ time: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Price: <span className="font-semibold">{service.price}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button className="bg-emerald-500" onClick={onConfirm}>
            Confirm Booking
          </Button>
        </div>
      </div>


    </div>
  );
}
export default ContactStep