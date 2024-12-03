import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "react-query";
import { addLesson } from "@/lib/api/lessonApi";
import { useUser } from "@/components/utils/UserContext";
import { GroupSelector } from "./groupSelector";

type GroupResponse = {
  groupName: string;
  id: number;
};

export function AddLesson() {
  const [title, setTitle] = useState<string>("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  const { groups } = useUser();

  const mutation = useMutation(addLesson, {
    onSuccess: (data) => {
      console.log("Lesson added successfully", data);
    },
    onError: (error) => {
      console.error("Error during lesson creation", error);
    },
  });

  const handleGroupSelection = (groups: GroupResponse[]) => {
    setSelectedGroupIds(groups.map(group => group.id));
  };  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || selectedGroupIds.length === 0) {
      console.error("Please provide both a title and at least one group.");
      return;
    }

    mutation.mutate({
      title,
      groupId: selectedGroupIds,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Add new lesson</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label>Subject</Label>
            <Input
              placeholder="Enter lesson title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <GroupSelector
              groups={groups}
              selectedGroups={groups.filter(group => selectedGroupIds.includes(group.id))}
              onGroupChange={handleGroupSelection}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isLoading || !title || selectedGroupIds.length === 0}
          >
            {mutation.isLoading ? "Adding..." : "Add lesson"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}