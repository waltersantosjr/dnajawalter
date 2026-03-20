import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "coletor" | "triagem";

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  verify2FA: (code: string) => boolean;
  setRole: (role: UserRole) => void;
  logout: () => void;
  pending2FA: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const ROLE_NAMES: Record<UserRole, string> = {
  admin: "Administrador",
  coletor: "Coletor",
  triagem: "Triagem/Recepção",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("genid_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [pending2FA, setPending2FA] = useState(false);
  const [tempEmail, setTempEmail] = useState("");

  const login = (email: string, _password: string) => {
    setTempEmail(email);
    setPending2FA(true);
    return true;
  };

  const verify2FA = (_code: string) => {
    const newUser: User = {
      name: "Waltinho",
      email: tempEmail,
      role: "admin",
    };
    setUser(newUser);
    setPending2FA(false);
    localStorage.setItem("genid_user", JSON.stringify(newUser));
    return true;
  };

  const setRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role, name: ROLE_NAMES[role] };
      setUser(updated);
      localStorage.setItem("genid_user", JSON.stringify(updated));
    }
  };

  const logout = () => {
    setUser(null);
    setPending2FA(false);
    localStorage.removeItem("genid_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, verify2FA, setRole, logout, pending2FA }}
    >
      {children}
    </AuthContext.Provider>
  );
};
