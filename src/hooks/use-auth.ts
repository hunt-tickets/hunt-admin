import { useState, useEffect, createContext, useContext } from "react";
import { signOut, useSession } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContext {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthValidation() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateSession = async () => {
    // Use mock user if development auth mode is enabled
    if (process.env.NEXT_PUBLIC_AUTH_DEV_MODE === "true") {
      const mockUser = {
        id: "dev-user",
        email: "dev@hunt-tickets.com",
        name: "Developer User",
      };
      setUser(mockUser);
      setIsLoading(false);
      return mockUser;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/validate", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
          return data.user;
        }
      }

      setUser(null);
      return null;
    } catch (error) {
      console.error("Session validation failed:", error);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  useEffect(() => {
    validateSession();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refetchUser: validateSession,
  };
}

export { AuthContext };

