import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchTasksByIds } from '@/lib/api/taskApi';
import { Sidebar } from '@/components/common/sidebar';
import { Footer } from '@/components/common/footer';
import { TestsTask } from './testsTask';
import { fetchTasksForTestInstance } from '@/lib/api/testInstanceApi';
import { fetchTestHistoryCompletionStatus } from '@/lib/api/testHistory';
import { useEffect } from 'react';
import axios from 'axios';

export function TestsTasks() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromNavigate = location.state?.fromNavigate;
  const { testInstanceId } = useParams();
  const testInstanceIdNumber = Number(testInstanceId);

  useQuery({
    queryKey: ["testCompletionStatus", testInstanceIdNumber],
    queryFn: () => fetchTestHistoryCompletionStatus(testInstanceIdNumber),
    enabled: !isNaN(testInstanceIdNumber),
    retry: false,
    onError: (error) => {
      console.log(error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403 || error.response?.status === 404) {
          console.error("Error while fetching test completion status:", error);
          navigate('/tests');
        }
      } else {
        console.error("Unexpected error", error);
      }
    }
  });
  

  useEffect(() => {
    if (!fromNavigate && document.referrer === "") {
      console.log("User navigated manually or refreshed the page");
    }
  }, [fromNavigate]);

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
        <TestsTask tasks={tasks}/>
      </main>
      <Footer />
    </div>
  );
}