import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTasksByIds } from '@/lib/api/taskApi';
import { Sidebar } from '@/components/common/sidebar';
import { Footer } from '@/components/common/footer';
import { TestsTask } from './testsTask';
import { fetchTasksForTestInstance } from '@/lib/api/testInstanceApi';

export function TestsTasks() {
  const { testInstanceId } = useParams();
  const testInstanceIdNumber = Number(testInstanceId);

  const { data: taskIds, isLoading, error } = useQuery<number[]>({
    queryKey: ["tasksIds", testInstanceIdNumber],
    queryFn: () => fetchTasksForTestInstance(testInstanceIdNumber),
    enabled: !isNaN(testInstanceIdNumber),
    refetchOnWindowFocus: false,
  });

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ["taskDetails", taskIds],
    queryFn: () => fetchTasksByIds(taskIds || []),
    enabled: Boolean(taskIds && taskIds.length > 0),
    refetchOnWindowFocus: false,
  });

  if (isLoading || tasksLoading) return <div>Loading tasks...</div>;
  if (error || tasksError) return <div>Error loading tasks</div>;

  if (!taskIds || taskIds.length === 0) {
    return <div>No tasks found for this test instance.</div>;
  }

  return (
    <div className="h-screen">
      <main className="flex flex-col lg:flex-row">
        <Sidebar />
        <TestsTask tasks={tasks} />
      </main>
      <Footer />
    </div>
  );
}