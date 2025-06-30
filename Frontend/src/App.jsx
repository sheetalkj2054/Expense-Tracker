import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { publicRequest } from "./requestMethods";
import "./App.css";

export default function App() {
  const [addOpen, setAddOpen]     = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [refresh, setRefresh]     = useState(false);
  const [expenses, setExpenses]   = useState([]);

  // Form state
  const [label, setLabel]   = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate]     = useState("");

  // Load data
  useEffect(() => {
    publicRequest.get("/expenses")
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
  }, [refresh]);

  // Add
  const addExpense = async () => {
    try {
      await publicRequest.post("/expenses", {
        label,
        value: +amount,
        date
      });
      setAddOpen(false);
      setLabel(""); setAmount(""); setDate("");
      setRefresh(v => !v);
    } catch (e) {
      console.error(e);
    }
  };

  // Delete
  const del = async (id) => {
    await publicRequest.delete(`/expenses/${id}`);
    setRefresh(v => !v);
  };

  const filtered = expenses;

  const total = filtered.reduce((s,e) => s + e.value, 0);
  const pieData = filtered.map(e => ({
    title: e.label,
    value: e.value,
    color: "#" + Math.floor(Math.random()*0xffffff).toString(16)
  }));

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl text-center mb-6">Expense Tracker</h1>

      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setAddOpen(true)}
        >Add Expense</button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setChartOpen(true)}
        >Show Chart</button>
      </div>

      {/* Add Modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 relative">
            <FaWindowClose
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              onClick={() => setAddOpen(false)}
            />
            <label>Name</label>
            <input
              className="border w-full mb-2"
              value={label}
              onChange={e=>setLabel(e.target.value)}
            />
            <label>Amount</label>
            <input
              type="number"
              className="border w-full mb-2"
              value={amount}
              onChange={e=>setAmount(e.target.value)}
            />
            <label>Date</label>
            <input
              type="date"
              className="border w-full mb-4"
              value={date}
              onChange={e=>setDate(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white w-full py-2 rounded"
              onClick={addExpense}
            >Submit</button>
          </div>
        </div>
      )}

      {/* Chart Modal */}
      {chartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 relative">
            <FaWindowClose
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              onClick={() => setChartOpen(false)}
            />
            {pieData.length
              ? <PieChart data={pieData} radius={40} lineWidth={15} animate />
              : <p className="text-center">No data</p>
            }
            <div className="mt-4 text-center font-bold">
              Total: ${total.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {filtered.map(e => (
          <div
            key={e._id}
            className="flex justify-between bg-white p-3 rounded shadow"
          >
            <span>{e.label}</span>
            <span>{e.date}</span>
            <span>${e.value}</span>
            <div className="space-x-2">
              <FaTrash
                className="text-red-500 cursor-pointer"
                onClick={()=>del(e._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
