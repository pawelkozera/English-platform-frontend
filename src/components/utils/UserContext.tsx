import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "react-query";
import { fetchGroups } from "@/lib/api/groupApi";
import { fetchProfile } from "@/lib/api/userApi";
import { fetchRepetitionForTodayByGroup } from "@/lib/api/repetitionApi";
import { setWithExpiry, getWithExpiry } from "./localStorageExpiry";

import { User, Group } from "@/lib/types";

interface UserContextType {
  user: User | null;
  groups: Group[];
  selectedGroup: Group | null;
  login: () => void;
  logout: () => void;
  setSelectedGroup: (group: Group | null) => void;
  refetchGroups: () => void;
  repetitionCounts: Record<number, number>;
  updateRepetitionCountForGroup: (groupId: number, count?: number) => void;
  fetchAndSetRepetitionCount: (groupId: number, fetchAgain: boolean) => void;
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

  const [repetitionCounts, setRepetitionCounts] = useState<Record<number, number>>(() => {
    const storedCounts = localStorage.getItem("repetitionCounts");
    return storedCounts ? JSON.parse(storedCounts) : {};
  });  

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
    setSelectedGroup(null);
    setRepetitionCounts({});
  
    localStorage.removeItem("user");
    localStorage.removeItem("groups");
  
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("repetitionCount-")) {
        localStorage.removeItem(key);
      }
    });
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

  const updateRepetitionCountForGroup = async (groupId: number, count?: number) => {
    if (count !== undefined) {
      setRepetitionCount(groupId, count);
    } else {
      await fetchAndSetRepetitionCount(groupId);
    }
  };

  const setRepetitionCount = (groupId: number, count: number) => {
    setRepetitionCounts((prev) => {
      const updatedCounts = { ...prev, [groupId]: count };
      localStorage.setItem("repetitionCounts", JSON.stringify(updatedCounts));
      return updatedCounts;
    });
    setWithExpiry(`repetitionCount-${groupId}`, count, 6 * 60 * 60 * 1000);
  };

  const fetchAndSetRepetitionCount = async (groupId: number, fetchAgain: boolean = false) => {
    console.log("asd")
    if (!fetchAgain) {
      const cachedCount = getWithExpiry(`repetitionCount-${groupId}`);
      if (cachedCount !== null) {
        setRepetitionCounts((prev) => ({ ...prev, [groupId]: cachedCount }));
        return;
      } 
    }

    try {
      const count = await fetchRepetitionForTodayByGroup(groupId);
      setRepetitionCount(groupId, count);
    } catch (error) {
      console.error("Failed to fetch repetition count", error);
    }
  };
  
  useEffect(() => {
    if (selectedGroup) {
      updateRepetitionCountForGroup(selectedGroup.id);
    }
  }, [selectedGroup]);  

  return (
    <UserContext.Provider
      value={{
        user,
        groups,
        selectedGroup,
        login,
        logout,
        setSelectedGroup,
        refetchGroups,
        repetitionCounts,
        updateRepetitionCountForGroup,
        fetchAndSetRepetitionCount
      }}
    >
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
