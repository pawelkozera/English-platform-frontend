import { useState } from 'react';
import { useQuery } from 'react-query';
import { TaskSelection } from './taskSelection';
import { Task } from '@/lib/types';
import { Pagination } from '@/components/common/pagination';
import { Button } from "@/components/ui/button";
import { fetchTasksOwnedByUser } from '@/lib/api/taskApi';

export function TestCreator() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 4;

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasksOwnedByUser', currentPage],
    queryFn: () => fetchTasksOwnedByUser(currentPage, pageSize),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  // Update data access based on your API response structure
  const tasks: Task[] = data?._embedded?.taskResponseList || [];
  const totalPages = data?.page?.totalPages || 1;

  const handleTaskSelect = (taskId: number) => {
    setSelectedTasks((prevTasks) =>
      prevTasks.includes(taskId)
        ? prevTasks.filter(id => id !== taskId)
        : [...prevTasks, taskId]
    );
  };

  const handleCreateTest = () => {
    console.log('Creating test with tasks:', selectedTasks);
  };

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error loading tasks</div>;

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Create a New Test</h1>

      <TaskSelection
        userTasks={tasks}
        selectedTasks={selectedTasks}
        onTaskSelection={handleTaskSelect}
      />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Selected Tasks:</h2>
        <ul className="list-disc list-inside mb-4">
          {selectedTasks.map((taskId) => {
            const task = tasks.find(task => task.id === taskId);
            return task ? <li key={taskId}>{task.words.map(word => word.word).join(", ")}</li> : null;
          })}
        </ul>

        <Button
          onClick={handleCreateTest}
          className="mt-4"
          disabled={selectedTasks.length === 0}
        >
          Create Test
        </Button>
      </div>
    </div>
  );
}
