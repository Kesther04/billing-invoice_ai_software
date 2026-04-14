// src/modules/billing/ai/ai.controller.ts

import type { Request, Response, NextFunction } from "express";
import { aiService } from "./ai.service";
import type { GenerateInvoiceRequest } from "./ai.types";

export const aiController = {
  /**
   * POST /billing/ai/generate
   *
   * Accepts a natural-language prompt and returns a structured invoice
   * preview WITHOUT saving to the database yet.
   *
   * Body: { prompt: string }
   * Response: { invoice: ParsedInvoiceFromAI, confidence, suggestions }
   */
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt } = req.body as GenerateInvoiceRequest;

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        res.status(400).json({ message: "prompt is required" });
        return;
      }

      const result = await aiService.generateFromPrompt({ prompt: prompt });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /billing/ai/save
   *
   * Saves a previously AI-generated (and optionally user-edited) invoice
   * to the database. Accepts the full invoice payload + original prompt metadata.
   *
   * Body: {
   *   invoice:     ParsedInvoiceFromAI  (may have been edited by user)
   *   prompt:      string
   *   confidence:  number
   *   suggestions: string[]
   * }
   */
  async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { invoice, prompt, confidence, suggestions } = req.body as {
        invoice:     import("./ai.types").ParsedInvoiceFromAI;
        prompt:      string;
        confidence:  number;
        suggestions: string[];
      };

      if (!invoice || !prompt) {
        res.status(400).json({ message: "invoice and prompt are required" });
        return;
      }

      // req.user is populated by auth middleware
      const organizationId = (req as any).user?.organizationId as string;
      const createdById    = (req as any).user?.id as string;

      // Sender details come from the authenticated user's organisation
      const fromParty = {
        name:    (req as any).user?.organizationName ?? "Your Business",
        email:   (req as any).user?.email ?? "",
        address: (req as any).user?.organizationAddress,
      };

      const saved = await aiService.saveGeneratedInvoice({
        parsed: invoice,
        prompt,
        confidence,
        suggestions: suggestions ?? [],
        organizationId,
        createdById,
        fromParty,
      });

      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  },
};