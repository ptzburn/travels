import mongoose, { InferSchemaType } from "mongoose";
import "./location-log.model.ts";

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
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

locationSchema.index({ user: 1, name: 1 }, { unique: true });

locationSchema.virtual("logs", {
  ref: "LocationLog",
  localField: "_id",
  foreignField: "location",
});

type LocationDocument = InferSchemaType<typeof locationSchema>;

export const Location = mongoose.model<
  LocationDocument
>(
  "Location",
  locationSchema,
);
