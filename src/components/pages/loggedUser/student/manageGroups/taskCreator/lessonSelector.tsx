import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type LessonResponse = {
  title: string;
  lessonId: number;
};

type LessonSelectorProps = {
  lessons: LessonResponse[];
  selectedLesson: LessonResponse | null;
  onLessonChange: (lesson: LessonResponse | null) => void;
};

export function LessonSelector({ lessons, selectedLesson, onLessonChange }: LessonSelectorProps) {
  return (
    <div>
      <Label htmlFor="lesson">Select Lesson</Label>
      <div className="mb-4" />
      <Select onValueChange={(value) => {
        const lesson = lessons.find(l => l.lessonId === Number(value));
        onLessonChange(lesson || null);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a lesson" />
        </SelectTrigger>
        <SelectContent>
          {lessons.map(lesson => (
            <SelectItem key={lesson.lessonId} value={lesson.lessonId.toString()}>
              {lesson.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
