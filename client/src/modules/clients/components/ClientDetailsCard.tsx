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

export function ClientDetailsCard({ client, onEdit, onDelete, onClose, dark = false }: ClientDetailsCardProps) {
  const label = `text-xs font-medium uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`;
  const value = `mt-1 text-sm ${dark ? "text-slate-200" : "text-slate-800"}`;

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ring-1 ${
        dark ? "bg-slate-900 ring-slate-700" : "bg-white ring-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <h3 className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
          {client.name}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className={dark ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className={label}>Company</dt>
          <dd className={value}>{client.company ?? "—"}</dd>
        </div>
        <div>
          <dt className={label}>Email</dt>
          <dd className={value}>{client.email ?? "—"}</dd>
        </div>
        <div>
          <dt className={label}>Phone</dt>
          <dd className={value}>{client.phone ?? "—"}</dd>
        </div>
        <div>
          <dt className={label}>Added</dt>
          <dd className={value}>{formatDate(client.createdAt)}</dd>
        </div>
        <div className="col-span-2">
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