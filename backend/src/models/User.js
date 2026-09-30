import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, index: true },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, index: true },
  role: { type: String, enum: ["resident", "committee", "technician"], default: "resident", index: true },
  firstName: String,
  lastName: String,
  phone: String,
  building: String,
  unit: String,
  specialization: { type: [String], default: [] },
  isApproved: { type: Boolean, default: true },    // NEW: Technician approval status (default true for residents/committee)
  approvedBy: { type: String, default: "" },       // NEW: Committee member who approved
  approvedAt: { type: Date },                      // NEW: When approved
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);



