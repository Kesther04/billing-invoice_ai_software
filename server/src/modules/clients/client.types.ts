// src/modules/clients/client.types.ts

// ─── DTOs ───────────────────────────────────────────────────────────────────

export interface CreateClientDto {
  organizationId: string;
  name:    string;
  email?:  string;
  phone?:  string;
  company?: string;
  address?: string;
}

export interface UpdateClientDto {
  name?:    string;
  email?:   string;
  phone?:   string;
  company?: string;
  address?: string;
}

export interface ListClientsQuery {
  organizationId: string;
  search?:  string;
  page?:    number;
  limit?:   number;
}

// ─── Response Shapes ────────────────────────────────────────────────────────

export interface SafeClient {
  id:             string;
  organizationId: string;
  name:           string;
  email:          string | null;
  phone:          string | null;
  company:        string | null;
  address:        string | null;
  createdAt:      Date;
  updatedAt:      Date;
}

export interface PaginatedClients {
  data:       SafeClient[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}