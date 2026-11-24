import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "viewer",
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
