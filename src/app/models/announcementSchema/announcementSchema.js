// models/Announcement.ts
import mongoose, { Schema, model, models } from "mongoose";

const announcementSchema = new Schema(
  {
    message: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  },
  { timestamps: true }
);


export default  models.Announcement || model("Announcement", announcementSchema);
