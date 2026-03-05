import { useState } from "react";
import { authService } from "../api";
import { useNavigate } from "react-router-dom";

export const useForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.forgotPassword(email);
      // Save token to localStorage, redirect user, etc.
      console.log("Password reset email sent, redirecting...");
      return data.message; // Return the success message instead of navigating
    
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return { forgotPassword, isLoading, error };
};

export const useResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.resetPassword(token, newPassword);
      
      console.log(`${data.message}, redirecting to login...`);
      return navigate("/auth/login"); // Redirect to login after successful password reset
    
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, error };
}