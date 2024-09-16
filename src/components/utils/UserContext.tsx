import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "react-query";
import { fetchGroups } from "@/lib/api/groupApi";
import { fetchProfile } from "@/lib/api/userApi";

import { User, Group } from "@/lib/types";

interface UserContextType {
  user: User | null;
  groups: Group[];
  selectedGroup: Group | null;
  login: () => void;
  logout: () => void;
  setSelectedGroup: (group: Group | null) => void;
  refetchGroups: () => void;
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
      const data = await fetchProfile();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      refetchGroups();
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    setUser(null);
    setGroups([]);
    localStorage.removeItem("user");
    localStorage.removeItem("groups");
    setSelectedGroup(null);
  };

  const { refetch: refetchGroups } = useQuery('groups', fetchGroups, {
    enabled: false,
    cacheTime: 1,
    staleTime: 0,
    onSuccess: (data) => {
      setGroups(data);
      localStorage.setItem("groups", JSON.stringify(data));
      if (data.length > 0) {
        setSelectedGroup(data[0]);
      } else {
        setSelectedGroup(null);
      }
    },
    onError: () => {
      localStorage.removeItem("groups");
      setGroups([]);
      setSelectedGroup(null);
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      refetchGroups();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, groups, selectedGroup, login, logout, setSelectedGroup, refetchGroups}}>
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
