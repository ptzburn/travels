import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  lat: { type: Number, required: true },
  lang: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
});

export const Location = mongoose.model("Location", locationSchema);
