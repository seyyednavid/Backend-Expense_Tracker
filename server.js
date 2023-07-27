const express = require("express");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.listen(3030, () => {
  console.log("Listening on port 3030");
});
