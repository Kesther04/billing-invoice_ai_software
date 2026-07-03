// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Users } from "lucide-react";
// import { nanoid } from "nanoid";
// import { useTheme } from "../../../shared/themes/ThemeContext";
// import { clientService } from "../api";
// import type { Client, ClientFormData } from "../types";
// import ClientList from "../components/ClientList";
// import ClientForm from "../components/ClientForm";
// import ClientDetailsCard from "../components/ClientDetailsCard";
// import { t } from "../../../shared/utils/themeClasses";

// // ── Mock clients ─────────────────────────────────────────────────────────────
// const MOCK_CLIENTS: Client[] = [
//   { id: "c1", name: "TechStartup Inc",  email: "billing@techstartup.io",  company: "TechStartup Inc",  phone: "+1 415 555 0101", address: "500 Howard St, SF, CA", currency: "USD", totalBilled: 36000, totalPaid: 24000, invoiceCount: 8,  createdAt: "2024-01-15", tags: ["saas", "retainer"], notes: "Main point of contact is Jamie. Net-30 terms." },
//   { id: "c2", name: "Acme Corp",         email: "finance@acmecorp.com",    company: "Acme Corp",         phone: "+1 212 555 0102", address: "350 5th Ave, NY, NY",   currency: "USD", totalBilled: 22400, totalPaid: 19200, invoiceCount: 12, createdAt: "2024-02-01", tags: ["enterprise"], notes: "Pays within 3 days consistently." },
//   { id: "c3", name: "Bright Agency",     email: "hello@brightagency.co",   company: "Bright Agency",     phone: "+44 20 7946 0103", address: "14 Soho Sq, London", currency: "GBP", totalBilled: 14800, totalPaid: 14800, invoiceCount: 6,  createdAt: "2024-03-10", tags: ["agency", "vip"] },
//   { id: "c4", name: "Sarah Johnson",     email: "sarah.j@email.com",       phone: "+1 310 555 0104",     address: "Los Angeles, CA", currency: "USD", totalBilled: 7650,  totalPaid: 6800,  invoiceCount: 9,  createdAt: "2024-04-05" },
//   { id: "c5", name: "Marcus Lee",        email: "marcus@marcuslee.dev",    company: "Lee Studio",        phone: "+1 650 555 0105", address: "Palo Alto, CA",        currency: "USD", totalBilled: 3470,  totalPaid: 3020,  invoiceCount: 5,  createdAt: "2024-05-20", notes: "Freelance designer, project-based work." },
// ];

// export default function ClientsPage() {
//   const { dark } = useTheme();
//   const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
//   const [selected, setSelected] = useState<Client | null>(MOCK_CLIENTS[0]);
//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState<Client | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     clientService.listClients().then(setClients).catch(() => {});
//   }, []);

//   const handleSave = async (data: ClientFormData) => {
//     setIsSaving(true);
//     try {
//       if (editing) {
//         const updated = await clientService.updateClient(editing.id, data).catch(() => ({ ...editing, ...data }));
//         setClients((cs) => cs.map((c) => c.id === editing.id ? updated : c));
//         setSelected(updated);
//       } else {
//         const created = await clientService.createClient(data).catch(() => ({
//           ...data,
//           id: nanoid(),
//           totalBilled: 0,
//           totalPaid: 0,
//           invoiceCount: 0,
//           createdAt: new Date().toISOString(),
//         } as Client));
//         setClients((cs) => [created, ...cs]);
//         setSelected(created);
//       }
//       setShowForm(false);
//       setEditing(null);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try { await clientService.deleteClient(id); } catch {}
//     setClients((cs) => cs.filter((c) => c.id !== id));
//     if (selected?.id === id) setSelected(clients.find((c) => c.id !== id) ?? null);
//   };

//   const handleEdit = (client: Client) => {
//     setEditing(client);
//     setShowForm(true);
//   };

//   const handleAdd = () => {
//     setEditing(null);
//     setShowForm(true);
//   };

