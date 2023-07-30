const express = require("express");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
let expenses = require("./Expense.json");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
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
    const newExpense = req.body;
    expenses.push({ id: expenses.length, ...req.body });
    res.status(201).json({
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        data: null,
        error: errors,
        message: "Validation error!",
      });
    }

    const expenseId = Number(req.params.id);
    const expenseToUpdate = expenses.find(
      (expense) => expense.id === expenseId
    );

    if (!expenseToUpdate) {
      return res.status(404).json({
        data: null,
        message: "Expense not found",
      });
    }

    expenses = expenses.map((expense) => {
      if (expense.id === expenseId) {
        return { ...expense, ...req.body };
      }
      return expense;
    });

    res.status(200).json({
      data: expenses,
      message: "Expense updated successfully!",
    });
  }
);

app.delete("/deleteExpense/:id", (req, res) => {
  const expenseId = Number(req.params.id);
  const expense = expenses.find((expense) => expense.id === expenseId);
  if (!expense) {
    return res.status(404).json({
      data: null,
      message: "Expense not found",
    });
  }
  deleteExpenseIndex = expenses.indexOf(expense);
  expenses.splice(deleteExpenseIndex, 1);

  res.status(200).json({
    message: "Expense deleted successfully!",
  });
});

app.listen(3030, () => {
  console.log("Listening on port 3030");
});
