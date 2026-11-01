import { Table } from "../../../shared/components/Table";
import { SoftButton } from "../../../shared/components/Button";
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

  const headCell = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${
    dark ? "text-slate-400" : "text-slate-500"
  }`;
  const bodyCell = `px-4 py-3 text-sm ${dark ? "text-slate-200" : "text-slate-700"}`;
  const rowBorder = dark ? "border-slate-700" : "border-slate-100";

  return (
    <Table dark={dark}>
      <thead className={dark ? "bg-slate-800" : "bg-slate-50"}>
        <tr>
          <th className={headCell}>Name</th>
          <th className={headCell}>Company</th>
          <th className={headCell}>Email</th>
          <th className={headCell}>Phone</th>
          <th className={headCell} aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id} className={`border-t ${rowBorder}`}>
            <td className={bodyCell}>
              <button
                type="button"
                onClick={() => onSelect(client)}
                className={`font-medium hover:underline ${dark ? "text-emerald-400" : "text-emerald-700"}`}
              >
                {client.name}
              </button>
            </td>
            <td className={bodyCell}>{client.company ?? "—"}</td>
            <td className={bodyCell}>{client.email ?? "—"}</td>
            <td className={bodyCell}>{client.phone ?? "—"}</td>
            <td className={`${bodyCell} flex gap-2`}>
              <SoftButton variant="ghost" dark={dark} className="px-3 py-1 text-xs" onClick={() => onEdit(client)}>
                Edit
              </SoftButton>
              <SoftButton
                variant="ghost"
                dark={dark}
                className="px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                onClick={() => onDelete(client)}
              >
                Delete
              </SoftButton>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}