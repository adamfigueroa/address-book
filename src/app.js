require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  (validateBearerToken = (req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get("Authorization");
    if (!authToken || authToken.split(" ")[1] !== apiToken) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    next();
  })
);

let addressBook = [];

app.get("/address", (req, res) => {
  res.json(addressBook);
});

app.post("/address", (req, res) => {
  console.log(req.body);
  const {
    firstName,
    lastName,
    address1,
    address2 = false,
    city,
    state,
    zip,
  } = req.body;

  if (!firstName) {
    return res
    .status(400)
    .json({ error: "First name is required" });
  }

  if (!lastName) {
    return res
    .status(400)
    .json({ error: "Last name is required" });
  }

  if (!address1) {
    return res
    .status(400)
    .json({ error: "Address is required" });
  }

  if (!city) {
    return res
    .status(400)
    .json({ error: "City is required" });
  }

  res.send("okay okay I got it.");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;