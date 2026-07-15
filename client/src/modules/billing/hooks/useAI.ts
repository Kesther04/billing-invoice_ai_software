import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { aiBillingService } from "../api";
import type {  ParsedInvoiceDraft, PromptRun } from "../types";
import { useAuth } from "../../auth/context/AuthContext";

interface UseAIState {
  prompt: string;
  isGenerating: boolean;
  error: string | null;
  history: PromptRun[];
  isLoadingHistory: boolean;
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    prompt: "",
    isGenerating: false,
    error: null,
    history: [],
    isLoadingHistory: false,
  });
  const { loading: authLoading, accessToken } = useAuth();

  const setPrompt = useCallback((prompt: string) => {
    setState((s) => ({ ...s, prompt, error: null }));
  }, []);

  /* Generate a draft from a prompt. Returns the draft (or null on failure)
     so the caller decides what to do next — it never saves anything itself. */
  const generate = useCallback(async (prompt: string): Promise<ParsedInvoiceDraft | null> => {
    // Wait until authentication has been restored
    if (authLoading) return null;

    // User is not authenticated
    if (!accessToken) {
      setState((s) => ({
        ...s,
        error: "You must be logged in to generate invoices.",
      }));
      return null;
    }

    setState((s) => ({ ...s, isGenerating: true, error: null }));
    const run: PromptRun = {
      id: nanoid(),
      prompt,
      createdAt: new Date().toISOString(),
      status: "success",
    };
    try {
      const {draft, promptRunId} = await aiBillingService.generate(prompt);
      run.draft = draft;
      run.id = promptRunId;
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
  }, [authLoading, accessToken]);

  const loadHistory = useCallback(async () => {
     if (authLoading) return;

    if (!accessToken) {
      setState((s) => ({
        ...s,
        history: [],
        isLoadingHistory: false,
      }));
      return;
    }

    setState((s) => ({ ...s, isLoadingHistory: true }));
    try {
      const history = await aiBillingService.listPromptHistory();
      setState((s) => ({ ...s, history, isLoadingHistory: false }));
    } catch {
      // Non-critical — history is a convenience, not load-bearing.
      setState((s) => ({ ...s, isLoadingHistory: false }));
    }
  }, [authLoading, accessToken]);

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