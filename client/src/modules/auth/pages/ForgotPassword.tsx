import React, { useState } from "react";
import { SoftButton } from "../../../shared/components/Button";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { t } from "../../../shared/utils/themeClasses";
import { Input } from "../../../shared/components/Input";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2, User } from "lucide-react";
import { useForgetPassword } from "../hooks/useReset";

/* ── SUCCESS STATE ── */
function SuccessView({ dark, email }: { dark: boolean; email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="text-center py-4"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
        className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-5 mx-auto"
      >
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
      </motion.div>
      <h2 className={`text-xl font-bold mb-2 ${t.text(dark)}`}>
        Check your inbox
      </h2>
      <p className={`text-sm leading-relaxed mb-1 ${t.textSub(dark)}`}>
        We sent a reset link to
      </p>
      <p className="text-sm font-semibold text-emerald-500 mb-5">{email}</p>
      <p
        className={`text-xs leading-relaxed max-w-xs mx-auto ${t.textMuted(dark)}`}
      >
        {"Didn't receive it? Check your spam folder or "}
        <button
          className="text-emerald-500 hover:underline"
          onClick={() => window.location.reload()}
        >
          try again
        </button>
        .
      </p>
      <div className={`mt-6 text-sm ${t.textSub(dark)}`}>
        <Link to="/auth/login" className="text-emerald-500 hover:underline">
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
}

/* ── FORM STEP ── */
function FormStep({
  dark,
  onSuccess,
}: {
  dark: boolean;
  onSuccess: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const { forgotPassword, isLoading } = useForgetPassword();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword(email).then((message) => {
      console.log(message);
      onSuccess(email);
    });
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 mb-3 ${
            dark
              ? "bg-emerald-600/15 ring-emerald-500/20 text-emerald-400"
              : "bg-emerald-50 ring-emerald-200 text-emerald-700"
          }`}
        >
          <User className="h-4 w-4" />
          <span className="text-xs font-medium">Reset</span>
        </div>
        <h1 className={`text-2xl font-bold mb-1 ${t.text(dark)}`}>
          Reset Password
        </h1>
        <p className={`text-sm ${t.textSub(dark)}`}>
          Enter your email to receive a reset link.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          dark={dark}
        />
        <SoftButton type="submit" className="w-full !mt-6" disabled={isLoading}>
          <Mail className="h-4 w-4 mr-2 inline" />
          {isLoading ? "Sending..." : "Send Reset Link"}
        </SoftButton>
      </form>

      <div className={`text-sm mt-5 ${t.textSub(dark)} text-center`}>
        Remembered your password?{" "}
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
export const ForgotPassword: React.FC = () => {
  const { dark } = useTheme();
  const [direction, setDirection] = useState(1);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const handleBack = () => {
    setDirection(-1);
    setSuccessEmail(null);
  };
  const handleSuccess = (email: string) => {
    setDirection(1);
    setSuccessEmail(email);
  };

  const showBack = successEmail !== null;

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${t.bg(dark)} px-4`}
    >
      <div className="w-full max-w-md">
        <AnimatePresence>
          {showBack && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              onClick={handleBack}
              className={`flex items-center gap-1.5 text-xs font-medium mb-3 transition-colors ${
                dark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </motion.button>
          )}
        </AnimatePresence>

        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-full rounded-2xl p-8 shadow-lg ring-1 overflow-hidden ${t.card(dark)}`}
        >
          <AnimatePresence mode="wait" custom={direction}>
            {successEmail ? (
              <motion.div
                key="success"
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <SuccessView dark={dark} email={successEmail} />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <FormStep dark={dark} onSuccess={handleSuccess} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
