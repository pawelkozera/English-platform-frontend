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
  selectedGroup: Group | null;
  login: () => void;
  logout: () => void;
  setSelectedGroup: (group: Group | null) => void;
  fetchGroups: () => void;
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

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

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
    if (response.data.length > 0) {
      setSelectedGroup(response.data[0]);
    }
    else {
      setSelectedGroup(null);
    }
  };

  const logout = () => {
    setUser(null);
    setGroups([]);
    localStorage.removeItem("user");
    localStorage.removeItem("groups");
    setSelectedGroup(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedGroups = localStorage.getItem("groups");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedGroups) {
      const groups = JSON.parse(storedGroups);
      setGroups(groups);
      if (groups.length > 0) {
        setSelectedGroup(groups[0]);
      }
      else {
        setSelectedGroup(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, groups, selectedGroup, login, logout, setSelectedGroup, fetchGroups}}>
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
