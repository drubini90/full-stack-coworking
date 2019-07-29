const mongoose = require("mongoose");
const validator = require("validator");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact_email: {
      type: String,
      required: true,
      lowercase: true,
      validate: value => {
        return validator.isEmail(value);
      }
    },
    employees: [mongoose.ObjectId]
  },
  {
    _id: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

module.exports = mongoose.model("Company", companySchema);
