import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
    image: { type: String, required: false },
}, {
    timestamps: true,
});

export const User = mongoose.model("User", userSchema);
