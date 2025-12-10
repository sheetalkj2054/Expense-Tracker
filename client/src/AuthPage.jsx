import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuthPage = () => {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res =
        mode === "signup"
          ? await axios.post(`${API_URL}/auth/signup`, form)
          : await axios.post(`${API_URL}/auth/login`, {
              email: form.email,
              password: form.password,
            });

      login(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Expense Tracker
        </h1>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`px-4 py-2 rounded-full text-sm ${
              mode === "login"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-2 rounded-full text-sm ${
              mode === "signup"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div>
              <label className="text-sm">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="text-sm">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
