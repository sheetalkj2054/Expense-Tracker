import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import AnalyticsCard from "./components/AnalyticsCard";

const Home = () => {
  const { user, axiosAuth, logout } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);

  // ==========================
  // DELETE ACCOUNT
  // ==========================
  const handleDeleteAccount = async () => {
    if (!confirm("Delete your account and all expenses permanently?")) return;

    try {
      await axiosAuth.delete("/auth/me");
      logout();
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert(err?.response?.data?.message || "Failed to delete account");
    }
  };

  // ==========================
  // FETCH EXPENSES
  // ==========================
  const fetchExpenses = async () => {
    const res = await axiosAuth.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ==========================
  // FORM HANDLERS
  // ==========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    if (editingId) {
      const res = await axiosAuth.put(`/expenses/${editingId}`, payload);
      setExpenses((prev) =>
        prev.map((ex) => (ex._id === editingId ? res.data : ex))
      );
    } else {
      const res = await axiosAuth.post("/expenses", payload);
      setExpenses([res.data, ...expenses]);
    }

    // Reset form
    setForm({ title: "", amount: "", category: "", date: "" });
    setEditingId(null);
  };

  // ==========================
  // DELETE EXPENSE
  // ==========================
  const deleteExpense = async (id) => {
    await axiosAuth.delete(`/expenses/${id}`);
    setExpenses(expenses.filter((e) => e._id !== id));
  };

  // Total spending
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
      {/* ====================== HEADER ====================== */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Hi, {user.name}
        </h1>

        <div className="flex items-center gap-3">
          {/* Delete Account */}
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete Account
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ====================== GRID LAYOUT ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Add Expense + Expense List */}
        <div className="lg:col-span-2 space-y-6">
          {/* ADD EXPENSE FORM */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-5">
            <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">
              {editingId ? "Update Expense" : "Add Expense"}
            </h2>

            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="col-span-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:text-gray-200"
              />

              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:text-gray-200"
              />

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:text-gray-200"
              />

              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="col-span-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:text-gray-200"
              />

              <button className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                {editingId ? "Update Expense" : "Add Expense"}
              </button>
            </form>
          </div>

          {/* EXPENSE LIST */}
          <div className="space-y-3">
            {expenses.map((e) => (
              <div
                key={e._id}
                className="bg-white dark:bg-gray-800 shadow p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold dark:text-gray-100">{e.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ₹{e.amount} • {e.category} •{" "}
                    {new Date(e.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingId(e._id);
                      setForm(e);
                    }}
                    className="text-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteExpense(e._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: ANALYTICS */}
        <AnalyticsCard expenses={expenses} />
      </div>
    </div>
  );
};

export default Home;
