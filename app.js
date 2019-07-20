const { MONGO_DB_CONNECTION, NODE_ENV, PORT } = process.env;
const express = require("express");
const morgan = require("morgan");
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

if (NODE_ENV === "development") app.use(morgan("dev"));
app.use(require("body-parser").json());

app.use((err, req, res, next) => {
  if (NODE_ENV === "development") console.error(err);
  const { message, status } = err;
  res.status(status).json({ status, message });
});

const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener);
