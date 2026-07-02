import { useState } from "react";
import { authService } from "../api";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.logout();
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Logout failed");
        } finally {
            setIsLoading(false);
        }
    };

    return { logout, isLoading, error };
};