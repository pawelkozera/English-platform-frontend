import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import apiClient from "@/interceptor/axios-interceptor";

export function CreateGroupForm() {
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await apiClient.post('/', {
          groupName,
          groupPassword,
        });
  
        console.log('Created group successful', response.data);
      } catch (error) {
        console.error('Error during group creation', error);
      }
  };

  return (
    <form onSubmit={handleCreateGroup} className="space-y-4 p-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="groupName">Nazwa grupy</Label>
        <Input
          id="groupName"
          placeholder="Wpisz nazwę grupy"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="groupPassword">Hasło do grupy</Label>
        <Input
          id="groupPassword"
          type="password"
          placeholder="Wpisz hasło do grupy"
          value={groupPassword}
          onChange={(e) => setGroupPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Utwórz grupę
      </Button>
    </form>
  );
}
