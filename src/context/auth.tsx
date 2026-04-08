import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { JWT_KEY } from "../constants/auth";

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    SecureStore.getItemAsync(JWT_KEY)
      .then((stored) => {
        if (isMounted) setToken(stored);
      })
      .catch((e) => {
        console.error("[auth] SecureStore read failed:", e);
        if (isMounted) setToken(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (newToken: string) => {
    await SecureStore.setItemAsync(JWT_KEY, newToken);
    setToken(newToken);
  }, []);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(JWT_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ token, isLoading, signIn, signOut }),
    [token, isLoading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
