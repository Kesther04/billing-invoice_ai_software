import { useState } from "react";
import { authService } from "../api";
// import { useNavigate } from "react-router-dom";

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

  const getProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.getProfile();
      return result.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  return { getProfile, isLoading, error };
};