//   return (
//     <div className={`min-h-screen transition-colors ${t.bg(dark)}`}>
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Header */}
//         <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
//           <div className="p-2 rounded-xl bg-gradient-to-b from-sky-500 to-indigo-600 shadow-lg shadow-indigo-600/25">
//             <Users className="h-5 w-5 text-white" />
//           </div>
//           <div>
//             <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>Clients</h1>
//             <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>{clients.length} clients · manage relationships & billing</p>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
//           {/* Left: list */}
//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="md:col-span-3"
//           >
//             <ClientList
//               dark={dark}
//               clients={clients}
//               onAdd={handleAdd}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               onSelect={(c) => { setSelected(c); setShowForm(false); }}
//               selectedId={selected?.id}
//             />
//           </motion.div>

//           {/* Right: form or details */}
//           <motion.div
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.15 }}
//             className="md:col-span-2"
//           >
//             <AnimatePresence mode="wait">
//               {showForm ? (
//                 <motion.div key="form" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
//                   <ClientForm
//                     dark={dark}
//                     initial={editing ?? undefined}
//                     onSave={handleSave}
//                     onCancel={() => { setShowForm(false); setEditing(null); }}
//                     isSaving={isSaving}
//                   />
//                 </motion.div>
//               ) : selected ? (
//                 <motion.div key={selected.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
//                   <ClientDetailsCard dark={dark} client={selected} onEdit={handleEdit} />
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="empty"
//                   className={`rounded-2xl border p-12 text-center ${dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200"}`}
//                 >
//                   <Users className={`h-10 w-10 mx-auto mb-3 ${dark ? "text-slate-700" : "text-slate-200"}`} />
//                   <p className={`text-sm ${dark ? "text-slate-600" : "text-slate-400"}`}>Select a client to view details</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { motion } from "framer-motion";
import { Users, Clock3, Sparkles } from "lucide-react";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { t } from "../../../shared/utils/themeClasses";
// import { useAuth } from "../../auth/context/AuthContext";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export default function ClientsPage() {
  const { dark } = useTheme();
  // const { loading, accessToken } = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   // Wait until AuthProvider finishes restoring the session
  //   if (loading) return;

  //   // User is not authenticated
  //   if (!accessToken) {
  //     navigate("/login");
  //   }

  // }, [loading, accessToken]);
  


  return (
    <div
      className={`min-h-screen transition-colors flex items-center justify-center ${t.bg(
        dark
      )}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`w-full max-w-xl rounded-3xl border p-10 text-center shadow-xl ${
          dark
            ? "bg-[#0f1117] border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 180,
          }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-indigo-500/30"
        >
          <Users className="h-10 w-10 text-white" />
        </motion.div>

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
            dark
              ? "bg-slate-800 text-slate-300"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          <Clock3 className="h-4 w-4" />
          Coming Soon
        </div>

        {/* Title */}
        <h1
          className={`mt-6 text-4xl font-bold tracking-tight ${
            dark ? "text-white" : "text-slate-900"
          }`}
        >
          Client Management
        </h1>

        {/* Description */}
        <p
          className={`mt-4 leading-7 ${
            dark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          We're building a powerful client management experience to help you
          organize customer information, monitor billing relationships, and
          collaborate more efficiently.
        </p>

        {/* Features */}
        <div
          className={`mt-8 rounded-2xl border p-6 text-left ${
            dark
              ? "border-slate-800 bg-slate-900/40"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span>Planned Features</span>
          </div>

          <ul
            className={`space-y-3 text-sm ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <li>✓ Create and manage clients</li>
            <li>✓ Client payment history</li>
            <li>✓ Invoice assignment</li>
            <li>✓ Contact information & notes</li>
            <li>✓ Client analytics dashboard</li>
            <li>✓ Search and filtering</li>
          </ul>
        </div>

        {/* Footer */}
        <p
          className={`mt-8 text-sm ${
            dark ? "text-slate-500" : "text-slate-500"
          }`}
        >
          This module is currently under development and will be available in a
          future update.
        </p>
      </motion.div>
    </div>
  );
}