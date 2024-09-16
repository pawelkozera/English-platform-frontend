import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/components/utils/UserContext';
import { GroupList } from '../common/groupList';
import { GroupStatistics } from '../common/groupStatistics';
import { GroupJoinForm } from './groupJoinForm';

export function GroupManagementJoinedGroups() {
  const { groups, selectedGroup, setSelectedGroup, refetchGroups } = useUser();

  const handleJoinSuccess = () => {
    refetchGroups();
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
            groups={groups} 
            setSelectedGroup={setSelectedGroup} 
          />
          <GroupStatistics 
            selectedGroup={selectedGroup} 
            onLeaveGroup={handleLeaveGroup} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
