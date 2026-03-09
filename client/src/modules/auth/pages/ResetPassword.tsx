import React, { useState } from "react";
import { SoftButton } from "../../../shared/components/Button";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { t } from "../../../shared/utils/themeClasses";
import { Input } from "../../../shared/components/Input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useResetPassword } from "../hooks/useReset";

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
export const ResetPassword: React.FC = () => {
  const { dark } = useTheme();
  const { resetPassword, isLoading, error } = useResetPassword();
  const [form,setForm] = useState({ token: "", newPassword: "" });
  const { token, newPassword } = form;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(token, newPassword);
  };
  
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${t.bg(dark)} px-4`}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-full rounded-2xl p-8 shadow-lg ring-1 overflow-hidden ${t.card(dark)}`}
        >
          <motion.div initial="enter" animate="center" exit="exit">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
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
                    Enter your token and new password to reset your account.
                    </p>
                </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <>
                    {/* Error message */}
                    {error && (
                      <p className={`text-sm ${t.textDanger(dark)}`}>
                        {error}
                      </p>
                    )}
                  <Input
                    label="Token"
                    type="text"
                    value={token}
                    onChange={(e) => setForm({...form, token: e.target.value})}
                    placeholder="Enter your token"
                    dark={dark}
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setForm({...form, newPassword: e.target.value})}
                    placeholder="••••••••"
                    dark={dark}
                  />
                  
                </>

                <SoftButton type="submit" className="w-full !mt-6">
                  <User className="h-4 w-4 mr-2 inline" />
                  {isLoading ? "Resetting password..." : "Reset Password"}
                </SoftButton>
              </form>

              <div className={`text-sm mt-5 ${t.textSub(dark)} text-center`}>
                Remembered your Password?{" "}
                <Link
                  to="/auth/login"
                  className="text-emerald-500 hover:underline"
                >
                  Login
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
