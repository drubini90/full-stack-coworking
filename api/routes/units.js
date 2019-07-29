const router = require("express").Router({ mergeParams: true });
const Units = require("../models/unit");
const Companies = require("../models/company");

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

//gets all the units or units with provided kind or floor
router.get("/", async (req, res, next) => {
  const status = 200;
  try {
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
      response = await Units.find().select("-__v");
    }
    res.json({ status, response });
  } catch (error) {
    console.error(error);
    const e = new Error("Something went bad");
    e.status = 400;
    next(e);
  }
});
//Update the unit info or insert a new company
router.patch("/:id", async (req, res, next) => {
  const status = 202;
  let response;
  try {
    // search for unit to be updated
    const unit = await Units.findById(req.params.id);
    // if unit not found, return 404
    if (!unit) {
      const error = new Error(`Invalid Unit _id: ${req.params.id}`);
      error.status = 404;
      return next(error);
    }
    //else update the unit
    else {
      //if the company
      if (req.body.company) {
        let new_company = await Companies.create(req.body.company);
        unit.company = new_company._id;
        await unit.save();
      } else {
        response = await Units.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          upsert: true
        });
      }
    }
    res.json({ status, response });
  } catch (error) {
    console.error(error);
    const e = new Error("Unit not found");
    e.status = 404;
    next(e);
  }
});

//Update the company of the given unit id
router.patch("/:id/company", async (req, res, next) => {
  const status = 202;
  let response;
  try {
    const unit = await Units.findById(req.params.id);
    if (!unit) {
      const error = new Error(`Invalid Unit _id: ${req.params.id}`);
      error.status = 404;
      return next(error);
    }
    if (unit.company) {
      //if company already exists, update the company record
      response = await Companies.findByIdAndUpdate(
        unit.company,
        req.body.company,
        {
          new: true,
          upsert: true
        }
      );
    } else {
      //else create a new company record and assign that to unit
      let new_company = await Companies.create(req.body.company);
      unit.company = new_company._id;
      response = await unit.save();
    }
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
    if (!unit) {
      const error = new Error(`Invalid Unit _id: ${req.params.id}`);
      error.status = 404;
      return next(error);
    }
    unit.company = undefined;
    response = await unit.save();
    res.json({ status, response });
  } catch (error) {
    console.error(error);
    const e = new Error("Unit not found");
    e.status = 404;
    next(e);
  }
});

module.exports = router;
