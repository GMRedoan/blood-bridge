"use client";

import { getUser } from "@/server/user/user.service";
import { IUserProfile } from "@/types/auth/auth";
import { createContext, useContext, useState } from "react";

export type AuthStep =
  | "login"
  | "register"
  | "verify-email"
  | "success";

interface AuthContextType {
  user: IUserProfile | null;
  setUser: (user: IUserProfile | null) => void;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;

  authOpen: boolean;
  authStep: AuthStep;

  openLogin: () => void;
  openRegister: () => void;
  closeAuth: () => void;
  setAuthStep: (step: AuthStep) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: IUserProfile | null;
}) {
  const [user, setUser] = useState<IUserProfile | null>(initialUser);
  const [authOpen, setAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const isLoggedIn = !!user;

  const refreshUser = async () => {
    const res = await getUser();

    if (res.success) {
      setUser(res.data);
    } else {
      setUser(null);
    }
  };

  const openLogin = () => {
    setAuthStep("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthStep("register");
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        // User
        user,
        setUser,
        isLoggedIn,
        refreshUser,

        // Auth dialog
        authOpen,
        authStep,
        openLogin,
        openRegister,
        closeAuth,
        setAuthStep,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
