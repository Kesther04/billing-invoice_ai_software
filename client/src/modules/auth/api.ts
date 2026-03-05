import { apiClient } from "../../shared/api/client"; // Path to your axios client

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },
  
  registerIndividual: async (userData: any) => {
    const response = await apiClient.post("/auth/register/individual", userData);
    return response.data;
  },

  createOrg: async (userData: any) => {
    const response = await apiClient.post("/auth/register/create-org", userData);
    return response.data;
  },

  joinOrg: async (userData: any) => {
    const response = await apiClient.post("/auth/register/join-org", userData);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  }
};