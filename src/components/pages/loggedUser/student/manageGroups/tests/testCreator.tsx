import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { TaskSelection } from './taskSelection';
import { Task } from '@/lib/types';
import { Pagination } from '@/components/common/pagination';
import { Button } from "@/components/ui/button";
import { fetchTasksOwnedByUser } from '@/lib/api/taskApi';
import { addTestTemplate } from '@/lib/api/testTemplateApi';

export function TestCreator() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [testName, setTestName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 4;

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasksOwnedByUser', currentPage],
    queryFn: () => fetchTasksOwnedByUser(currentPage, pageSize),
    refetchOnWindowFocus: false,
  });

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
    if (!testName || selectedTasks.length === 0) return;

    mutation.mutate({
      name: testName,
      tasksIds: selectedTasks,
    });
  };

  const mutation = useMutation(addTestTemplate, {
    onSuccess: (data) => {
      console.log("Test template created successfully", data);
    },
    onError: (error) => {
      console.error("Error during test template creation", error);
    },
  });

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error loading tasks</div>;

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Create a New Test Template</h1>

      <p className='text-lg mb-4'>Name for the test</p>
      <input 
        type="text" 
        className="rounded-md p-2 mb-4 w-full bg-secondary" 
        placeholder='Test Name' 
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
      />

      <TaskSelection
        userTasks={tasks}
        selectedTasks={selectedTasks}
        onTaskSelection={handleTaskSelect}
        showSelectButton={false}
        isExam={true}
      />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />

      <div className="mt-8">
        <Button
          onClick={handleCreateTest}
          className="mt-4 text-lg rounded-lg"
          disabled={selectedTasks.length === 0 || !testName}
        >
          Create Test Template
        </Button>
      </div>
    </div>
  );
}