const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  label:  { type: String, required: true },
  value:  { type: Number, required: true },
  date:   { type: String, required: true }
});

module.exports = mongoose.model("Expense", expenseSchema);
