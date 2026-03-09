import React, { useState } from "react";
import { SoftButton } from "../../../shared/components/Button";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { t } from "../../../shared/utils/themeClasses";
import { Input } from "../../../shared/components/Input";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Building2, User, ArrowLeft } from "lucide-react";
import { useCreateOrg, useIndividualRegister, useJoinOrg } from "../hooks/useRegister";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type AccountType = "join" | "create" | "individual" | null;

interface AccountOption {
  id: AccountType;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

/* ══════════════════════════════════════════
   ACCOUNT TYPE OPTIONS
══════════════════════════════════════════ */
const accountOptions: AccountOption[] = [
  {
    id: "join",
    icon: <Users className="h-5 w-5" />,
    title: "Join an Organization",
    description: "Accept an invite and join an existing team or workspace.",
    badge: "Team",
  },
  {
    id: "create",
    icon: <Building2 className="h-5 w-5" />,
    title: "Create an Organization",
    description: "Set up a new workspace and invite your team.",
    badge: "Admin",
  },
  {
    id: "individual",
    icon: <User className="h-5 w-5" />,
    title: "Register as Individual",
    description: "Freelancer or solo operator ( just you and your clients ).",
    badge: "Solo",
  },
];

/* ══════════════════════════════════════════
   CARD VARIANTS
══════════════════════════════════════════ */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

/* ══════════════════════════════════════════
   STEP 1 — TYPE SELECTOR
══════════════════════════════════════════ */
function TypeSelector({
  dark,
  onSelect,
}: {
  dark: boolean;
  onSelect: (type: AccountType) => void;
}) {
  const [hovered, setHovered] = useState<AccountType>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-2 ${t.text(dark)}`}>
          Create Account
        </h1>
        <p className={`text-sm ${t.textSub(dark)}`}>
          Choose how you'd like to get started
        </p>
      </div>

      <div className="space-y-3">
        {accountOptions.map((option, i) => (
          <motion.button
            key={option.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={() => onSelect(option.id)}
            onMouseEnter={() => setHovered(option.id)}
            onMouseLeave={() => setHovered(null)}
            whileTap={{ scale: 0.985 }}
            className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 group
              ${
                hovered === option.id
                  ? dark
                    ? "border-emerald-500/40 bg-emerald-600/10 shadow-lg shadow-emerald-900/20"
                    : "border-emerald-400/60 bg-emerald-50/80 shadow-md shadow-emerald-100"
                  : dark
                    ? "border-white/[0.07] bg-white/[0.03] hover:border-white/10"
                    : "border-slate-200 bg-white hover:border-slate-300"
              }`}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`shrink-0 h-10 w-10 rounded-xl grid place-items-center transition-all duration-200
                  ${
                    hovered === option.id
                      ? "bg-emerald-500 text-white shadow shadow-emerald-500/30"
                      : dark
                        ? "bg-white/[0.06] text-slate-400"
                        : "bg-slate-100 text-slate-500"
                  }`}
              >
                {option.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      hovered === option.id ? "text-emerald-500" : t.text(dark)
                    }`}
                  >
                    {option.title}
                  </span>
                  {option.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 transition-all duration-200
                        ${
                          hovered === option.id
                            ? dark
                              ? "bg-emerald-600/20 text-emerald-400 ring-emerald-500/20"
                              : "bg-emerald-100 text-emerald-700 ring-emerald-200"
                            : dark
                              ? "bg-white/5 text-slate-400 ring-white/10"
                              : "bg-slate-100 text-slate-500 ring-slate-200"
                        }`}
                    >
                      {option.badge}
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 leading-snug ${t.textMuted(dark)}`}
                >
                  {option.description}
                </p>
              </div>

              {/* Arrow */}
              <div
                className={`shrink-0 h-6 w-6 rounded-full grid place-items-center transition-all duration-200
                  ${
                    hovered === option.id
                      ? "bg-emerald-500 text-white"
                      : dark
                        ? "bg-white/5 text-slate-500"
                        : "bg-slate-100 text-slate-400"
                  }`}
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className={`text-sm mt-6 ${t.textSub(dark)} text-center`}>
        Already have an account?{" "}
        <Link to="/auth/login" className="text-emerald-500 hover:underline">
          Login
        </Link>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   STEP 2A — JOIN ORG FORM
══════════════════════════════════════════ */
function JoinOrgForm({ dark }: { dark: boolean }) {
  const [form, setForm] = useState({name:"", email: "", password: "", inviteCode: "" });
  const { name, email, password, inviteCode } = form;
  const {register, isLoading, error } = useJoinOrg();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form);
  };
  
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* error */}
      <p className={`text-sm ${t.textDanger(dark)}`}>
        {error || ""}
      </p>
      <Input
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setForm({...form, name:e.target.value})}
        placeholder="John Doe"
        dark={dark}
      />
      <Input
        label="Work Email"
        type="email"
        value={email}
        onChange={(e) => setForm({...form, email:e.target.value})}
        placeholder="you@company.com"
        dark={dark}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setForm({...form, password:e.target.value})}
        placeholder="••••••••"
        dark={dark}
      />
      <div>
        <Input
          label="Invite Code"
          type="text"
          value={inviteCode}
          onChange={(e) => setForm({...form, inviteCode:e.target.value})}
          placeholder="e.g. ORG-A1B2C3"
          dark={dark}
        />
        <p className={`text-xs mt-1.5 ${t.textMuted(dark)}`}>
          Get this from your organization admin.
        </p>
      </div>
      <SoftButton type="submit" className="w-full !mt-6">
        <Users className="h-4 w-4 mr-2 inline" />
        {isLoading ? "Joining Organization..." : "Join Organization"}
      </SoftButton>
    </form>
  );
}

/* ══════════════════════════════════════════
   STEP 2B — CREATE ORG FORM
══════════════════════════════════════════ */
function CreateOrgForm({ dark }: { dark: boolean }) {
  const [form, setForm] = useState({name:"", email: "", password: "", orgName: "" });
  const { name, email, password, orgName } = form;
  const {register, isLoading, error } = useCreateOrg();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* error */}
      <p className={`text-sm ${t.textDanger(dark)}`}>
        {error || ""}
      </p>
      <Input
        label="Your Full Name"
        type="text"
        value={name}
        onChange={(e) => setForm({...form, name:e.target.value})}
        placeholder="Jane Smith"
        dark={dark}
      />
      <Input
        label="Work Email"
        type="email"
        value={email}
        onChange={(e) => setForm({...form, email:e.target.value})}
        placeholder="jane@yourcompany.com"
        dark={dark}
      />
      <Input
        label="Organization Name"
        type="text"
        value={orgName}
        onChange={(e) => setForm({...form, orgName:e.target.value})}
        placeholder="Acme Studio"
        dark={dark}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setForm({...form, password:e.target.value})}
        placeholder="••••••••"
        dark={dark}
      />
      <SoftButton type="submit" className="w-full !mt-6">
        <Building2 className="h-4 w-4 mr-2 inline" />
        {isLoading ? "Creating Organization..." : "Create Organization"}
      </SoftButton>
    </form>
  );
}

/* ══════════════════════════════════════════
   STEP 2C — INDIVIDUAL FORM
══════════════════════════════════════════ */
function IndividualForm({ dark }: { dark: boolean }) {
  const [form, setForm] = useState({name:"", email: "", password: "" });
  const { name, email, password } = form;
  const {register, isLoading, error } = useIndividualRegister();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form);
  };
 

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* error */}
      <p className={`text-sm ${t.textDanger(dark)}`}>
        {error || ""}
      </p>

      <Input
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setForm({...form, name:e.target.value})}
        placeholder="Alex Carter"
        dark={dark}
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setForm({...form, email:e.target.value})}
        placeholder="you@example.com"
        dark={dark}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setForm({...form, password:e.target.value})}
        placeholder="••••••••"
        dark={dark}
      />
      <SoftButton type="submit" className="w-full !mt-6">
        <User className="h-4 w-4 mr-2 inline" />
        {isLoading ? "Creating Account..." : "Create Account"}
      </SoftButton>
    </form>
  );
}

/* ══════════════════════════════════════════
   STEP 2 WRAPPER — FORM STEP
══════════════════════════════════════════ */
const formMeta: Record<
  Exclude<AccountType, null>,
  { title: string; subtitle: string; icon: React.ReactNode }
> = {
  join: {
    title: "Join an Organization",
    subtitle: "Enter your details and invite code to get started.",
    icon: <Users className="h-4 w-4" />,
  },
  create: {
    title: "Create an Organization",
    subtitle: "Set up your workspace and you'll be the admin.",
    icon: <Building2 className="h-4 w-4" />,
  },
  individual: {
    title: "Individual Account",
    subtitle: "Just you in full control and your clients",
    icon: <User className="h-4 w-4" />,
  },
};

function FormStep({
  dark,
  type,
}: {
  dark: boolean;
  type: Exclude<AccountType, null>;
}) {
  const meta = formMeta[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-6 ">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 mb-3
          ${dark ? "bg-emerald-600/15 ring-emerald-500/20 text-emerald-400" : "bg-emerald-50 ring-emerald-200 text-emerald-700"}`}
        >
          {meta.icon}
          <span className="text-xs font-medium">{meta.title}</span>
        </div>
        <h1 className={`text-2xl font-bold mb-1 ${t.text(dark)}`}>
          {meta.title}
        </h1>
        <p className={`text-sm ${t.textSub(dark)}`}>{meta.subtitle}</p>
      </div>

      {type === "join" && <JoinOrgForm dark={dark} />}
      {type === "create" && <CreateOrgForm dark={dark} />}
      {type === "individual" && <IndividualForm dark={dark} />}

      <div className={`text-sm mt-5 ${t.textSub(dark)} text-center`}>
        Already have an account?{" "}
        <Link to="/auth/login" className="text-emerald-500 hover:underline">
          Login
        </Link>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
export const SignUp: React.FC = () => {
  const { dark } = useTheme();
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [direction, setDirection] = useState(1);

  const handleSelect = (type: AccountType) => {
    setDirection(1);
    setAccountType(type);
  };

  const handleBack = () => {
    setDirection(-1);
    setAccountType(null);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${t.bg(dark)} px-4`}
    >
      <div className="w-full max-w-md">
        {/* Back button */}
        <AnimatePresence>
          {accountType && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              onClick={handleBack}
              className={`flex items-center gap-1.5 text-xs font-medium mb-3 transition-colors
                ${dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </motion.button>
          )}
        </AnimatePresence>

        {/* Card */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-full rounded-2xl p-8 shadow-lg ring-1 overflow-hidden ${t.card(dark)}`}
        >
          <AnimatePresence mode="wait" custom={direction}>
            {accountType === null ? (
              <motion.div
                key="selector"
                custom={direction}
                // variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <TypeSelector dark={dark} onSelect={handleSelect} />
              </motion.div>
            ) : (
              <motion.div
                key={accountType}
                custom={direction}
                // variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <FormStep dark={dark} type={accountType} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
