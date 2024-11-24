import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from '@/components/utils/UserContext';

const mockLessons = [
  { id: 1, name: 'Introduction to Algebra' },
  { id: 2, name: 'World War II Overview' },
  { id: 3, name: 'Basic Programming Concepts' },
];

const mockLessonsAvailable = [
  { id: 1, name: 'Introduction to Algebra' },
  { id: 2, name: 'World War II Overview' },
  { id: 3, name: 'Basic Programming Concepts' },
];

export function AddLessonToGroup() {
  const { selectedGroup } = useUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Lessons to Group: {selectedGroup?.groupName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedGroup ? (
          <>
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a lesson" />
                </SelectTrigger>
                <SelectContent>
                  {mockLessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id.toString()}>
                      {lesson.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button>Add Lesson</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Lessons in group
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {mockLessons.map((lesson) => (
                      <div key={lesson.id} className="flex justify-between items-center mb-2">
                        <span>{lesson.name}</span>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Available lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {mockLessonsAvailable.map((lesson) => (
                      <div key={lesson.id} className="flex justify-between items-center mb-2">
                        <span>{lesson.name}</span>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <p className="text-red-500">No group selected. Please select a group to add lessons.</p>
        )}
      </CardContent>
    </Card>
  );
}
