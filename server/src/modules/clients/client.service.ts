// src/modules/clients/client.service.ts
// Business logic. Controller calls this; this calls the repository.

import {
  createClient,
  findClientById,
  findClientByEmail,
  listClients,
  updateClient,
  deleteClient,
  countClientInvoices,
  toSafeClient,
} from "./client.repository";

import {
  CreateClientDto,
  UpdateClientDto,
  ListClientsQuery,
  SafeClient,
  PaginatedClients,
} from "./client.types";

// ─── Create ─────────────────────────────────────────────────────────────────

export async function create(dto: CreateClientDto): Promise<SafeClient> {
  if (dto.email) {
    const existing = await findClientByEmail(dto.email, dto.organizationId);
    if (existing) throw new Error("CLIENT_EMAIL_TAKEN");
  }

  const client = await createClient(dto);
  return toSafeClient(client);
}

// ─── Get by id ──────────────────────────────────────────────────────────────

export async function getById(id: string, organizationId: string): Promise<SafeClient> {
  const client = await findClientById(id, organizationId);
  if (!client) throw new Error("CLIENT_NOT_FOUND");
  return toSafeClient(client);
}

// ─── List ───────────────────────────────────────────────────────────────────

export async function list(query: ListClientsQuery): Promise<PaginatedClients> {
  const { data, total, page, limit } = await listClients(query);

  return {
    data: data.map(toSafeClient),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── Update ─────────────────────────────────────────────────────────────────

export async function update(
  id: string,
  organizationId: string,
  dto: UpdateClientDto
): Promise<SafeClient> {
  const existing = await findClientById(id, organizationId);
  if (!existing) throw new Error("CLIENT_NOT_FOUND");

  if (dto.email && dto.email !== existing.email) {
    const emailOwner = await findClientByEmail(dto.email, organizationId);
    if (emailOwner && emailOwner.id !== id) throw new Error("CLIENT_EMAIL_TAKEN");
  }

  const updated = await updateClient(id, organizationId, dto);
  if (!updated) throw new Error("CLIENT_NOT_FOUND");

  return toSafeClient(updated);
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export async function remove(id: string, organizationId: string): Promise<void> {
  const existing = await findClientById(id, organizationId);
  if (!existing) throw new Error("CLIENT_NOT_FOUND");

  const invoiceCount = await countClientInvoices(id);
  if (invoiceCount > 0) throw new Error("CLIENT_HAS_INVOICES");

  const deleted = await deleteClient(id, organizationId);
  if (!deleted) throw new Error("CLIENT_NOT_FOUND");
}