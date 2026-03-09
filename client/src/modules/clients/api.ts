import { apiClient } from "../../shared/api/client";
import type { Client, ClientFormData } from "./types";


export const clientService = { 
  listClients: async (): Promise<Client[]> => {
    const response = await apiClient.get("/clients");
    return response.data;
  },
  getClient: async (id: string): Promise<Client> => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },
  createClient: async (data: ClientFormData): Promise<Client> => {
    const response = await apiClient.post("/clients", data);
    return response.data;
  },
  updateClient: async (id: string, data: Partial<ClientFormData>): Promise<Client> => {
    const response = await apiClient.patch(`/clients/${id}`, data);
    return response.data;
  },
  deleteClient: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  }
};

// function headers(): HeadersInit {
//   const raw = localStorage.getItem("token");
//   const token = raw ? JSON.parse(raw).accessToken : null;
//   return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
// }

// export async function listClients(): Promise<Client[]> {
//   const r = await fetch(`${BASE}/clients`, { headers: headers() });
//   if (!r.ok) throw new Error("Failed to fetch clients");
//   return r.json();
// }

// export async function getClient(id: string): Promise<Client> {
//   const r = await fetch(`${BASE}/clients/${id}`, { headers: headers() });
//   if (!r.ok) throw new Error("Client not found");
//   return r.json();
// }

// export async function createClient(data: ClientFormData): Promise<Client> {
//   const r = await fetch(`${BASE}/clients`, { method: "POST", headers: headers(), body: JSON.stringify(data) });
//   if (!r.ok) throw new Error("Failed to create client");
//   return r.json();
// }

// export async function updateClient(id: string, data: Partial<ClientFormData>): Promise<Client> {
//   const r = await fetch(`${BASE}/clients/${id}`, { method: "PATCH", headers: headers(), body: JSON.stringify(data) });
//   if (!r.ok) throw new Error("Failed to update client");
//   return r.json();
// }

// export async function deleteClient(id: string): Promise<void> {
//   const r = await fetch(`${BASE}/clients/${id}`, { method: "DELETE", headers: headers() });
//   if (!r.ok) throw new Error("Failed to delete client");
// }