import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTasksForLesson } from '@/lib/api/lessonApi';
import { fetchTaskById } from '@/lib/api/taskApi';
import { LessonTask } from './lessonTask';

interface TaskResponse {
  taskId: number;
  completed: boolean;
}

export function LessonTasks() {
  const { lessonId } = useParams();
  const lessonIdNumber = Number(lessonId);

  const { data: taskList, isLoading, error } = useQuery<TaskResponse[]>({
    queryKey: ["tasks", lessonIdNumber],
    queryFn: () => fetchTasksForLesson(lessonIdNumber),
    enabled: !isNaN(lessonIdNumber),
  });

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;

  if (!taskList || taskList.length === 0) {
    return <div>No tasks found for this lesson.</div>;
  }

  const taskDetailsQueries = useQuery(
    ["taskDetails", ...taskList.map(task => task.taskId)],
    () => Promise.all(taskList.map(task => fetchTaskById(task.taskId))),
    {
      enabled: !!taskList,
    }
  );

  if (taskDetailsQueries.isLoading) return <div>Loading task details...</div>;
  if (taskDetailsQueries.error) return <div>Error loading task details</div>;

  const tasks = taskDetailsQueries.data || [];

  return (
    <div>
      <h2 className="text-2xl font-bold">Tasks for Lesson {lessonId}</h2>
      <LessonTask tasks={tasks} />
    </div>
  );
}
