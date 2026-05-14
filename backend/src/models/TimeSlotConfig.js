import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 0, default: 8 },
    isBlocked: { type: Boolean, default: false },
  },
  { _id: false }
);

const timeSlotConfigSchema = new mongoose.Schema(
  {
    dateKey: { type: String, required: true, trim: true },
    city: {
      type: String,
      enum: ["Dubai", "Abu Dhabi"],
      required: true,
      trim: true,
    },
    isDateBlocked: { type: Boolean, default: false },
    isFridayEnabled: { type: Boolean, default: true },
    ramadanEnabled: { type: Boolean, default: false },
    ramadanSlots: [{ type: String, trim: true }],
    slots: [slotSchema],
  },
  { timestamps: true }
);

timeSlotConfigSchema.index({ dateKey: 1, city: 1 }, { unique: true });

export default mongoose.model("TimeSlotConfig", timeSlotConfigSchema);