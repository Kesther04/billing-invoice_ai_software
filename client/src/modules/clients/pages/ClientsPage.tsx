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

  return (
    <div className={`min-h-screen px-6 py-8 ${dark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
            Clients
          </h1>
          <SoftButton variant="accent" dark={dark} onClick={() => setModal({ type: "create" })}>
            Add client
          </SoftButton>
        </div>

        <div className="mt-6 max-w-sm">
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

        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ClientList
              clients={clients}
              loading={loading}
              error={error}
              onSelect={(client) => setSelectedClient(client)}
              onEdit={(client) => setModal({ type: "edit", client })}
              onDelete={handleDelete}
              dark={dark}
            />

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <SoftButton
                  variant="ghost"
                  dark={dark}
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </SoftButton>
                <span className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  Page {page} of {totalPages}
                </span>
                <SoftButton
                  variant="ghost"
                  dark={dark}
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </SoftButton>
              </div>
            )}
          </div>

          {selectedClient && (
            <ClientDetailsCard
              client={selectedClient}
              onEdit={() => setModal({ type: "edit", client: selectedClient })}
              onDelete={() => handleDelete(selectedClient)}
              onClose={() => setSelectedClient(null)}
              dark={dark}
            />
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