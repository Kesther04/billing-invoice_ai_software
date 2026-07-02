import type { Request, Response } from "express";
import * as aiService from "./ai.service";

/**
 * POST /billing/ai/generate
 * Body: { prompt: string }
 * Returns: { draft: ParsedInvoiceDraft, promptRunId: string }
 */
export async function generateInvoice(req: Request, res: Response): Promise<void> {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    res.status(400).json({ message: "prompt is required" });
    return;
  }

  const organizationId = (req as any).user?.organizationId;
  const createdById    = (req as any).user?.id;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const result = await aiService.generateInvoiceDraft({
      prompt:         prompt.trim(),
      organizationId,
      createdById,
    });
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    res.status(422).json({ message });
  }
}

/**
 * GET /billing/ai/history
 * Returns the last 20 prompt runs for the authenticated org.
 */
export async function getPromptHistory(req: Request, res: Response): Promise<void> {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const history = await aiService.getPromptHistory(organizationId);
    res.status(200).json(history);
  } catch {
    res.status(500).json({ message: "Failed to fetch prompt history" });
  }
}