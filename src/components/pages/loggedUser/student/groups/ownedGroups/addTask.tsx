import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "react-query";
import { addTask } from "@/lib/api/taskApi";
import { useUser } from "@/components/utils/UserContext";
import { fetchLessonsFromGroup } from "@/lib/api/lessonApi";

export function AddTask() {
  const [taskType, setTaskType] = useState<string>("");
  const [content, setContent] = useState<string | File>("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const { selectedGroup } = useUser();

  const mutation = useMutation(addTask, {
    onSuccess: (data) => {
      console.log("Task added successfully", data);
    },
    onError: (error) => {
      console.error("Error during task creation", error);
    },
  });

  useEffect(() => {
    if (selectedGroup) {
      const fetchLessons = async () => {
        try {
          const lessonsData = await fetchLessonsFromGroup(selectedGroup.id);
          setLessons(lessonsData);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      };

      fetchLessons();
    }
  }, [selectedGroup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    mutation.mutate({
      taskTypeName: taskType,
      subTypeName: "",
      content: content instanceof File ? content : content.toString(),
      correctAnswer,
      lessonId: selectedLesson || 0,
    });
  };  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContent(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Dodaj Nowe Zadanie</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <CardContent className="space-y-4">
        <div>
          <Label>Wybierz Lekcję</Label>
          <Select onValueChange={(value) => setSelectedLesson(value ? Number(value) : null)}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz lekcję" />
            </SelectTrigger>
            <SelectContent>
              {lessons.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

          <div>
            <Label>Typ Zadania</Label>
            <Select onValueChange={setTaskType}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz typ zadania" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="matching">Łączenie słów</SelectItem>
                <SelectItem value="writing">Pisanie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Treść Zadania</Label>
            {taskType === "audio" ? (
              <Input type="file" accept="audio/*" onChange={handleFileChange} />
            ) : (
              <Input
                placeholder="Wpisz treść zadania"
                value={content as string}
                onChange={(e) => setContent(e.target.value)}
              />
            )}
          </div>

          <div>
            <Label>Poprawna Odpowiedź</Label>
            <Input
              placeholder="Wpisz poprawną odpowiedź"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Dodawanie..." : "Dodaj Zadanie"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
