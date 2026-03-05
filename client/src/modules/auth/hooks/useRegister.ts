import { useState } from "react";
import { authService } from "../api";
import { useNavigate } from "react-router-dom";
import type { userData } from "../types";

export const useIndividualRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (userData:userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.registerIndividual(userData);
      // Save token to localStorage, redirect user, etc.
      localStorage.setItem("token", data.token);
      console.log("Individual Registration successful, redirecting...");
      return navigate("/dashboard"); // Adjust the path as needed
    
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
      const data = await authService.createOrg(userData);
      // Save token to localStorage, redirect user, etc.
      localStorage.setItem("token", data.token);
      console.log("Organization creation successful, redirecting...");
      return navigate("/dashboard"); // Adjust the path as needed
    
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
      const data = await authService.joinOrg(userData);
      // Save token to localStorage, redirect user, etc.
      localStorage.setItem("token", data.token);
      console.log(`registration with ${data.org} successful, redirecting...`);
      return navigate("/dashboard"); // Adjust the path as needed
    
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};