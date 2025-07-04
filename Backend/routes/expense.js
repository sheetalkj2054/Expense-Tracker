const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ADD EXPENSE
router.post("/", async (req, res) => {
  const newExpense = Expense(req.body);
  try {
    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL EXPENSES
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE EXPENSE
router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE EXPENSE
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense successfully deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;