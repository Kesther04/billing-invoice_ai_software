import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { aiBillingService } from "../api";
import type { Invoice, PromptRun } from "../types";

interface UseInvoiceAIState {
  prompt: string;
  isGenerating: boolean;
  error: string | null;
  history: PromptRun[];
  isLoadingHistory: boolean;
}

export function useInvoiceAI() {
  const [state, setState] = useState<UseInvoiceAIState>({
    prompt: "",
    isGenerating: false,
    error: null,
    history: [],
    isLoadingHistory: false,
  });

  const setPrompt = useCallback((prompt: string) => {
    setState((s) => ({ ...s, prompt, error: null }));
  }, []);

  /* Generate a draft from a prompt. Returns the draft (or null on failure)
     so the caller decides what to do next — it never saves anything itself. */
  const generate = useCallback(async (prompt: string): Promise<Partial<Invoice> | null> => {
    setState((s) => ({ ...s, isGenerating: true, error: null }));
    const run: PromptRun = {
      id: nanoid(),
      prompt,
      createdAt: new Date().toISOString(),
      status: "success",
    };
    try {
      const draft = await aiBillingService.generate(prompt);
      run.draft = draft as Invoice;
      setState((s) => ({
        ...s,
        isGenerating: false,
        history: [run, ...s.history],
      }));
      return draft;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't parse that prompt — try rephrasing it.";
      run.status = "error";
      run.error = message;
      setState((s) => ({
        ...s,
        isGenerating: false,
        error: message,
        history: [run, ...s.history],
      }));
      return null;
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setState((s) => ({ ...s, isLoadingHistory: true }));
    try {
      const history = await aiBillingService.listPromptHistory();
      setState((s) => ({ ...s, history, isLoadingHistory: false }));
    } catch {
      // Non-critical — history is a convenience, not load-bearing.
      setState((s) => ({ ...s, isLoadingHistory: false }));
    }
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({ ...s, prompt: "", error: null }));
  }, []);

  return {
    state,
    setPrompt,
    generate,
    loadHistory,
    reset,
  };
}