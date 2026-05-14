import mongoose from "mongoose";

const bookingAddressSchema = new mongoose.Schema(
  {
    propertyType: {
      type: String,
      enum: ["apartment", "villa", "office"],
      required: true,
    },
    fullAddress: { type: String, required: true, trim: true },
    landmark: { type: String, default: "", trim: true },
    city: {
      type: String,
      enum: ["Dubai", "Abu Dhabi"],
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const bookingServiceDetailsSchema = new mongoose.Schema(
  {
    serviceType: { type: String, required: true, trim: true },
    serviceVariant: { type: String, default: "", trim: true },
    rooms: { type: Number, default: 1, min: 1 },
    cleaners: { type: Number, default: 1, min: 1 },
    bringMaterials: { type: Boolean, default: false },
    insideCabinets: { type: Boolean, default: false },
    ironingRequired: { type: Boolean, default: false },
    issueType: { type: String, default: "", trim: true },
    urgencyLevel: {
      type: String,
      enum: ["standard", "emergency"],
      default: "standard",
    },
    itemsToFix: { type: Number, default: 1, min: 1 },
    tasksDescription: { type: String, default: "", trim: true },
    addOns: [{ type: String, trim: true }],
    specialInstructions: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const bookingPricingSchema = new mongoose.Schema(
  {
    basePrice: { type: Number, required: true, min: 0 },
    addOnsPrice: { type: Number, required: true, min: 0 },
    urgencyFee: { type: Number, required: true, min: 0 },
    vat: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    bookingId: { type: String, required: true, unique: true, trim: true },
    date: { type: Date, required: true },
    dateKey: { type: String, required: true, trim: true },
    timeSlot: { type: String, required: true, trim: true },
    address: { type: bookingAddressSchema, required: true },
    serviceDetails: { type: bookingServiceDetailsSchema, required: true },
    pricing: { type: bookingPricingSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    images: [{ type: String, trim: true }],
    stripeSessionId: { type: String, default: "" },
    stripePaymentIntentId: { type: String, default: "" },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, dateKey: 1, timeSlot: 1 });
bookingSchema.index({ dateKey: 1, "address.city": 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);