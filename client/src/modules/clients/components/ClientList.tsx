import Loader from "../../../shared/components/Loader";
import type { Client } from "../types";

interface ClientListProps {
  clients: Client[];
  loading: boolean;
  error: string | null;
  onSelect: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  dark?: boolean;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ClientList({ clients, loading, error, onSelect, onEdit, onDelete, dark = false }: ClientListProps) {
  if (loading) return <Loader />;

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (clients.length === 0) {
    return (
      <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
        No clients yet.
      </p>
    );
  }

  const cardBg = dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const labelText = dark ? "text-slate-400" : "text-slate-500";
  const valueText = dark ? "text-slate-100" : "text-slate-700";
  const avatarBg = dark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-600";
  const infoBoxBg = dark ? "bg-slate-700/50" : "bg-slate-50";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {clients.map((client) => (
        <div
          key={client.id}
          className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${avatarBg}`}
              >
                {initials(client.name)}
              </div>
              <button
                type="button"
                onClick={() => onSelect(client)}
                className={`text-sm font-semibold hover:underline ${valueText}`}
              >
                {client.name}
              </button>
            </div>
            <button
              type="button"
              className={`h-9 w-9 rounded-full p-0 text-lg leading-none ${dark ? "text-white hover:bg-gray-600" : "hover:bg-gray-100"}`}
              onClick={() => onEdit(client)}
              aria-label="Client options"
            >
              ⋮
            </button>
          </div>

          <div className={`mt-4 rounded-xl p-3 ${infoBoxBg}`}>
            <p className={`text-xs font-medium ${labelText}`}>Company</p>
            <p className={`mt-1 truncate text-sm font-medium ${valueText}`}>
              {client.company ?? "—"}
            </p>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <dt className={labelText}>Email</dt>
              <dd className={`truncate ${valueText}`}>{client.email ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className={labelText}>Phone</dt>
              <dd className={valueText}>{client.phone ?? "—"}</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDelete(client)}
              className={`h-9 w-9 rounded-full p-0 text-red-500  shrink-0 ${dark ? "hover:bg-red-950/50" : "hover:bg-red-100"}`}
              aria-label="Close"
            >
              ×
            </button>

            <button
              type="button"
              onClick={() => onSelect(client)}
              className="flex-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              View details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}