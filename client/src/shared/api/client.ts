import axios from "axios";
import { VITE_API_URL } from "../constants/API_URL";

let accessToken = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : null;

export const apiClient = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken?.accessToken || ""}`,
  },
});