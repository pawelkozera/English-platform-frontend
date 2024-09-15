import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import apiClient from "@/interceptor/axios-interceptor";
import { useUser } from '@/components/utils/UserContext';

export function CreateGroupForm() {
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");

  const { fetchGroups } = useUser();

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await apiClient.post('/api/v1/group/createGroup', {
          groupName: groupName,
          password: groupPassword,
        });

        fetchGroups();
  
        console.log('Created group successful', response.data);
      } catch (error) {
        console.error('Error during group creation', error);
      }
  };

  return (
    <form onSubmit={handleCreateGroup} className="flex space-x-2">
      <Input
        id="groupName"
        placeholder="New group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <Input
        id="groupPassword"
        type="password"
        placeholder="Group password"
        value={groupPassword}
        onChange={(e) => setGroupPassword(e.target.value)}
      />
      <Button type="submit">Create Group</Button>
    </form>
  );
}