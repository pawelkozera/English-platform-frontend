import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from '@/interceptor/axios-interceptor';

interface GroupJoinFormProps {
  onJoinSuccess: () => void;
}

export function GroupJoinForm({ onJoinSuccess }: GroupJoinFormProps) {
  const [groupCode, setGroupCode] = useState('');
  const [groupPassword, setGroupPassword] = useState('');

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/api/v1/group/join', {
        groupCode: groupCode,
        password: groupPassword,
      });

      console.log('Joined group successfully', response.data);
      onJoinSuccess();
      setGroupCode('');
      setGroupPassword('');
    } catch (error) {
      console.error('Error during group joining', error);
    }
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
      <Button type="submit">Join Group</Button>
    </form>
  );
}
