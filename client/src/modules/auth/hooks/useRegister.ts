import { useState } from "react";
import { authService } from "../api";
import { useNavigate } from "react-router-dom";
import type { userData } from "../types";
import { useAuth } from "../context/AuthContext";

const SaveAuth = async (result:any) => {
  const { login: saveAuth } = useAuth();

  saveAuth({
    user: result.data.user,
    organization: result.data.organization,
    accessToken: result.data.accessToken,
  });

}


export const useIndividualRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (userData:userData) => {
    setIsLoading(true);
    setError(null);
    try {    
      
      const result = await authService.registerIndividual(userData);
      SaveAuth(result);
      navigate("/dashboard");

    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};



export const useCreateOrg = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
               
  const register = async (userData: userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.createOrg(userData);

      SaveAuth(result);
      navigate("/dashboard");
    
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};



export const useJoinOrg = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (userData: userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.joinOrg(userData);

      SaveAuth(result);
      navigate("/dashboard");
    
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};