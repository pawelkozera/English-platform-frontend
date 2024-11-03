import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskConnection } from '../task/taskConnection'
import { TaskTypingExam } from '../task/taskTypingExam'
import { TypingType, ConnectionType, TaskResponse } from '@/lib/types'

interface TestsTaskProps {
  tasks: TaskResponse[]
}

export function TestsTask({ tasks }: TestsTaskProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<boolean[]>(() => {
    const storedCompletedTasks = localStorage.getItem('completedTasks');
    return storedCompletedTasks ? JSON.parse(storedCompletedTasks) : new Array(tasks.length).fill(false);
  });
  
  const currentTask = tasks[currentTaskIndex]
  const isLastTask = currentTaskIndex === tasks.length - 1

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prevIndex => prevIndex - 1);
    }
  }

  const handleTaskComplete = () => {  
    handleMarkAsDone();
    handleNextTask();
  }

  const handleNextTask = () => {
    if (isLastTask) {
      return;
    }
    setCurrentTaskIndex(prevIndex => prevIndex + 1);
  }

  const handleMarkAsDone = () => {
    if (!completedTasks[currentTaskIndex]) {
      const newCompletedTasks = [...completedTasks];
      newCompletedTasks[currentTaskIndex] = true;
      setCompletedTasks(newCompletedTasks);
    }
  }

  const handleFinish = () => {
    console.log("Exam finished!")
    tasks.forEach(task => {
      localStorage.removeItem(`task-${task.id}`);
    });
    localStorage.removeItem('completedTasks');
  }

  const navigateToTask = (index: number) => {
    setCurrentTaskIndex(index)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        {tasks.map((_, index) => (
          <Button
            key={index}
            variant={completedTasks[index] ? "default" : "outline"}
            className={`w-10 h-10 ${currentTaskIndex === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => navigateToTask(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Question {currentTaskIndex + 1} of {tasks.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentTask.taskTypeName === 'typing' ? (
            <TaskTypingExam
              words={currentTask.words}
              questionType={currentTask.taskSubTypeName as TypingType}
              onComplete={handleTaskComplete}
              taskId={currentTask.id}
              onMarkAsDone={handleMarkAsDone}
            />
          ) : (
            <TaskConnection
              words={currentTask.words}
              questionType={currentTask.taskSubTypeName as ConnectionType}
              onComplete={handleTaskComplete}
              isExam={true}
              taskId={currentTask.id}
              onMarkAsDone={handleMarkAsDone}
            />
          )}

          <div className="flex gap-4 mt-4 justify-center">
            {currentTaskIndex > 0 && (
              <Button onClick={handlePreviousTask}>
                Previous Question
              </Button>
            )}

            {!isLastTask && (
              <Button onClick={handleNextTask}>
                Next Question
              </Button>
            )}

            {isLastTask && (
              <Button onClick={handleFinish} variant={"green"}>
                Finish Exam
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}