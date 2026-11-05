import { SoftButton } from "../../../shared/components/Button";
import { formatDate } from "../../../shared/utils/formatDate";
import type { Client } from "../types";

interface ClientDetailsCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
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

export function ClientDetailsCard({ client, onEdit, onDelete, onClose, dark = false }: ClientDetailsCardProps) {
  const label = `text-xs font-medium uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`;
  const value = `mt-1 text-sm break-words ${dark ? "text-slate-200" : "text-slate-800"}`;
  const avatarBg = dark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-600";

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ring-1 ${
        dark ? "bg-slate-900 ring-slate-700" : "bg-white ring-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarBg}`}
          >
            {initials(client.name)}
          </div>
          <h3 className={`truncate text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
            {client.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 ${dark ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"}`}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <dt className={label}>Company</dt>
          <dd className={value}>{client.company ?? "—"}</dd>
        </div>
        <div className="min-w-0">
          <dt className={label}>Email</dt>
          <dd className={value}>{client.email ?? "—"}</dd>
        </div>
        <div className="min-w-0">
          <dt className={label}>Phone</dt>
          <dd className={value}>{client.phone ?? "—"}</dd>
        </div>
        <div className="min-w-0">
          <dt className={label}>Added</dt>
          <dd className={value}>{formatDate(client.createdAt)}</dd>
        </div>
        <div className="col-span-2 min-w-0">
          <dt className={label}>Address</dt>
          <dd className={value}>{client.address ?? "—"}</dd>
        </div>
      </dl>

      <div className="mt-5 flex justify-end gap-3">
        <SoftButton variant="ghost" dark={dark} onClick={onEdit}>
          Edit
        </SoftButton>
        <SoftButton variant="ghost" dark={dark} className="text-red-500 hover:bg-red-50" onClick={onDelete}>
          Delete
        </SoftButton>
      </div>
    </div>
  );
}