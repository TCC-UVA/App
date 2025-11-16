import { useAuthStore } from "@/src/store/auth";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const financialApi = axios.create({
  baseURL: "https://query1.finance.yahoo.com/v1/finance",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
