import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  price: { type: String, required: true },
  icon: { type: String, required: true },
  image: { type: String, required: true }, // static path like /images/services/cleaning.webp
}, { timestamps: true });

export default mongoose.model("Service", ServiceSchema);
