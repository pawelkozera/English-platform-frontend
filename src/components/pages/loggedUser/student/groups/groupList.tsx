import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Group } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GroupListProps {
  groups: Group[];
  setSelectedGroup: (group: Group) => void;
}

export function GroupList({ groups, setSelectedGroup }: GroupListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {groups.map((group) => (
            <div key={group.id} className="flex justify-between items-center mb-2">
              <span>{group.groupName}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedGroup(group)}>
                Select
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
