import { useState } from "react";
import { authService } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: saveAuth } = useAuth();

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      
      const result = await authService.login(email, pass);
      
      saveAuth({
        user: result.data.user,
        organization: result.data.organization,
        accessToken: result.data.accessToken,
      });

      navigate("/dashboard");
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};