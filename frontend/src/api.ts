// frontend/src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",   // ← TEMP: hard-code to be sure
  timeout: 30000,
});

export default api;
