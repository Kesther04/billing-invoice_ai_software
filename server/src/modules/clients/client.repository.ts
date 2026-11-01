// src/modules/clients/client.repository.ts
// Only module allowed to talk to Prisma for clients.

import prisma from "../../config/prisma";
import { CreateClientDto, UpdateClientDto, ListClientsQuery, SafeClient } from "./client.types";

export function toSafeClient(client: any): SafeClient {
  return {
    id:             client.id,
    organizationId: client.organizationId,
    name:           client.name,
    email:          client.email,
    phone:          client.phone,
    company:        client.company,
    address:        client.address,
    createdAt:      client.createdAt,
    updatedAt:      client.updatedAt,
  };
}

export async function createClient(dto: CreateClientDto) {
  return prisma.client.create({
    data: {
      organizationId: dto.organizationId,
      name:    dto.name,
      email:   dto.email,
      phone:   dto.phone,
      company: dto.company,
      address: dto.address,
    },
  });
}

export async function findClientById(id: string, organizationId: string) {
  return prisma.client.findFirst({
    where: { id, organizationId },
  });
}

export async function findClientByEmail(email: string, organizationId: string) {
  return prisma.client.findFirst({
    where: { email, organizationId },
  });
}

export async function listClients(query: ListClientsQuery) {
  const page  = query.page  ?? 1;
  const limit = query.limit ?? 20;
  const skip  = (page - 1) * limit;

  const where: any = { organizationId: query.organizationId };

  if (query.search) {
    where.OR = [
      { name:    { contains: query.search, mode: "insensitive" } },
      { email:   { contains: query.search, mode: "insensitive" } },
      { company: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.client.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function updateClient(id: string, organizationId: string, dto: UpdateClientDto) {
  const result = await prisma.client.updateMany({
    where: { id, organizationId },
    data:  dto,
  });

  if (result.count === 0) return null;

  return findClientById(id, organizationId);
}

export async function deleteClient(id: string, organizationId: string) {
  const result = await prisma.client.deleteMany({
    where: { id, organizationId },
  });

  return result.count > 0;
}

export async function countClientInvoices(clientId: string) {
  return prisma.invoice.count({
    where: { clientId },
  });
}