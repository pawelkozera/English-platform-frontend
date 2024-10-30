import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskConnection } from "../../../task/taskConnection";
import { TaskTypingExam } from "../../../task/taskTypingExam";
import { ConnectionType, TypingType, Task } from "@/lib/types";

interface TaskSelectionProps {
  userTasks: Task[];
  selectedTasks: number[];
  onTaskSelection: (taskId: number) => void;
}

export function TaskSelection({ userTasks, selectedTasks, onTaskSelection }: TaskSelectionProps) {
  const handleTaskSelect = (taskId: number) => {
    onTaskSelection(taskId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
      {userTasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{task.description}</h3>

            <div className="overflow-y-auto mb-4">
              {task.taskTypeName === "typing" ? (
                <TaskTypingExam
                  words={task.words}
                  questionType={task.taskSubTypeName as TypingType}
                  isPreview={true}
                />
              ) : (
                <TaskConnection
                  words={task.words}
                  questionType={task.taskSubTypeName as ConnectionType}
                  isExam={true}
                />
              )}
            </div>

            <Button
              onClick={() => handleTaskSelect(task.id)}
              className={`w-full ${selectedTasks.includes(task.id) ? "bg-destructive" : "bg-primary"}`}
            >
              {selectedTasks.includes(task.id) ? "Remove from test" : "Add to test"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
