import { useState } from "react";
import { SoftButton } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import type { Client, CreateClientPayload, UpdateClientPayload } from "../types";

interface ClientFormProps {
  initialValues?: Client;
  onSubmit: (payload: CreateClientPayload | UpdateClientPayload) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
  dark?: boolean;
}

export function ClientForm({ initialValues, onSubmit, onCancel, submitting, dark = false }: ClientFormProps) {
  const [name, setName]       = useState(initialValues?.name ?? "");
  const [email, setEmail]     = useState(initialValues?.email ?? "");
  const [phone, setPhone]     = useState(initialValues?.phone ?? "");
  const [company, setCompany] = useState(initialValues?.company ?? "");
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const isEdit = Boolean(initialValues);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }

    try {
      await onSubmit({
        name:    name.trim(),
        email:   email.trim()   || undefined,
        phone:   phone.trim()   || undefined,
        company: company.trim() || undefined,
        address: address.trim() || undefined,
      });
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className={`text-lg font-semibold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>
        {isEdit ? "Edit client" : "Add client"}
      </h3>

      {formError && (
        <p className="mb-4 text-sm text-red-500">{formError}</p>
      )}

      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Doe"
        dark={dark}
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="jane@company.com"
        dark={dark}
      />

      <Input
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+234..."
        dark={dark}
      />

      <Input
        label="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company name"
        dark={dark}
      />

      <Input
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Street, city, country"
        dark={dark}
      />

      <div className="mt-6 flex justify-end gap-3">
        <SoftButton type="button" variant="ghost" dark={dark} onClick={onCancel}>
          Cancel
        </SoftButton>
        <SoftButton type="submit" variant="primary" dark={dark} disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Add client"}
        </SoftButton>
      </div>
    </form>
  );
}