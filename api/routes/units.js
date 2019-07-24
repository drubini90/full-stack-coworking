const router = require("express").Router({ mergeParams: true });
const Units = require("../models/unit");
const Company = require("../models/company");

//gets all the units or units with provided kind or floor
router.get("/", async (req, res, next) => {
  const status = 200;
  let response;
  if (req.query.kind) {
    response = await Units.find({
      kind: req.query.kind
    }).select("-__v");
  } else if (req.query.floor) {
    response = await Units.find({
      floor: req.query.floor
    }).select("-__v");
  } else if (req.query.occupied) {
    response = await Units.find({
      company: { $exists: req.query.occupied }
    }).select("-__v");
  } else {
    response = await Units.find()
      .select("-__v")
      .populate({
        //populate not working - need to review
        path: "company",
        model: "Company",
        populate: {
          path: "employee",
          model: "Employee"
        }
      });
  }
  res.json(response);
});

//Update the unit and insert a new company
router.patch("/:id", async (req, res, next) => {
  const status = 202;
  let response;
  try {
    if (req.body.company) {
      const unit = await Units.findById(req.params.id);
      unit.company = new Company({
        name: req.body.company.name,
        contact_email: req.body.company.contact_email,
        employees: []
      });
      response = await unit.save();
    } else {
      response = await Units.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        upsert: true
      });
    }
    res.json({ status, response });
  } catch (error) {
    console.error(error);
    const e = new Error("Unit not found");
    e.status = 404;
    next(e);
  }
});

//Update the company with the given unit id
router.patch("/:id/company", async (req, res, next) => {
  const status = 202;
  let response;
  try {
    const unit = await Units.findById(req.params.id);
    if (unit.find({ company: { $exists: true } })) {
      unit.company.name = req.body.name;
      unit.company.contact_email = req.body.contact_email;
    } else {
      unit.company = new Company({
        name: req.body.name,
        contact_email: req.body.contact_email,
        employees: []
      });
    }
    response = await unit.save();
    res.json({ status, response });
  } catch (error) {
    console.error(error);
    const e = new Error("Unit not found");
    e.status = 404;
    next(e);
  }
});

//Remove the company from given unit
router.delete("/:id/company", async (req, res, next) => {
  const status = 202;
  let response;
  try {
    const unit = await Units.findById(req.params.id);
    unit.company.remove();
    response = await unit.save();
    res.json({ status, response });
  } catch (error) {
    console.error(error);
    const e = new Error("Unit not found");
    e.status = 404;
    next(e);
  }
});

//creates a unit
router.post("/", async (req, res, next) => {
  const status = 201;
  try {
    const response = await Units.create(req.body);
    res.json({ status, response });
  } catch (error) {
    console.error(error);
    const e = new Error("Something went bad");
    e.status = 400;
    next(e);
  }
});

module.exports = router;
