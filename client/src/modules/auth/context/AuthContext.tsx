// src/context/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { authService } from "../api";
import { setAccessToken as saveToken } from "../../../shared/constants/tokenStore";
// import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  type: "INDIVIDUAL" | "ORGANIZATION";
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (data: {
    user: User;
    organization: Organization;
    accessToken: string;
  }) => void;

  logout: () => Promise<void>;

  refresh: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  // Access token lives ONLY in memory
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  /**
   * Called immediately after login.
   */
  const login = (data: {
    user: User;
    organization: Organization;
    accessToken: string;
  }) => {
    setUser(data.user);
    setOrganization(data.organization);
    saveToken(data.accessToken);
    setAccessToken(data.accessToken);
  };

  /**
   * Uses the refresh cookie to obtain a new access token.
   */
  const refresh = async (): Promise<boolean> => {
    try {
      const res = await authService.refresh();

      saveToken(res.data.accessToken);
      
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      setOrganization(res.data.organization);

      return true;
    } catch {
      setAccessToken(null);
      setUser(null);
      setOrganization(null);

      return false;
    }
  };

  /**
   * Logout.
   */
  const logout = async () => {
    try {
      await authService.logout();
      // navigate("/")
    } catch {
      // ignore
    }

    setAccessToken(null);
    saveToken(null);
    setUser(null);
    setOrganization(null);
  };

  /**
   * Restore authentication after page refresh.
   *
   * Since the access token is stored only in memory,
   * re-fetch a new one from the refresh cookie.
   */
  // useEffect(() => {
  //   const initialize = async () => {
  //     await refresh();
  //     setLoading(false);
  //   };

  //   initialize();
  // }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const result = await authService.refresh();
        saveToken(result.data.accessToken);

        setUser(result.data.user);
        setOrganization(result.data.organization);
        setAccessToken(result.data.accessToken);
      } catch {
        setUser(null);
        setOrganization(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        accessToken,
        loading,
        isAuthenticated: !!accessToken,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}