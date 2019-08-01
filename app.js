const { MONGO_DB_CONNECTION, NODE_ENV, PORT } = process.env;
const express = require("express");
const mongoose = require("mongoose");
const app = express();

if (MONGO_DB_CONNECTION) {
  const options = {
    useNewUrlParser: true,
    useFindAndModify: false
  };
  mongoose.connect(MONGO_DB_CONNECTION, options);
  console.log("Connected to database...");
} else {
  console.log("Could not connect to database!");
}

if (NODE_ENV === "development") app.use(require("morgan")("dev"));
app.use(require("body-parser").json());

//Routes
app.use("/api/v1/units", require("./api/routes/units.js"));
app.use(
  "/api/v1/units/:id/company/employees",
  require("./api/routes/units.employees.js")
);
app.use("/api/v1/companies", require("./api/routes/companies.js"));
// app.use("/api/v1/employees", require("./api/routes/employees.js"));

app.use((err, req, res, next) => {
  if (NODE_ENV === "development") console.error(err);
  const { message, status } = err;
  res.status(status).json({ status, message });
});

const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener);
