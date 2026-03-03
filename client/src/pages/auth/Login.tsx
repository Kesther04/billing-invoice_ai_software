import React, { useState } from "react";
import { SoftButton } from "../../shared/components/Button";
import { useTheme } from "../../shared/themes/ThemeContext";
import { t } from "../../shared/utils/themeClasses";
import { Input } from "../../shared/components/Input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export const Login: React.FC = () => {
  const { dark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${t.bg(dark)} px-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02 }}
        className={`w-full max-w-md rounded-2xl p-8 shadow-lg ${t.card(dark)}`}
      >
        <h1 className={`text-2xl font-bold mb-4 ${t.text(dark)}`}>
          Welcome Back
        </h1>
        <p className={`text-sm mb-6 ${t.textSub(dark)}`}>
          Login to your account
        </p>

        <form className="space-y-4">
          
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dark={dark}/>  
            
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" dark={dark}/>

          <div className="flex justify-end text-sm">
            <Link to="/auth/forgot-password" className={`${t.textMuted(dark)} hover:underline`}>
              Forgot password?
            </Link>
          </div>

          <SoftButton type="submit" className="w-full">
            Login
          </SoftButton>
        </form>

        <div className={`text-sm mt-4 ${t.textSub(dark)} text-center`}>
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-emerald-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};