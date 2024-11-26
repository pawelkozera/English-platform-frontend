import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "react-query";
import { addAnnouncement } from "@/lib/api/announcementApi";
import { useUser } from "@/components/utils/UserContext";

export function Send() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [groupId, setGroupId] = useState<number | null>(null);

  const { groups } = useUser();

  const mutation = useMutation(addAnnouncement, {
    onSuccess: (data) => {
      console.log("Announcement added successfully", data);
    },
    onError: (error) => {
      console.error("Error during announcement creation", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !groupId) {
      console.error("Please provide title, content, and group.");
      return;
    }

    mutation.mutate({
      title,
      content,
      groupId,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Add New Announcement</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label>Announcement Title</Label>
            <Input
              placeholder="Enter the title of the announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Announcement Content</Label>
            <Input
              placeholder="Enter the content of the announcement"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <Label>Select Group</Label>
            {groups.length > 0 ? (
              <Select onValueChange={(value) => setGroupId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.groupName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p>No available groups</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isLoading || !title || !content || !groupId}
          >
            {mutation.isLoading ? "Adding..." : "Add Announcement"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}