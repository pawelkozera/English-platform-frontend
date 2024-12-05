import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { editLesson } from "@/lib/api/lessonApi";
import { useUser } from "@/components/utils/UserContext";
import { LessonSelector } from "../taskCreator/lessonSelector";
import { GroupSelector } from "./groupSelector";
import { Pagination } from "@/components/common/pagination";
import { fetchLessonsOwnedByUser } from "@/lib/api/lessonApi";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type GroupResponse = {
  groupName: string;
  id: number;
};

type LessonResponse = {
  title: string;
  lessonId: number;
  groupIds: number[];
};

export function EditLesson() {
  const [title, setTitle] = useState<string>("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [lessonPage, setLessonPage] = useState(0);
  const [lessonPageSize, _setLessonPageSize] = useState(20);
  const [lessonTotalPages, setLessonTotalPages] = useState(1);
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse[]>([]);

  const { groups, selectedGroup } = useUser();

  const fetchLessons = async () => {
    try {
      if (selectedGroup) {
        const lessonsData = await fetchLessonsOwnedByUser();
        setLessons(lessonsData._embedded.lessonWithGroupsResponseList || []);
        setLessonTotalPages(lessonsData.page.totalPages);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [lessonPage, lessonPageSize, selectedGroup]);

  const mutation = useMutation((data: { lessonId: number; title: string; groupIds: number[] }) => editLesson(data.lessonId, data), {
		onSuccess: (data) => {
			console.log("Lesson edited successfully", data);
      fetchLessons();
		},
		onError: (error) => {
			console.error("Error during lesson editing", error);
		},
	});
	
  const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	
		if (!title) {
			console.error("Please provide a title.");
			return;
		}
	
		if (selectedLesson.length !== 1) {
			console.error("Please select exactly one lesson.");
			return;
		}
	
		mutation.mutate({
			lessonId: selectedLesson[0].lessonId,
			title,
			groupIds: selectedGroupIds,
		});
	};	

  const handleGroupSelection = (groups: GroupResponse[]) => {
    setSelectedGroupIds(groups.map((group) => group.id));
  };

  const handleLessonChange = (lessons: LessonResponse[]) => {
    if (lessons.length > 1) {
      setSelectedLesson([lessons[lessons.length - 1]]);
      setTitle(lessons[lessons.length - 1].title);
      setSelectedGroupIds(lessons[lessons.length - 1].groupIds);
    } else {
      setSelectedLesson(lessons);
      if (lessons.length === 1) {
        setTitle(lessons[0].title);
        setSelectedGroupIds(lessons[0].groupIds);
      }
      else {
				setTitle("");
				setSelectedGroupIds([]);
			}
    }
  };

  return (
    <div>
      <p className="mt-8">Select the lesson you want to edit</p>
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

      <p className="mt-8">Select the groups to which you want to add the lesson</p>
      <GroupSelector
        groups={groups}
        selectedGroups={groups.filter((group) =>
          selectedGroupIds.includes(group.id)
        )}
        onGroupChange={handleGroupSelection}
      />

      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Edit lesson</CardTitle>
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
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={
                mutation.isLoading ||
                !title ||
                selectedLesson.length !== 1
              }
            >
              {mutation.isLoading ? "Editing..." : "Edit lesson"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}