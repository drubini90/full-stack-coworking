const router = require("express").Router({ mergeParams: true });
const Units = require("../models/unit");
const Company = require("../models/company");

const queryAllUnits = () => {};

router.get("/", async (req, res, next) => {
  const status = 200;
  const response = await Units.find()
    .select("company")
    .populate({
      path: "company",
      model: "Company",
      populate: {
        path: "employee",
        model: "Employee"
      }
    });
  res.json(response);
});
module.exports = router;
