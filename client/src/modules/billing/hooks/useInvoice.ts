import { useCallback, useState } from "react";
import { invoiceBillingService } from "../api";
import type { Invoice } from "../types";
import { useAuth } from "../../auth/context/AuthContext";

interface UseInvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;

  loadingInvoices: boolean;
  loadingInvoice: boolean;

  creating: boolean;
  updating: boolean;

  error: string | null;
}

export function useInvoice() {
  const { loading: authLoading, accessToken } = useAuth();

  const [state, setState] = useState<UseInvoiceState>({
    invoices: [],
    currentInvoice: null,

    loadingInvoices: false,
    loadingInvoice: false,

    creating: false,
    updating: false,

    error: null,
  });

  const listInvoices = useCallback(async () => {
    if (authLoading) return;
    if (!accessToken) return;

    setState((s) => ({
      ...s,
      loadingInvoices: true,
      error: null,
    }));

    try {
      const invoices = await invoiceBillingService.listInvoices();

      setState((s) => ({
        ...s,
        invoices,
        loadingInvoices: false,
      }));
      return invoices;
    } catch (err) {
      setState((s) => ({
        ...s,
        loadingInvoices: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to load invoices.",
      }));
      return null;
    }
  }, [authLoading, accessToken]);

  const getInvoice = useCallback(
    async (id: string): Promise<Invoice | null> => {
      if (authLoading) return null;
      if (!accessToken) return null;

      setState((s) => ({
        ...s,
        loadingInvoice: true,
        error: null,
      }));

      try {
        const invoice = await invoiceBillingService.getInvoice(id);

        setState((s) => ({
          ...s,
          currentInvoice: invoice,
          loadingInvoice: false,
        }));

        return invoice;
      } catch (err) {
        setState((s) => ({
          ...s,
          loadingInvoice: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load invoice.",
        }));

        return null;
      }
    },
    [authLoading, accessToken]
  );

  const createInvoice = useCallback(
    async (invoice: Partial<Invoice>): Promise<Invoice | null> => {
      if (authLoading) return null;
      if (!accessToken) return null;

      setState((s) => ({
        ...s,
        creating: true,
        error: null,
      }));

      try {
        const created = await invoiceBillingService.create(invoice);

        setState((s) => ({
          ...s,
          creating: false,
          invoices: [created, ...s.invoices],
        }));

        return created;
      } catch (err) {
        setState((s) => ({
          ...s,
          creating: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to create invoice.",
        }));

        return null;
      }
    },
    [authLoading, accessToken]
  );

  const updateInvoice = useCallback(
    async (
      id: string,
      data: Partial<Invoice>
    ): Promise<Invoice | null> => {
      if (authLoading) return null;
      if (!accessToken) return null;

      setState((s) => ({
        ...s,
        updating: true,
        error: null,
      }));

      try {
        const updated = await invoiceBillingService.update(id, data);

        setState((s) => ({
          ...s,
          updating: false,
          currentInvoice: updated,
          invoices: s.invoices.map((invoice) =>
            invoice.id === id ? updated : invoice
          ),
        }));

        return updated;
      } catch (err) {
        setState((s) => ({
          ...s,
          updating: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to update invoice.",
        }));

        return null;
      }
    },
    [authLoading, accessToken]
  );

  const clearCurrentInvoice = useCallback(() => {
    setState((s) => ({
      ...s,
      currentInvoice: null,
      error: null,
    }));
  }, []);

  return {
    state,

    listInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    clearCurrentInvoice,
  };
}