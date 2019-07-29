const router = require("express").Router({ mergeParams: true });
const Units = require("../models/unit");
const Companies = require("../models/company");
const Employees = require("../models/employee");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
//get employees for a given unit
router.get("/", async (req, res, next) => {
  const status = 200;
  let response = [];
  try {
    //get the unit
    const unit = await Units.findById(req.params.id);
    if (!unit) {
      //if unit found send an error
      const error = new Error(`Invalid Unit _id: ${req.params.id}`);
      error.status = 404;
      return next(error);
    }
    if (unit.company) {
      //if the unit has a company, find the company document
      let result_company = await Companies.findById(unit.company);
      // for each employee object in result company, get employee from employees where id = employee id
      await asyncForEach(result_company.employees, async employeeId => {
        console.log(`Employee ID ${employeeId}`);
        let emp = await Employees.findById(employeeId);
        console.log(`Employee:${typeof emp}`);
        response.push(emp);
        //   console.log(emp);
      });
      console.log(`EMployees count:${response.length}`);

      res.json({ status, response });
    } else {
      //if company is undefined for an unit
      const error = new Error(`No company is listed for the given unit`);
      error.status = 404;
      return next(error);
    }
  } catch (error) {
    console.error(error);
    const e = new Error("Something went bad");
    e.status = 400;
    next(e);
  }
});
//get employee with employee id and unit id
//create a new employee for the company in the given unit id
//creates a unit
router.post("/", async (req, res, next) => {
  const status = 201;
  try {
    //get the unit
    const unit = await Units.findById(req.params.id);
    if (!unit) {
      //if unit found send an error
      const error = new Error(`Invalid Unit _id: ${req.params.id}`);
      error.status = 404;
      return next(error);
    }
    if (unit.company) {
      //if the unit has a company, find the company document
      let result_company = await Companies.findById(unit.company);
      //create an employee document
      const new_employee = await Employees.create(req.body);
      //psuh the employee document into company's employee array
      result_company.employees.push(new_employee);
      await result_company.save();
      res.json({ status, new_employee });
    } else {
      //if company is undefined for an unit
      const error = new Error(`No company is listed for the given unit`);
      error.status = 404;
      return next(error);
    }
  } catch (error) {
    console.error(error);
    const e = new Error("Employee information is invalid");
    e.status = 400;
    next(e);
  }
});
//update an employee with employee id for the company in the given unit id
//delete the employee document

module.exports = router;
