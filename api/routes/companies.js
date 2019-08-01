const router = require("express").Router();
const Companies = require("../models/company");
const Employees = require("../models/employee");

router.get("/", async (req, res, next) => {
  const status = 200;
  try {
    let response;
    let company_list = await Companies.find();
    // query companies with company name
    if (req.query.name) {
      response = company_list.filter(company =>
        company.name.includes(req.query.name)
      );
    }
    // query companies with employees less than given number
    else if (req.query.employees_lte) {
      response = company_list.filter(company => {
        company.employees.length <= req.query.employees_lte;
      });
    }
    // query companies with employees greater than given number
    else if (req.query.employees_gte) {
      response = company_list.filter(company => {
        company.employees.length > req.query.employees_gte;
      });
      console.log(response);
    }
    //get all companies
    else {
      response = await Companies.find()
        .select("name contact_email employees")
        .populate({ path: "employees.employee", model: "Employee" }); //populate doesnt populate emp info - wip
    }
    res.json({ status, response });
  } catch (error) {
    console.error(error);
    const e = new Error("Something went bad");
    e.status = 400;
    next(e);
  }
});
module.exports = router;
