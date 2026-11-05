import { useState } from "react";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { useClients } from "../hooks/useClient";
import { ClientList } from "../components/ClientList";
import { ClientForm } from "../components/ClientForm";
import { ClientDetailsCard } from "../components/ClientDetailsCard";
import { SoftButton } from "../../../shared/components/Button";
import { Modal } from "../../../shared/components/Modal";
import { Input } from "../../../shared/components/Input";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import type { Client } from "../types";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; client: Client };

export function ClientsPage() {
  const { dark } = useTheme();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [page, setPage] = useState(1);

  const {
    clients,
    totalPages,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
  } = useClients({ search: debouncedSearch, page, limit: 20 });

  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(payload: Parameters<typeof createClient>[0]) {
    setSubmitting(true);
    try {
      await createClient(payload);
      setModal({ type: "none" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(id: string, payload: Parameters<typeof updateClient>[1]) {
    setSubmitting(true);
    try {
      const updated = await updateClient(id, payload);
      setModal({ type: "none" });
      if (selectedClient?.id === id) setSelectedClient(updated);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(client: Client) {
    const confirmed = window.confirm(`Delete ${client.name}? This cannot be undone.`);
    if (!confirmed) return;

    await deleteClient(client.id);
    if (selectedClient?.id === client.id) setSelectedClient(null);
  }

  const heading = dark ? "text-white" : "text-slate-900";
  const subtext = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen px-6 py-8 lg:px-10 ${dark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={`text-2xl font-semibold ${heading}`}>Clients</h1>
            <p className={`mt-1 text-sm ${subtext}`}>
              {loading ? "Loading clients…" : `${clients.length} client${clients.length === 1 ? "" : "s"} on this page`}
            </p>
          </div>
          <SoftButton variant="accent" dark={dark} onClick={() => setModal({ type: "create" })}>
            Add client
          </SoftButton>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-sm">
            <Input
              label="Search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email or company"
              dark={dark}
            />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <SoftButton
                variant="ghost"
                dark={dark}
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs"
              >
                Previous
              </SoftButton>
              <span className={`text-xs ${subtext}`}>
                Page {page} of {totalPages}
              </span>
              <SoftButton
                variant="ghost"
                dark={dark}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs"
              >
                Next
              </SoftButton>
            </div>
          )}
        </div>

        <div className={`mt-6 grid gap-6 ${selectedClient ? "lg:grid-cols-[1fr_340px]" : "lg:grid-cols-1"}`}>
          <ClientList
            clients={clients}
            loading={loading}
            error={error}
            onSelect={(client) => setSelectedClient(client)}
            onEdit={(client) => setModal({ type: "edit", client })}
            onDelete={handleDelete}
            dark={dark}
          />

          {selectedClient && (
            <>
              {/* Desktop/tablet: inline sticky panel */}
              <div className="hidden lg:sticky lg:top-8 lg:block lg:self-start">
                <ClientDetailsCard
                  client={selectedClient}
                  onEdit={() => setModal({ type: "edit", client: selectedClient })}
                  onDelete={() => handleDelete(selectedClient)}
                  onClose={() => setSelectedClient(null)}
                  dark={dark}
                />
              </div>

              {/* Mobile/tablet: full-screen overlay */}
              <div className="fixed inset-0 z-40 flex items-end justify-center lg:hidden sm:items-center">
                <div
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setSelectedClient(null)}
                  aria-hidden="true"
                />
                <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto sm:mx-4">
                  <ClientDetailsCard
                    client={selectedClient}
                    onEdit={() => setModal({ type: "edit", client: selectedClient })}
                    onDelete={() => handleDelete(selectedClient)}
                    onClose={() => setSelectedClient(null)}
                    dark={dark}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {modal.type === "create" && (
        <Modal onClose={() => setModal({ type: "none" })} dark={dark}>
          <ClientForm
            onSubmit={handleCreate}
            onCancel={() => setModal({ type: "none" })}
            submitting={submitting}
            dark={dark}
          />
        </Modal>
      )}

      {modal.type === "edit" && (
        <Modal onClose={() => setModal({ type: "none" })} dark={dark}>
          <ClientForm
            initialValues={modal.client}
            onSubmit={(payload) => handleEdit(modal.client.id, payload)}
            onCancel={() => setModal({ type: "none" })}
            submitting={submitting}
            dark={dark}
          />
        </Modal>
      )}
    </div>
  );
}