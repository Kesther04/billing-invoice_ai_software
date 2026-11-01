// src/modules/clients/api.ts

import { apiClient } from "../../shared/api/client";
import type { CreateClientPayload, UpdateClientPayload, ListClientsParams } from "./types";

export const clientService = {
  list: async (params?: ListClientsParams) => {
    const response = await apiClient.get("/clients", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  create: async (payload: CreateClientPayload) => {
    const response = await apiClient.post("/clients", payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateClientPayload) => {
    const response = await apiClient.patch(`/clients/${id}`, payload);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  },
};