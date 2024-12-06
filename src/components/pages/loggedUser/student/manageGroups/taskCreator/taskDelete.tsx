import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { TaskSelection } from '../tests/taskSelection';
import { Task } from '@/lib/types';
import { Pagination } from '@/components/common/pagination';
import { Button } from "@/components/ui/button";
import { fetchTasksOwnedByUser } from '@/lib/api/taskApi';
import { deleteTaskById } from '@/lib/api/taskApi';

export function TaskDelete() {
	const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 4;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tasksOwnedByUser', currentPage],
    queryFn: () => fetchTasksOwnedByUser(currentPage, pageSize),
    refetchOnWindowFocus: false,
  });

  const tasks: Task[] = data?._embedded?.taskResponseList || [];
  const totalPages = data?.page?.totalPages || 1;

  const handleTaskSelect = (taskId: number) => {
		setSelectedTask((prevTask) => (prevTask === taskId ? null : taskId));
	};

  const handleDeleteTask = () => {
		if (selectedTask === null) return;
	
		mutation.mutate(selectedTask);
	};

  const mutation = useMutation(deleteTaskById, {
    onSuccess: () => {
      refetch().then(() => {
        if (currentPage >= totalPages - 1 && tasks.length === 1) {
          setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
        }
        setSelectedTask(null);
      });
    },
    onError: (error) => {
      console.error("Error deleting task", error);
    },
  });

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error loading tasks</div>;

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Delete Task</h1>

      <TaskSelection
        userTasks={tasks}
        selectedTasks={selectedTask !== null ? [selectedTask] : []}
        onTaskSelection={handleTaskSelect}
        isExam={false}
        showSelectButton={true}
      />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />

      <div className="mt-8">
        <Button
          onClick={handleDeleteTask}
          className="mt-4 text-lg rounded-lg"
          disabled={selectedTask === null}
        >
          Delete task
        </Button>
      </div>
    </div>
  );
}