import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },  // Who receives this notification
  issueId: { type: String, required: true },              // Related issue
  type: { type: String, enum: ["status_change", "assignment", "rejection", "approval"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true }
});

export default mongoose.model("Notification", NotificationSchema);
