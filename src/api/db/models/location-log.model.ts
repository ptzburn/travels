import mongoose, { InferSchemaType } from "mongoose";

const locationLogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  startedAt: { type: Number, required: true },
  endedAt: { type: Number, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

export type LocationLogDocument = InferSchemaType<typeof locationLogSchema>;

export const LocationLog = mongoose.model<LocationLogDocument>(
  "LocationLog",
  locationLogSchema,
);
