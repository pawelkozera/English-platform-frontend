import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "@/interceptor/axios-interceptor";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Group {
  id: number;
  groupName: string;
}

interface UserContextType {
  user: User | null;
  groups: Group[];
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [groups, setGroups] = useState<Group[]>(() => {
    const storedGroups = localStorage.getItem("groups");
    return storedGroups ? JSON.parse(storedGroups) : [];
  });

  const login = async () => {
    try {
      const response = await apiClient.get('/api/v1/user/profile');
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));

      fetchGroups();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const fetchGroups = async () => {
    const response = await apiClient.get('/api/v1/user/allGroups');
    setGroups(response.data);
    localStorage.setItem("groups", JSON.stringify(response.data));
  };

  const logout = () => {
    setUser(null);
    setGroups([]);
    localStorage.removeItem("user");
    localStorage.removeItem("groups");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedGroups = localStorage.getItem("groups");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, groups, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
