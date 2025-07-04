const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ADD EXPENSE
router.post("/", async (req, res) => {
  // Instantiate model correctly
  const newExpense = new Expense(req.body);
  try {
    const expense = await newExpense.save();
    return res.status(201).json(expense);
  } catch (error) {
    console.error("Expense save failed:", error);
    return res.status(500).json({ message: error.message });
  }
});

// GET ALL EXPENSES
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    return res.status(200).json(expenses);
  } catch (error) {
    console.error("Fetching expenses failed:", error);
    return res.status(500).json({ message: error.message });
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
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    return res.status(200).json(expense);
  } catch (error) {
    console.error("Updating expense failed:", error);
    return res.status(500).json({ message: error.message });
  }
});

// DELETE EXPENSE
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    return res.status(200).json({ message: "Expense successfully deleted" });
  } catch (error) {
    console.error("Deleting expense failed:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;