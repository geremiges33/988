import { createContext, useContext, useState, useEffect, ReactNode, use } from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (firstName: string, lastName: string, email: string, password: string, isAdmin?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => ({ success: false, error: "AuthProvider not mounted" }),
  signup: async () => ({ success: false, error: "AuthProvider not mounted" }),
  logout: () => {},
  updateUser: () => {},
});

const STORAGE_KEY = "thrift_user";

/* Fake registered users store (in-memory + localStorage simulation) */
const FAKE_USERS_KEY = "thrift_registered_users";

function getRegisteredUsers(): { email: string; password: string; user: User }[] {
  try {
    return JSON.parse(localStorage.getItem(FAKE_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRegisteredUser(email: string, password: string, user: User) {
  const users = getRegisteredUsers();
  users.push({ email, password, user });
  localStorage.setItem(FAKE_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* rehydrate from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 900)); // simulate network

    /* ── hardcoded admin account ── */
    if (email.toLowerCase() === "admin@thrift.com" && password === "admin1234") {
      const admin: User = {
        id: "admin",
        firstName: "Admin",
        lastName: "User",
        email: "admin@thrift.com",
        joinedAt: new Date().toISOString(),
        isAdmin: true,
      };
      persist(admin);
      return { success: true };
    }

    const users = getRegisteredUsers();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (match) {
      persist(match.user);
      return { success: true };
    }

    /* demo account always works */
    if (email.toLowerCase() === "demo@thrift.com" && password === "demo1234") {
      const demo: User = {
        id: "demo",
        firstName: "Alex",
        lastName: "Demo",
        email: "demo@thrift.com",
        joinedAt: new Date().toISOString(),
      };
      persist(demo);
      return { success: true };
    }

    return { success: false, error: "Invalid email or password." };
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isAdmin?: boolean,
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 1000));

    if (email.toLowerCase() === "admin@thrift.com") {
      return { success: false, error: "This email is reserved." };
    }

    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      email,
      joinedAt: new Date().toISOString(),
      isAdmin: isAdmin || false,
    };

    saveRegisteredUser(email, password, newUser);
    persist(newUser);
    return { success: true };
  };
  const logout = () => {persist(null);localStorage.removeItem("data"); window.location.href = "/login";};

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    persist(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}