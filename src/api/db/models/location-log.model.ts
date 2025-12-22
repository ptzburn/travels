import mongoose from "mongoose";

const locationLogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  startedAt: { type: Number, required: true },
  endedAt: { type: Number, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
}, {
  timestamps: true,
});

export const LocationLog = mongoose.model("LocationLog", locationLogSchema);
