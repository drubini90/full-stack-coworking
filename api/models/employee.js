const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  preferred_name: { type: String },
  position: { type: String },
  birthday: { type: Date },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: value => {
      return validator.isEmail(value);
    }
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
