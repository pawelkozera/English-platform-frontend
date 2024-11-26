import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Group } from '@/lib/types';

interface GroupStatisticsProps {
  selectedGroup: Group | null;
  onLeaveGroup?: () => void;
  showOnlyOwner?: boolean;
}

export function GroupStatistics({ selectedGroup, onLeaveGroup, showOnlyOwner = false }: GroupStatisticsProps) {
  const shouldShowStatistics = selectedGroup && (!showOnlyOwner || (showOnlyOwner && selectedGroup.owner));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Informations</CardTitle>
      </CardHeader>
      <CardContent>
        {shouldShowStatistics ? (
          <>
            <p>Name: {selectedGroup.groupName}</p>
            <p>Group Code: {selectedGroup.groupCode}</p>
            {(selectedGroup.owner && !showOnlyOwner) ? (
              <p className="text-green-500 mt-2">
                You are the owner of this group.
              </p>
            ) : (!showOnlyOwner && (
                <Button className="mt-4" variant="destructive" onClick={onLeaveGroup}>
                  Leave Group
                </Button>
              )
            )}
          </>
        ) : (
          <p>No group selected.</p>
        )}
      </CardContent>
    </Card>
  );
}