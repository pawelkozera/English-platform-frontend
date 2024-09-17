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
  const [groupId, setGroupId] = useState<number | null>(null);

  const { groups, refetchGroups } = useUser();

  const mutation = useMutation(addLesson, {
    onSuccess: (data) => {
      refetchGroups();
      console.log("Lesson added successfully", data);
    },
    onError: (error) => {
      console.error("Error during lesson creation", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !groupId) {
      console.error("Please provide both a title and a group.");
      return;
    }
    console.log(groupId);
    mutation.mutate({
      title,
      groupId,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Dodaj Nową Lekcję</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label>Tytuł Lekcji</Label>
            <Input
              placeholder="Wpisz tytuł lekcji"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Wybierz Grupę</Label>
            {groups.length > 0 ? (
              <Select onValueChange={(value) => setGroupId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz grupę" />
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
              <p>Brak dostępnych grup</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isLoading || !title || !groupId}
          >
            {mutation.isLoading ? "Dodawanie..." : "Dodaj Lekcję"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
