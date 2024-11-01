import { useState } from 'react'
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
  const [completedTasks, setCompletedTasks] = useState<boolean[]>(new Array(tasks.length).fill(false))
  
  const currentTask = tasks[currentTaskIndex]
  const isLastTask = currentTaskIndex === tasks.length - 1

  const handleTaskComplete = () => {  
    const newCompletedTasks = [...completedTasks];
    newCompletedTasks[currentTaskIndex] = true;
    setCompletedTasks(newCompletedTasks);
  
    if (!isLastTask) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  }

  const handleFinish = () => {
    console.log("Exam finished!")
    tasks.forEach(task => {
      localStorage.removeItem(`task-${task.id}`);
    });
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
            />
          ) : (
            <TaskConnection
              words={currentTask.words}
              questionType={currentTask.taskSubTypeName as ConnectionType}
              onComplete={handleTaskComplete}
              isExam={true}
              taskId={currentTask.id}
            />
          )}

          {isLastTask && (
            <Button className="mt-4" onClick={handleFinish}>
              Finish Exam
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}