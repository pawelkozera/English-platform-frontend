import { Card, CardContent } from "@/components/ui/card";

type LessonResponse = {
  title: string;
  lessonId: number;
  groupIds: number[];
};

type LessonSelectorProps = {
  lessons: LessonResponse[];
  selectedLesson: LessonResponse[];
  onLessonChange: (lessons: LessonResponse[]) => void;
};

export function LessonSelector({
  lessons,
  selectedLesson,
  onLessonChange,
}: LessonSelectorProps) {
  const toggleLesson = (lesson: LessonResponse) => {
    const isSelected = selectedLesson.some(
      (selected) => selected.lessonId === lesson.lessonId
    );

    const updatedLessons = isSelected
      ? selectedLesson.filter((selected) => selected.lessonId !== lesson.lessonId)
      : [...selectedLesson, lesson];

    onLessonChange(updatedLessons);
  };

  const isSelected = (lessonId: number) =>
    selectedLesson.some((lesson) => lesson.lessonId === lessonId);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {lessons.map((lesson) => (
          <Card
            key={lesson.lessonId}
            className={`cursor-pointer ${
              isSelected(lesson.lessonId) ? "border-primary" : ""
            }`}
            onClick={() => toggleLesson(lesson)}
          >
            <CardContent className="p-4">
              <p className="font-semibold">{lesson.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}