// routes/expense.js
const router = require("express").Router();

// temporary in‑memory store
let store = [];

// CREATE
router.post("/", (req, res) => {
  console.log("POST /expenses body:", req.body);
  const { label, value, date } = req.body;
  if (!label || value == null || !date) {
    return res.status(400).json({ error: "All fields required" });
  }
  const newExp = {
    _id: Date.now().toString(),
    label,
    value: Number(value),
    date,
  };
  store.unshift(newExp);
  return res.status(201).json(newExp);
});

// READ
router.get("/", (req, res) => {
  console.log("GET /expenses →", store.length, "items");
  return res.json(store);
});

// UPDATE
router.put("/:id", (req, res) => {
  console.log("PUT /expenses/:id", req.params.id, req.body);
  const idx = store.findIndex((e) => e._id === req.params.id);
  if (idx === -1) return res.sendStatus(404);
  store[idx] = { ...store[idx], ...req.body };
  return res.json(store[idx]);
});

// DELETE
router.delete("/:id", (req, res) => {
  console.log("DELETE /expenses/:id", req.params.id);
  store = store.filter((e) => e._id !== req.params.id);
  return res.sendStatus(204);
});

module.exports = router;
