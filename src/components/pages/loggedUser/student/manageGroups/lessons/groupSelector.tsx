import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type GroupResponse = {
  groupName: string;
  id: number;
};

type GroupSelectorProps = {
  groups: GroupResponse[];
  selectedGroups: GroupResponse[];
  onGroupChange: (groups: GroupResponse[]) => void;
};

export function GroupSelector({
  groups,
  selectedGroups,
  onGroupChange,
}: GroupSelectorProps) {
  const toggleGroup = (group: GroupResponse) => {
    const isSelected = selectedGroups.some(
      (selected) => selected.id === group.id
    );

    const updatedGroups = isSelected
      ? selectedGroups.filter((selected) => selected.id !== group.id)
      : [...selectedGroups, group];

    onGroupChange(updatedGroups);
  };

  const isSelected = (groupId: number) =>
    selectedGroups.some((group) => group.id === groupId);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {groups.map((group) => (
          <Card
            key={group.id}
            className={`cursor-pointer ${
              isSelected(group.id) ? "border-primary" : ""
            }`}
            onClick={() => toggleGroup(group)}
          >
            <CardContent className="p-4">
              <p className="font-semibold">{group.groupName}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}