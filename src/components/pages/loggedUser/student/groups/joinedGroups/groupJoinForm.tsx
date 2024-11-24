import { useState } from 'react';
import { useMutation } from "react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { joinGroup } from '@/lib/api/groupApi';

interface GroupJoinFormProps {
  onJoinSuccess: () => void;
}

export function GroupJoinForm({ onJoinSuccess }: GroupJoinFormProps) {
  const [groupCode, setGroupCode] = useState('');
  const [groupPassword, setGroupPassword] = useState('');

  const mutation = useMutation(joinGroup, {
    onSuccess: (data) => {
      onJoinSuccess();
      setGroupCode('');
      setGroupPassword('');
      console.log('Joined group successfully', data);
    },
    onError: (error) => {
      console.error('Error during group joining', error);
    }
  });

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      groupCode,
      password: groupPassword,
    })
  };

  return (
    <form className="flex space-x-2" onSubmit={handleJoinGroup}>
      <Input 
        placeholder="Enter group code" 
        value={groupCode} 
        onChange={(e) => setGroupCode(e.target.value)} 
      />
      <Input 
        placeholder="Enter group password" 
        type="password" 
        value={groupPassword} 
        onChange={(e) => setGroupPassword(e.target.value)} 
      />
      <Button type="submit" variant={"green"}>Join Group</Button>
    </form>
  );
}
