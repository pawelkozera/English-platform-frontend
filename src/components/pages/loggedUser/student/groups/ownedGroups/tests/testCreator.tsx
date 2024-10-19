import { useState } from 'react';
import { TaskSelection } from './taskSelection';
import { Task, Word } from '@/lib/types';
import { Pagination } from '@/components/common/pagination';
import { Button } from "@/components/ui/button";

export function TestCreator() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const words: Word[] = [
    { id: 1, word: "apple", translation: "jabłko", audioFilePath: "path/to/apple.mp3", imageFilePath: "path/to/apple.jpg" },
    { id: 2, word: "banana", translation: "banan", audioFilePath: "path/to/banana.mp3", imageFilePath: "path/to/banana.jpg" },
  ];

  const userTasks: Task[] = [
    { id: 1, type: "typing", description: "Translate words", words: [words[0], words[1]], questionType: "translation" },
    { id: 2, type: "connection", description: "Match words with images", words: [words[0], words[1]], questionType: "image" },
    { id: 3, type: "connection", description: "Match words with images", words: [words[0], words[1]], questionType: "image" },
  ];

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

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Create a New Test</h1>
      
      <TaskSelection
        userTasks={userTasks}
        selectedTasks={selectedTasks}
        onTaskSelection={handleTaskSelect}
      />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Selected Tasks:</h2>
        <ul className="list-disc list-inside mb-4">
          {selectedTasks.map((taskId) => {
            const task = userTasks.find(task => task.id === taskId);
            return task ? <li key={taskId}>{task.description}</li> : null;
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