import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateGroupForm } from "./createGroupForm";
import { useUser } from '@/components/utils/UserContext';
import { GroupList } from '../common/groupList';
import { GroupStatistics } from "../common/groupStatistics";

export function CreateGroup() {
  const { groups, selectedGroup, setSelectedGroup } = useUser();
  const ownerGroups = groups.filter(group => group.owner);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Owned Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CreateGroupForm />
        <div className="grid grid-cols-2 gap-4">
          <GroupList 
            groups={ownerGroups}
            setSelectedGroup={setSelectedGroup} 
          />
          {selectedGroup && (
            <GroupStatistics 
              selectedGroup={selectedGroup} 
              showOnlyOwner={true}
            /> 
          )}
        </div>
      </CardContent>
    </Card>
  );
}
