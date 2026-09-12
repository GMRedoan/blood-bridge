"use client";

import { getUser } from "@/server/user/user.service";
import { IUserProfile } from "@/types/auth/auth";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: IUserProfile | null;
  setUser: (user: IUserProfile | null) => void;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
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

  const isLoggedIn = !!user;
  const refreshUser = async () => {
    const res = await getUser();
    if (res.success) {
      setUser(res?.data);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, refreshUser }}>
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
