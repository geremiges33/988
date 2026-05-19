import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/* =========================
   USER TYPE
========================= */

export interface User {
  id: string;

  firstName: string;

  lastName: string;

  username?: string;

  email: string;

  avatar?: string;

  joinedAt: string;

  isAdmin?: boolean;
}

/* =========================
   CONTEXT TYPE
========================= */

interface AuthContextType {
  user: User | null;

  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isAdmin?: boolean
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  logout: () => void;

  updateUser: (
    data: Partial<User> | User
  ) => void;
}

/* =========================
   CONTEXT
========================= */

const AuthContext =
  createContext<AuthContextType>({
    user: null,

    isLoading: true,

    login: async () => ({
      success: false,
      error: "AuthProvider missing",
    }),

    signup: async () => ({
      success: false,
      error: "AuthProvider missing",
    }),

    logout: () => {},

    updateUser: () => {},
  });

/* =========================
   STORAGE KEYS
========================= */

const STORAGE_KEY = "thrift_user";

const USERS_KEY =
  "thrift_registered_users";

/* =========================
   STORED USER TYPE
========================= */

interface StoredUser {
  email: string;

  password: string;

  user: User;
}

/* =========================
   STORAGE HELPERS
========================= */

function getRegisteredUsers(): StoredUser[] {
  try {
    const raw =
      localStorage.getItem(
        USERS_KEY
      );

    return raw
      ? JSON.parse(raw)
      : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(
  users: StoredUser[]
) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}

function addRegisteredUser(
  email: string,
  password: string,
  user: User
) {
  const users =
    getRegisteredUsers();

  users.push({
    email,
    password,
    user,
  });

  saveRegisteredUsers(users);
}

/* =========================
   PROVIDER
========================= */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /* =========================
     RESTORE USER
  ========================= */

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (stored) {
        setUser(
          JSON.parse(stored)
        );
      }
    } catch (err) {
      console.log(
        "Restore user error:",
        err
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =========================
     PERSIST USER
  ========================= */

  const persistUser = (
    userData: User | null
  ) => {
    setUser(userData);

    if (userData) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(userData)
      );
    } else {
      localStorage.removeItem(
        STORAGE_KEY
      );
    }
  };

  /* =========================
     LOGIN
  ========================= */

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);

      await new Promise((r) =>
        setTimeout(r, 700)
      );

      /* ADMIN */

      if (
        email.toLowerCase() ===
          "admin@thrift.com" &&
        password === "admin1234"
      ) {
        const adminUser: User = {
          id: "admin",

          firstName: "Admin",

          lastName: "User",

          username: "admin",

          email:
            "admin@thrift.com",

          joinedAt:
            new Date().toISOString(),

          isAdmin: true,
        };

        persistUser(adminUser);

        return {
          success: true,
        };
      }

      /* USERS */

      const users =
        getRegisteredUsers();

      const matched =
        users.find(
          (u) =>
            u.email.toLowerCase() ===
              email.toLowerCase() &&
            u.password === password
        );

      if (matched) {
        persistUser(
          matched.user
        );

        return {
          success: true,
        };
      }

      /* DEMO */

      if (
        email.toLowerCase() ===
          "demo@thrift.com" &&
        password === "demo1234"
      ) {
        const demoUser: User = {
          id: "demo",

          firstName: "Alex",

          lastName: "Demo",

          username:
            "alex_demo",

          email:
            "demo@thrift.com",

          joinedAt:
            new Date().toISOString(),
        };

        persistUser(demoUser);

        return {
          success: true,
        };
      }

      return {
        success: false,
        error:
          "Invalid email or password",
      };
    } catch (err) {
      console.log(err);

      return {
        success: false,
        error:
          "Something went wrong",
      };
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     SIGNUP
  ========================= */

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isAdmin?: boolean
  ) => {
    try {
      setIsLoading(true);

      await new Promise((r) =>
        setTimeout(r, 900)
      );

      if (
        email.toLowerCase() ===
        "admin@thrift.com"
      ) {
        return {
          success: false,
          error:
            "This email is reserved",
        };
      }

      const users =
        getRegisteredUsers();

      const exists = users.some(
        (u) =>
          u.email.toLowerCase() ===
          email.toLowerCase()
      );

      if (exists) {
        return {
          success: false,
          error:
            "Email already exists",
        };
      }

      /* CREATE USER */

      const newUser: User = {
        id: `user_${Date.now()}`,

        firstName,

        lastName,

        username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,

        email,

        joinedAt:
          new Date().toISOString(),

        isAdmin:
          isAdmin || false,
      };

      /* SAVE */

      addRegisteredUser(
        email,
        password,
        newUser
      );

      /* AUTO LOGIN */

      persistUser(newUser);

      return {
        success: true,
      };
    } catch (err) {
      console.log(err);

      return {
        success: false,
        error:
          "Signup failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    persistUser(null);

    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";
  };

  /* =========================
     UPDATE USER
  ========================= */

  const updateUser = (
    data: Partial<User> | User
  ) => {
    /* NEW USER LOGIN */

    if (!user) {
      const newUser =
        data as User;

      persistUser(newUser);

      return;
    }

    /* UPDATE EXISTING */

    const updatedUser: User = {
      ...user,
      ...data,
    };

    persistUser(updatedUser);

    /* UPDATE STORAGE USERS */

    const users =
      getRegisteredUsers();

    const updatedUsers =
      users.map((u) => {
        if (
          u.user._id ===
          updateduser._id
        ) {
          return {
            ...u,
            user: updatedUser,
          };
        }

        return u;
      });

    saveRegisteredUsers(
      updatedUsers
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        isLoading,

        login,

        signup,

        logout,

        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useAuth() {
  return useContext(AuthContext);
}