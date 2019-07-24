const router = require("express").Router({ mergeParams: true });
const Units = require("../models/unit");
const Company = require("../models/company");
const Employee = require("../models/employee");

// //get employees in a company with given unit id --->In progress
// router.get("/", async (req, res, next) => {
//   const status = 200;
//   console.log("reached route");
//   const employees = await Units.findById(req.params.id).exec(unit => {
//     employees = unit.company.employees;
//   });

//   // .find({
//   //   employees: { $exists: true }
//   // });
//   // console.log(unit.company);
//   // const employees = unit.company.employees;
//   console.log(`EMployee: ${employees}`);

//   res.json({ status, employees });
// });

// create a employee for a given unit
router.post("/", async (req, res, next) => {
  const status = 201;
  const unit = await Units.findById(req.params.id);
  console.log(unit);
  const employee = new Employee(req.body);
  console.log(`EMployee: ${employee}`);
  if (!unit.company.employees) {
    unit.company.employees = [];
  }
  unit.company.employees.push(employee);
  await unit.save();
  res.json({ status, employee });
});
module.exports = router;
