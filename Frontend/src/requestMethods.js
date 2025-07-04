import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://expense-backend-09wu.onrender.com"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
