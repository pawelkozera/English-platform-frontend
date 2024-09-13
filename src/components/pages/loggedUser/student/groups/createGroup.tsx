import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateGroupForm } from "./createGroupForm";
import { useUser } from '@/components/utils/UserContext';
import { GroupList } from './groupList';
import { GroupStatistics } from "./groupStatistics";

export function CreateGroup() {
  const { groups, selectedGroup, setSelectedGroup } = useUser();
  const isOwner = true;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Owned Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreateGroupForm />
        <div className="grid grid-cols-2 gap-4">
          <GroupList 
            groups={groups}
            setSelectedGroup={setSelectedGroup} 
          />
          <GroupStatistics 
            selectedGroup={selectedGroup} 
            isOwner={isOwner} 
            onLeaveGroup={() => {}} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
