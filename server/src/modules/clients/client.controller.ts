// src/modules/clients/client.controller.ts
// HTTP layer only. Validates body shape, delegates to service, formats response.

import { Request, Response } from "express";
import { create, getById, list, update, remove } from "./client.service";

// ─── Error map ────────────────────────────────────────────────────────────────

const SERVICE_ERRORS: Record<string, { status: number; message: string }> = {
  CLIENT_EMAIL_TAKEN: { status: 409, message: "A client with this email already exists" },
  CLIENT_NOT_FOUND:   { status: 404, message: "Client not found" },
  CLIENT_HAS_INVOICES:{ status: 409, message: "This client has existing invoices and cannot be deleted" },
};

function handleError(err: unknown, res: Response): void {
  if (err instanceof Error && SERVICE_ERRORS[err.message]) {
    const { status, message } = SERVICE_ERRORS[err.message];
    res.status(status).json({ success: false, message });
    return;
  }
  console.error("[client.controller]", err);
  res.status(500).json({ success: false, message: "Internal server error" });
}

// ─── POST /clients ────────────────────────────────────────────────────────────
// Body: { name, email?, phone?, company?, address? }

export async function createClientHandler(req: Request, res: Response): Promise<void> {
  const { name, email, phone, company, address } = req.body;
  const organizationId = req.user!.organizationId;

  if (!name) {
    res.status(400).json({ success: false, message: "name is required" });
    return;
  }

  try {
    const client = await create({ organizationId, name, email, phone, company, address });
    res.status(201).json({ success: true, data: client });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── GET /clients/:id ──────────────────────────────────────────────────────────

export async function getClientHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const organizationId = req.user!.organizationId;

  try {
    const client = await getById(id as string, organizationId);
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── GET /clients ──────────────────────────────────────────────────────────────
// Query: ?search=&page=&limit=

export async function listClientsHandler(req: Request, res: Response): Promise<void> {
  const organizationId = req.user!.organizationId;
  const { search, page, limit } = req.query;

  try {
    const result = await list({
      organizationId,
      search: search as string | undefined,
      page:   page  ? Number(page)  : undefined,
      limit:  limit ? Number(limit) : undefined,
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── PATCH /clients/:id ─────────────────────────────────────────────────────────

export async function updateClientHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const organizationId = req.user!.organizationId;
  const { name, email, phone, company, address } = req.body;

  try {
    const client = await update(id as string , organizationId, { name, email, phone, company, address });
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    handleError(err, res);
  }
}

// ─── DELETE /clients/:id ────────────────────────────────────────────────────────

export async function deleteClientHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const organizationId = req.user!.organizationId;

  try {
    await remove(id as string, organizationId);
    res.status(200).json({ success: true, message: "Client deleted successfully" });
  } catch (err) {
    handleError(err, res);
  }
}