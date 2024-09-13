import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Group } from '@/lib/types';

interface GroupStatisticsProps {
  selectedGroup: Group | null;
  isOwner: boolean;
  onLeaveGroup: () => void;
}

export function GroupStatistics({ selectedGroup, isOwner, onLeaveGroup }: GroupStatisticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedGroup ? (
          <>
            <p>Name: {selectedGroup.groupName}</p>
            <p>Group Code: {selectedGroup.groupCode}</p>
            {!isOwner && (
              <Button className="mt-4" variant="destructive" onClick={onLeaveGroup}>
                Leave Group
              </Button>
            )}
          </>
        ) : (
          <p>No group selected.</p>
        )}
      </CardContent>
    </Card>
  );
}
