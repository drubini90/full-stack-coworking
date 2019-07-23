const mongoose = require("mongoose");
const validator = require("validator");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact_email: {
    type: String,
    required: true,
    lowercase: true,
    validate: value => {
      return validator.isEmail(value);
    }
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
});

module.exports = mongoose.model("Company", companySchema);
