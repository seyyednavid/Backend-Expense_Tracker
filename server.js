const express = require("express");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const mongoose = require("mongoose");
// let expenses = require("./Expense.json");
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/track-expenses")
  .then(() => console.log("Connected to mongoDB"))
  .catch(() => console.log("Could not connect to mongoDB"));

const expenseSchema = mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const Expense = mongoose.model("Expense", expenseSchema);

app.get("/", async (req, res) => {
  const expenses = await Expense.find();
  res.json({
    data: expenses,
    message: "ok",
  });
});

app.post(
  "/addExpense",
  [
    body("title").trim().escape().notEmpty().withMessage("Title is required"),
    body("amount")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Amount is required")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be a number greater than 0"),
    body("date", "date Must not be empty")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Invalid date format!"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        data: null,
        error: errors,
        message: "Validation error!",
      });
    }
    let newExpense = new Expense({
      title: req.body.title,
      amount: req.body.amount,
      date: req.body.date,
    });
    newExpense.save();
    newExpense = res.status(201).json({
      data: newExpense,
      message: "Expense added successfully.",
    });
  }
);

app.put(
  "/updateExpense/:id",
  [
    body("title").trim().escape().notEmpty().withMessage("Title is required"),
    body("amount")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Amount is required")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be a number greater than 0"),
    body("date", "date Must not be empty")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Invalid date format!"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        data: null,
        error: errors,
        message: "Validation error!",
      });
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        amount: req.body.amount,
        date: req.body.date,
      },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({
        data: null,
        message: "Expense not found",
      });
    }
    res.status(200).json({
      message: "Expense updated successfully!",
    });
  }
);

app.delete("/deleteExpense/:id", async (req, res) => {
  const expense = await Expense.findByIdAndRemove(req.params.id);
  if (!expense) {
    return res.status(404).json({
      data: null,
      message: "Expense not found",
    });
  }
  res.status(200).json({
    message: "Expense deleted successfully!",
  });
});

app.listen(3030, () => {
  console.log("Listening on port 3030");
});
