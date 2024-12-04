import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from '@/components/utils/UserContext';
import { useMutation } from "react-query";
import { fetchLessonsNotAssignedToGroup } from "@/lib/api/lessonApi";
import { assignLessonsToGroup } from "@/lib/api/groupApi";
import { Pagination } from "@/components/common/pagination";
import { LessonSelector } from "../taskCreator/lessonSelector";

type LessonResponse = {
  title: string;
  lessonId: number;
  groupIds: number[];
};

export function AddLessonToGroup() {
  const { selectedGroup } = useUser();
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse[]>([]);
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [lessonPage, setLessonPage] = useState(0);
  const [lessonsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonTotalPages, setLessonTotalPages] = useState(0);

  const mutate = useMutation(assignLessonsToGroup, {
    onSuccess: (data) => {
      console.log("Lessons added to group successfully", data);
      fetchLessons();
    },
    onError: (error) => {
      console.error("Error adding lessons to group", error);
    },
  });

  const fetchLessons = async () => {
    if (selectedGroup) {
      setIsLoading(true);
      try {
        const response = await fetchLessonsNotAssignedToGroup(selectedGroup.id, lessonPage, lessonsPerPage);
        const lessonsFromResponse = response._embedded?.lessonResponseList || [];
        setLessons(lessonsFromResponse);
        setLessonTotalPages(response.page?.totalPages || 0);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (selectedGroup) {
      fetchLessons();
    }
  }, [lessonPage, selectedGroup]);

  const handleAddLessons = () => {
    if (selectedLesson.length > 0 && selectedGroup) {
      mutate.mutate({
        groupId: selectedGroup.id,
        lessonIds: selectedLesson.map((lesson) => lesson.lessonId),
      });
    } else {
      console.error("Please select at least one lesson.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Lessons to Group: {selectedGroup?.groupName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedGroup ? (
          <>
            <LessonSelector
              lessons={lessons.map((lesson) => ({
                title: lesson.title,
                lessonId: lesson.lessonId,
                groupIds: lesson.groupIds,
              }))}
              selectedLesson={selectedLesson}
              onLessonChange={setSelectedLesson}
            />

            <Pagination
              page={lessonPage}
              totalPages={lessonTotalPages}
              onPageChange={(page) => setLessonPage(page)}
            />
            
            <Button onClick={handleAddLessons} disabled={isLoading || selectedLesson.length === 0}>
              {isLoading ? "Adding..." : "Add Lessons to Group"}
            </Button>
          </>
        ) : (
          <p className="text-red-500">No group selected. Please select a group to add lessons.</p>
        )}
      </CardContent>
    </Card>
  );
}