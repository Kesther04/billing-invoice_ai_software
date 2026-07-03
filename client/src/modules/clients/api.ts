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
