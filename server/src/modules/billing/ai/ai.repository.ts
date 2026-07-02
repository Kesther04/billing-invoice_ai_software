import { nanoid } from "nanoid";
import prisma from "../../../config/prisma";
// import { Prisma } from "../../../generated/client";
import type { ParsedInvoiceDraft, PromptRunDTO } from "./ai.types";

/* ── Serializer — maps DB row to the DTO the frontend expects ───────────────── */
function toDTO(run: {
  id: string;
  prompt: string;
  status: string;
  draft: unknown;
  error: string | null;
  createdAt: Date;
}): PromptRunDTO {
  return {
    id:        run.id,
    prompt:    run.prompt,
    status:    run.status as "success" | "error",
    draft:     run.draft  as ParsedInvoiceDraft | undefined,
    error:     run.error  ?? undefined,
    createdAt: run.createdAt.toISOString(),
  };
}

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  return `INV-${year}-${nanoid(6).toUpperCase()}`;
}

/* ── Create a successful PromptRun ──────────────────────────────────────────── */
export async function createSuccessRun(params: {
  prompt: string;
  draft: ParsedInvoiceDraft;
  organizationId: string;
  createdById?: string;
}): Promise<PromptRunDTO> {
  const { prompt, draft, organizationId, createdById } = params;

  return prisma.$transaction(async (tx) => {
    const run = await tx.promptRun.create({
      data: {
        prompt,
        status: "success",
        draft: draft as object,
        organizationId,
        createdById: createdById ?? null,
      },
    });

    await tx.invoice.create({
      data: {
        invoiceNumber:
          draft.invoiceNumber ?? generateInvoiceNumber(),

        status: "draft",
        source: "ai",

        fromParty: draft.fromParty as object,
        toParty: draft.toParty as object,

        // Updated safe date initialization block
        issueDate: new Date(draft.issueDate ? (draft as any).issueDate : new Date()),
        dueDate: new Date(draft.dueDate ? (draft as any).dueDate : new Date()),

        subtotal: draft.subtotal,
        taxRate: draft.taxRate,
        taxAmount: draft.taxAmount,
        discountAmount: draft.discountAmount,
        total: draft.total,

        currency: draft.currency ?? "USD",
        notes: draft.notes,

        aiPrompt: prompt,
        aiConfidence: draft.aiConfidence,

        promptRun: {
          connect: {
            id: run.id,
          },
        },

        organization: {
          connect: {
            id: organizationId,
          },
        },

        // ...(draft.clientId && {client: { connect: {id: draft.toParty.clientId, },},}),

        ...(createdById && {
          createdBy: {
            connect: {
              id: createdById,
            },
          },
        }),

        lineItems: {
          create: draft.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
    });

    return toDTO(run);
  });
}

/* ── Create a failed PromptRun ──────────────────────────────────────────────── */
export async function createErrorRun(params: {
  prompt: string;
  error: string;
  organizationId: string;
  createdById?: string;
}): Promise<PromptRunDTO> {
  const run = await prisma.promptRun.create({
    data: {
      prompt:         params.prompt,
      status:         "error",
      error:          params.error,
      organizationId: params.organizationId,
      createdById:    params.createdById ?? null,
    },
  });
  return toDTO(run);
}

/* ── List recent prompt runs for an org (for the history panel) ─────────────── */
export async function listPromptHistory(
  organizationId: string,
  limit = 20
): Promise<PromptRunDTO[]> {
  const runs = await prisma.promptRun.findMany({
    where:   { organizationId },
    orderBy: { createdAt: "desc" },
    take:    limit,
  });
  return runs.map(toDTO);
}

/* ── Get a single run by ID ─────────────────────────────────────────────────── */
export async function getPromptRun(
  id: string,
  organizationId: string
): Promise<PromptRunDTO | null> {
  const run = await prisma.promptRun.findFirst({
    where: { id, organizationId },
  });
  return run ? toDTO(run) : null;
}