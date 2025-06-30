require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const mongoose= require("mongoose");
const expenseRoute = require("./routes/expense");

const app = express();
app.use(cors());
app.use(express.json());

// Mount your router at /expenses
app.use("/expenses", expenseRoute);

mongoose.connect(process.env.DB_CONNECTION, {
  family: 4,
  readPreference: "primaryPreferred"  // ← allow reads from secondaries if primary is down
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
