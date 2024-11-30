import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "react-query";
import { addLesson } from "@/lib/api/lessonApi";
import { useUser } from "@/components/utils/UserContext";

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

  const handleGroupSelection = (groupId: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
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
            <Label>Select groups</Label>
            {groups.length > 0 ? (
              <div className="space-y-2">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`group-${group.id}`}
                      checked={selectedGroupIds.includes(group.id)}
                      onChange={() => handleGroupSelection(group.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`group-${group.id}`} className="text-sm text-gray-700">
                      {group.groupName}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p>No available groups</p>
            )}
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
