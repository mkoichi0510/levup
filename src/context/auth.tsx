import React, { createContext, useContext, useEffect, useState } from "react";
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
    SecureStore.getItemAsync(JWT_KEY)
      .then((stored) => setToken(stored))
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(newToken: string) {
    await SecureStore.setItemAsync(JWT_KEY, newToken);
    setToken(newToken);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(JWT_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
