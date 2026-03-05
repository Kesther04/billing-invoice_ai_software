import { useState } from "react";
import { authService } from "../api";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, pass);
      // Save token to localStorage, redirect user, etc.
      localStorage.setItem("token", data.token);
      console.log("Login successful, redirecting...");
      return navigate("/dashboard"); // Adjust the path as needed
    
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};