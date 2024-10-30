import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from '@/components/utils/UserContext'
import { fetchLessonsFromGroup } from '@/lib/api/lessonApi'
import { fetchWordsOwnedByUser } from '@/lib/api/wordApi'
import { useMutation } from "react-query";
import { addTask } from "@/lib/api/taskApi";
import { TaskConnection } from '../../../task/taskConnection'
import { TaskTyping } from '../../../task/taskTyping'
import { TypingType, ConnectionType } from '@/lib/types'
import { Pagination } from '@/components/common/pagination'
import { TaskTypeSelector } from './taskTypeSelector'
import { LessonSelector } from './lessonSelector'
import { WordSelection } from './wordSelection';

type TaskType = 'typing' | 'connection'
type LessonResponse = {
  title: string;
  lessonId: number;
};

export function TaskCreator() {
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [userWords, setUserWords] = useState<any[]>([])
  const [taskType, setTaskType] = useState<TaskType>('typing')
  const [subTaskType, setSubTaskType] = useState<TypingType | ConnectionType>('translation')
  const [selectedWords, setSelectedWords] = useState<number[]>([])
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const { selectedGroup } = useUser()

  const mutation = useMutation(addTask, {
    onSuccess: (data) => {
      console.log("Task added successfully", data);
    },
    onError: (error) => {
      console.error("Error during task creation", error);
    },
  });

  const handleSubmit = () => {
    if (!selectedLesson || selectedWords.length === 0) {
      return;
    }
  
    mutation.mutate({
      taskTypeName: taskType,
      taskSubTypeName: subTaskType,
      content: "",
      correctAnswer: "",
      lessonId: selectedLesson.lessonId,
      wordIds: selectedWords
    });
  };

  useEffect(() => {
    if (selectedGroup) {
      const fetchLessons = async () => {
        try {
          const lessonsData = await fetchLessonsFromGroup(selectedGroup.id);
          setLessons(lessonsData);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      };

      fetchLessons();
    }
  }, [selectedGroup]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetchWordsOwnedByUser(currentPage, pageSize);
  
        if (response && response._embedded && response._embedded.wordResponseList) {
          setUserWords(response._embedded.wordResponseList);
          setTotalPages(response.page.totalPages);
        } else {
          console.error("No words found");
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };
  
    fetchWords();
  }, [currentPage, pageSize]);
  

  const handleWordSelection = (wordId: number) => {
    setSelectedWords(prev => 
      prev.includes(wordId) ? prev.filter(id => id !== wordId) : [...prev, wordId]
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Task Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <LessonSelector 
            lessons={lessons} 
            selectedLesson={selectedLesson} 
            onLessonChange={setSelectedLesson} 
          />
          <TaskTypeSelector 
            taskType={taskType} 
            subTaskType={subTaskType} 
            onTaskTypeChange={setTaskType} 
            onSubTaskTypeChange={setSubTaskType} 
          />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Select Words</CardTitle>
        </CardHeader>
        <CardContent>
          <WordSelection
            userWords={userWords}
            selectedWords={selectedWords}
            onWordSelection={handleWordSelection}
          />
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Task Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {taskType === 'typing' && (
            <TaskTyping
              words={selectedWords.map(wordId => userWords.find(word => word.id === wordId))}
              questionType={subTaskType} 
              isPreview={true}
            />
         )}
        {taskType === 'connection' && (
          <TaskConnection
            words={selectedWords.map(wordId => userWords.find(word => word.id === wordId))}
            questionType={subTaskType as ConnectionType}
            isPreview={true}
          />
        )}
        </CardContent>
      </Card>

      <Button 
        className="mt-4 w-full" 
        disabled={!selectedLesson || selectedWords.length === 0}
        onClick={handleSubmit}
      >
        Create Task
      </Button>
    </div>
  );
}