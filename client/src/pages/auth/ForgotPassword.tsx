import React, { useState } from "react";
import { SoftButton } from "../../shared/components/Button";
import { useTheme } from "../../shared/themes/ThemeContext";
import { t } from "../../shared/utils/themeClasses";
import { Input } from "../../shared/components/Input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ForgotPassword: React.FC = () => {
  const { dark } = useTheme();
  const [email, setEmail] = useState("");

  return (
    <div className={`min-h-screen flex items-center justify-center ${t.bg(dark)} px-4`}>
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.02 }}
        className={`w-full max-w-md rounded-2xl p-8 shadow-lg ${t.card(dark)}`}>
        <h1 className={`text-2xl font-bold mb-4 ${t.text(dark)}`}>Forgot Password</h1>
        <p className={`text-sm mb-6 ${t.textSub(dark)}`}>
          Enter your email to reset your password
        </p>

        <form className="space-y-4">
          
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dark={dark}/>

          <SoftButton type="submit" className="w-full">
            Reset Password
          </SoftButton>
        </form>

        <div className={`text-sm mt-4 ${t.textSub(dark)} text-center`}>
          Remembered your password?{" "}
          <Link to="/auth/login" className="text-emerald-500 hover:underline">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};