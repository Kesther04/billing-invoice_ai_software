import axios from "axios";

let accessToken = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : null;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken?.accessToken || ""}`,
  },
});