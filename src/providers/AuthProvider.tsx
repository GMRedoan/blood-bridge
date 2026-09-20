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
  openVerifyEmail: () => void;
  closeAuth: () => void;
  setAuthStep: (step: AuthStep) => void;

  // Verification
  verificationEmail: string;
  setVerificationEmail: (email: string) => void;
  pendingVerificationEmail: string | null;
  setPendingVerificationEmail: (email: string | null) => void;
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
  const [verificationEmail, setVerificationEmail] = useState("");
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<
    string | null
  >(null);

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

  const openVerifyEmail = () => {
    if (!pendingVerificationEmail) return;

    setVerificationEmail(pendingVerificationEmail);
    setAuthStep("verify-email");
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
        openVerifyEmail,
        closeAuth,
        setAuthStep,
        verificationEmail,
        setVerificationEmail,
        pendingVerificationEmail,
        setPendingVerificationEmail,
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
