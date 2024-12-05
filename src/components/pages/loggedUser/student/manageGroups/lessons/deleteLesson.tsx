import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useUser } from "@/components/utils/UserContext";
import { LessonSelector } from "../taskCreator/lessonSelector";
import { Pagination } from "@/components/common/pagination";
import { fetchLessonsNotAssignedToGroup } from "@/lib/api/lessonApi";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { deleteLessonById } from "@/lib/api/lessonApi";

type LessonResponse = {
  title: string;
  lessonId: number;
  groupIds: number[];
};

export function DeleteLesson() {
  const [title, setTitle] = useState<string>("");
  const [lessonPage, setLessonPage] = useState(0);
  const [lessonPageSize, _setLessonPageSize] = useState(20);
  const [lessonTotalPages, setLessonTotalPages] = useState(1);
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse[]>([]);

  const { selectedGroup } = useUser();

  const fetchLessons = async () => {
		try {
			if (selectedGroup) {
				const lessonsData = await fetchLessonsNotAssignedToGroup(selectedGroup.id);
				setLessons(lessonsData._embedded.lessonResponseList || []);
				setLessonTotalPages(lessonsData.page.totalPages);
			}
		} catch (error) {
			console.error("Error fetching lessons:", error);
		}
	};

  useEffect(() => {
		fetchLessons();
  }, [lessonPage, lessonPageSize, selectedGroup]);

  const deleteMutation = useMutation((lessonId: number) => deleteLessonById(lessonId), {
    onSuccess: () => {
      console.log("Lesson deleted successfully");
      setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.lessonId !== selectedLesson[0].lessonId));
      setSelectedLesson([]);
      setTitle("");
    },
    onError: (error) => {
      console.error("Error deleting lesson:", error);
    },
  });
	
  const handleDelete = (event: React.FormEvent) => {
		event.preventDefault();
		if (selectedLesson.length !== 1) {
			console.error("Please select exactly one lesson.");
			return;
		}
	
		const lessonId = selectedLesson[0].lessonId;
		deleteMutation.mutate(lessonId);
	};
	

  const handleLessonChange = (lessons: LessonResponse[]) => {
		if (lessons.length > 1) {
			setSelectedLesson([lessons[lessons.length - 1]]);
			setTitle(lessons[lessons.length - 1].title);
		} else {
			setSelectedLesson(lessons);
			if (lessons.length === 1) {
				setTitle(lessons[0].title);
			} 
			else {
				setTitle("");
			}
		}
	};

  return (
    <div>
      <p className="mt-8">Select the lesson you want to delete</p>
      <LessonSelector
        lessons={lessons}
        selectedLesson={selectedLesson}
        onLessonChange={handleLessonChange}
      />
      <Pagination
        page={lessonPage}
        totalPages={lessonTotalPages}
        onPageChange={setLessonPage}
      />

      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Delete lesson</CardTitle>
        </CardHeader>
        <form onSubmit={handleDelete}>
          <CardContent className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="Enter lesson title"
                disabled={true}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
						<Button
							type="submit"
							disabled={
								deleteMutation.isLoading ||
								!title ||
								selectedLesson.length !== 1
							}
						>
							{deleteMutation.isLoading ? "Deleting..." : "Delete lesson"}
						</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}