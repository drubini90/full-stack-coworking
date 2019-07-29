const router = require("express").Router({ mergeParams: true });
const Units = require("../models/unit");
const Company = require("../models/company");
const Employees = require("../models/employee");

router.get("/", async (req, res, next) => {
  const status = 200;
  let response;
  let result = await Units.find({
    company: { $exists: true }
  }).find({
    employee: { $exists: true }
  });
  if (req.query.name) {
    response = result.filter(emp => emp.full_name.includes(this.name));
  } else if (req.query.birthday) {
    response = result.filter(emp => emp.birthday.eq(this.name));
  } else {
    response = await Employees.find().select("-__v");
  }
  res.json(response);
});

module.exports = router;
