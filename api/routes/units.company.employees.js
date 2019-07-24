const router = require("express").Router({ mergeParams: true });
const Units = require("../models/unit");
const Company = require("../models/company");

//get employees in a company with given unit id
router.get("/", async (req, res, next) => {
  const status = 200;
  const { company } = await Units.findById(req.params.id).select("company");
  console.log(company);
  const employees = company.employees;
  res.json({ status, employees });
});

module.exports = router;
