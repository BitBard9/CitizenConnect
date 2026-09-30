import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: String, index: true },
  priority: { type: String, enum: ["low", "medium", "urgent"], index: true },
  location: String,
  contactPhone: String,
  attachments: [String], // Future: image URLs
  status: { type: String, enum: ["pending", "approved", "assigned", "accepted", "rejected", "in-progress", "resolved", "unresolved", "closed"], default: "pending", index: true },
  residentUid: { type: String, index: true },      // Firebase UID of the resident
  assignedToUid: { type: String, default: "" },    // Firebase UID of technician
  technicianResponse: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }, // NEW: Technician acceptance
  rejectionReason: { type: String, default: "" },  // NEW: Why technician rejected
  statusHistory: [{                                 // NEW: Track status changes for notifications
    status: String,
    changedBy: String,
    changedAt: { type: Date, default: Date.now },
    note: String
  }],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

IssueSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Issue", IssueSchema);