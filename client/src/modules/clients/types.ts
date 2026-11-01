// src/modules/clients/types.ts

export interface Client {
  id:             string;
  organizationId: string;
  name:           string;
  email:          string | null;
  phone:          string | null;
  company:        string | null;
  address:        string | null;
  createdAt:      string;
  updatedAt:      string;
}

export interface CreateClientPayload {
  name:     string;
  email?:   string;
  phone?:   string;
  company?: string;
  address?: string;
}

export interface UpdateClientPayload {
  name?:    string;
  email?:   string;
  phone?:   string;
  company?: string;
  address?: string;
}

export interface ListClientsParams {
  search?: string;
  page?:   number;
  limit?:  number;
}

export interface PaginatedClients {
  data:       Client[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}