const router = require("express").Router({ mergeParams: true });
const Employees = require("../models/employee");

router.get("/", async (req, res, next) => {
  const status = 200;
  let response;
  if (req.query.name) {
    let result = await Employees.find().select("-__v");
    response = result.filter(emp => emp.full_name.includes(this.name));
  } else if (req.query.birthday) {
    response = await Employees.find({
      birthday: req.query.birthday
    }).select("-__v");
  } else {
    response = await Employees.find().select("-__v");
  }
  res.json(response);
});

//   app.get("/vegetables", (req, res, next) => {
//     if (req.query) {
//       const { vegetables } = data;
//       const { name } = req.query;
//       const result = vegetables.filter(veggie => veggie.name.includes(name));
//       res.json(result);
//     } else {
//       const { vegetables } = data;
//       res.json(vegetables);
//     }
//   });

module.exports = router;
