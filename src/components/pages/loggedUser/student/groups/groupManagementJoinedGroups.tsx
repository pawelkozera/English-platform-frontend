import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/components/utils/UserContext';
import { GroupList } from './groupList';
import { GroupStatistics } from './groupStatistics';
import { GroupJoinForm } from './groupJoinForm';
import { Group } from '@/lib/types';

const mockGroups: Group[] = [
  { id: 1, groupName: 'Math Study Group', groupCode: 'MATH123' },
  { id: 2, groupName: 'History Club', groupCode: 'HIST456' },
  { id: 3, groupName: 'Science Enthusiasts', groupCode: 'SCI789' },
];

export function GroupManagementJoinedGroups() {
  const { fetchGroups } = useUser();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(mockGroups[0]);
  const isOwner = false;

  const handleJoinSuccess = () => {
    fetchGroups();
  };

  const handleLeaveGroup = () => {
    console.log('Leaving group:', selectedGroup?.groupName);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Joined Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <GroupJoinForm onJoinSuccess={handleJoinSuccess} />
        <div className="grid grid-cols-2 gap-4">
          <GroupList 
            groups={mockGroups} 
            setSelectedGroup={setSelectedGroup} 
          />
          <GroupStatistics 
            selectedGroup={selectedGroup} 
            isOwner={isOwner} 
            onLeaveGroup={handleLeaveGroup} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
