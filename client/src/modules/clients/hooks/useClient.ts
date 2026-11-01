// src/modules/clients/hooks/useClients.ts

import { useCallback, useEffect, useState } from "react";
import { clientService } from "../api";
import type { Client, CreateClientPayload, UpdateClientPayload, PaginatedClients } from "../types";

interface UseClientsOptions {
  search?: string;
  page?:   number;
  limit?:  number;
}

export function useClients(options: UseClientsOptions = {}) {
  const { search, page = 1, limit = 20 } = options;

  const [clients, setClients]       = useState<Client[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await clientService.list({ search, page, limit });
      const result: PaginatedClients = response.data;

      setClients(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = useCallback(async (payload: CreateClientPayload) => {
    const response = await clientService.create(payload);
    await fetchClients();
    return response.data as Client;
  }, [fetchClients]);

  const updateClient = useCallback(async (id: string, payload: UpdateClientPayload) => {
    const response = await clientService.update(id, payload);
    await fetchClients();
    return response.data as Client;
  }, [fetchClients]);

  const deleteClient = useCallback(async (id: string) => {
    await clientService.remove(id);
    await fetchClients();
  }, [fetchClients]);

  return {
    clients,
    total,
    totalPages,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}