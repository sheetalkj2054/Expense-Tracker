import { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { FaTrash, FaEdit, FaWindowClose } from "react-icons/fa";
import { publicRequest } from "./requestMethods";
import "./App.css";

export default function App() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [expenses, setExpenses] = useState([]);

  // Form state
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);

  // Load data
  useEffect(() => {
    publicRequest.get("/expenses").then(res => setExpenses(res.data)).catch(err => console.error(err));
  }, [refresh]);

  // Add Expense
  const addExpense = async () => {
    await publicRequest.post("/expenses", { label, value: +amount, date });
    resetForm(); setAddOpen(false); setRefresh(v => !v);
  };

  // Open Edit Modal
  const openEdit = e => {
    setEditId(e._id);
    setLabel(e.label);
    setAmount(e.value);
    setDate(e.date);
    setEditOpen(true);
  };

  // Submit Edit
  const submitEdit = async () => {
    await publicRequest.put(`/expenses/${editId}`, { label, value: +amount, date });
    resetForm(); setEditOpen(false); setRefresh(v => !v);
  };

  // Delete Expense
  const del = async id => {
    await publicRequest.delete(`/expenses/${id}`);
    setRefresh(v => !v);
  };

  const resetForm = () => { setLabel(""); setAmount(""); setDate(""); setEditId(null); };
  const filtered = expenses;
  const total = filtered.reduce((s, e) => s + e.value, 0);
  const pieData = filtered.map(e => ({ title: e.label, value: e.value, color: "#" + Math.floor(Math.random()*0xffffff).toString(16) }));

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl text-center mb-6">Expense Tracker</h1>
      <div className="flex justify-between mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setAddOpen(true)}>Add Expense</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => setChartOpen(true)}>Show Chart</button>
      </div>

      {/* Add Modal */}
      {addOpen && (
        <Modal title="Add Expense" onClose={() => { setAddOpen(false); resetForm(); }}>
          <ExpenseForm label={label} amount={amount} date={date} setLabel={setLabel} setAmount={setAmount} setDate={setDate} onSubmit={addExpense} submitText="Submit" />
        </Modal>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <Modal title="Edit Expense" onClose={() => { setEditOpen(false); resetForm(); }}>
          <ExpenseForm label={label} amount={amount} date={date} setLabel={setLabel} setAmount={setAmount} setDate={setDate} onSubmit={submitEdit} submitText="Update" />
        </Modal>
      )}

      {/* Chart Modal */}
      {chartOpen && (
        <Modal title="Expense Chart" onClose={() => setChartOpen(false)}>
          {pieData.length ? <PieChart data={pieData} radius={40} lineWidth={15} animate /> : <p className="text-center">No data</p>}
          <div className="mt-4 text-center font-bold">Total: ${total.toFixed(2)}</div>
        </Modal>
      )}

      {/* Expense List */}
      <div className="space-y-2">
        {filtered.map(e => (
          <div key={e._id} className="flex justify-between bg-white p-3 rounded shadow">
            <span>{e.label}</span>
            <span>{e.date}</span>
            <span>${e.value}</span>
            <div className="space-x-2">
              <FaEdit className="text-blue-500 cursor-pointer" onClick={() => openEdit(e)} />
              <FaTrash className="text-red-500 cursor-pointer" onClick={() => del(e._id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Modal Component & ExpenseForm can be placed in same file or separated

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80 relative">
        <FaWindowClose className="absolute top-2 right-2 text-red-500 cursor-pointer" onClick={onClose} />
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function ExpenseForm({ label, amount, date, setLabel, setAmount, setDate, onSubmit, submitText }) {
  return (
    <>
      <label className="block mb-1">Name</label>
      <input className="border w-full mb-2 p-1" value={label} onChange={e => setLabel(e.target.value)} />
      <label className="block mb-1">Amount</label>
      <input type="number" className="border w-full mb-2 p-1" value={amount} onChange={e => setAmount(e.target.value)} />
      <label className="block mb-1">Date</label>
      <input type="date" className="border w-full mb-4 p-1" value={date} onChange={e => setDate(e.target.value)} />
      <button className="bg-blue-600 text-white w-full py-2 rounded" onClick={onSubmit}>{submitText}</button>
    </>
  );
}
