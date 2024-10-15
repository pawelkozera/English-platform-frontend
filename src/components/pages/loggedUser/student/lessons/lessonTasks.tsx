import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTasksForLesson } from '@/lib/api/lessonApi';
import { fetchTasksByIds } from '@/lib/api/taskApi';
import { Sidebar } from '@/components/common/sidebar';
import { Footer } from '@/components/common/footer';
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
    refetchOnWindowFocus: false,
  });

  const taskIds = taskList ? taskList.map(task => task.taskId) : [];
  
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ["taskDetails", ...taskIds],
    queryFn: () => fetchTasksByIds(taskIds),
    enabled: taskIds.length > 0,
    refetchOnWindowFocus: false,
  });

  if (isLoading || tasksLoading) return <div>Loading tasks...</div>;
  if (error || tasksError) return <div>Error loading tasks</div>;

  if (!taskList || taskList.length === 0) {
    return <div>No tasks found for this lesson.</div>;
  }

  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <LessonTask tasks={tasks} />
      </main>
      <Footer />
    </div>
  );
}
