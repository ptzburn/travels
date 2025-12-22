import mongoose from "mongoose";

const locationLogImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
  locationLog: { type: mongoose.Schema.Types.ObjectId, ref: "LocationLog" },
}, {
  timestamps: true,
});

export const LocationLogImage = mongoose.model(
  "LocationLogImage",
  locationLogImageSchema,
);
