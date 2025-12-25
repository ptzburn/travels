import mongoose, { InferSchemaType } from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

locationSchema.index({ user: 1, name: 1 }, { unique: true });

type LocationType = InferSchemaType<typeof locationSchema>;

export const Location = mongoose.model<LocationType>(
  "Location",
  locationSchema,
);
