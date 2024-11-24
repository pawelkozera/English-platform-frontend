import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "react-query";
import { createGroup } from "@/lib/api/groupApi";
import { useUser } from '@/components/utils/UserContext';

export function CreateGroupForm() {
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");

  const { refetchGroups } = useUser();

  const mutation = useMutation(createGroup, {
    onSuccess: (data) => {
      refetchGroups();
      console.log('Created group successful', data);
    },
    onError: (error) => {
      console.error('Error during group creation', error);
    }
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      groupName,
      password: groupPassword,
    })
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
      <Button type="submit" variant={"green"}>Create Group</Button>
    </form>
  );
}