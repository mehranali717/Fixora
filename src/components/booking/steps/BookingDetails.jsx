import Button from "../../../ui/Button";
import HoursSelector from "../formParts/HoursSelector";
import Instructions from "../formParts/Instructions";
import ProfessionalsSelector from "../formParts/ProfessionalsSelector";

function BookingDetails({ service, formData, updateForm, onNext }) {
  return (
    <div>
      <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg my-4">
        🎁 Exclusive offer for you!{" "}
        <span className="font-semibold">Flat 20% off today</span>
      </div>

      <div className="space-y-3">
        <HoursSelector
          value={formData.hours}
          onChange={(h) => updateForm({ hours: h })}
        />

        <ProfessionalsSelector
          value={formData.professionals}
          onChange={(p) => updateForm({ professionals: p })}
        />

        {service.title.toLowerCase().includes("cleaning") && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.needMaterials}
              onChange={(e) => updateForm({ needMaterials: e.target.checked })}
            />
            Need cleaning materials?
          </label>
        )}

        <Instructions
          value={formData.instructions}
          onChange={(val) => updateForm({ instructions: val })}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button className="bg-emerald-500" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
export default BookingDetails