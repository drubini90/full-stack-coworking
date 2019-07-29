const mongoose = require("mongoose");

const kind = ["seat", "desk", "small office", "large office", "floor"];

const unitSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: kind, required: true },
    floor: { type: Number, required: true },
    special_monthly_offer: { type: Number },
    company: mongoose.ObjectId
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Unit", unitSchema);
