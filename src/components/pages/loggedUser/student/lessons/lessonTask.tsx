import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskConnection } from '../task/taskConnection'
import { TaskTyping } from '../task/taskTyping'
import { TypingType, ConnectionType } from '@/lib/types'

interface WordResponse {
  id: number
  word: string
  translation: string
  audioFilePath: string
  imageFilePath: string
}

interface TaskResponse {
  id: number
  taskTypeName: string
  taskSubTypeName: string
  content: string
  correctAnswer: string
  words: WordResponse[]
}

interface LessonTasksProps {
  tasks: TaskResponse[]
}

export function LessonTask({ tasks }: LessonTasksProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const currentTask = tasks[currentTaskIndex]
  const isLastTask = currentTaskIndex === tasks.length - 1

  const handleNextTask = () => {
    if (isLastTask) {
      return
    }
    setCurrentTaskIndex(prevIndex => prevIndex + 1)
    setUserAnswer('')
    setIsCorrect(null)
  }

  const handleTaskComplete = () => {
    setIsCorrect(true)
    handleNextTask()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correct = userAnswer.toLowerCase() === currentTask.correctAnswer.toLowerCase()
    setIsCorrect(correct)
    if (correct && !isLastTask) {
      setTimeout(handleNextTask, 1500)
    }
  }

  if (isLastTask && isCorrect) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Lesson Completed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Congratulations! You have completed all tasks in this lesson.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Task {currentTaskIndex + 1} of {tasks.length}</CardTitle>
      </CardHeader>
      <CardContent>
        {isCorrect !== null && (
          <p className={`mt-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
          </p>
        )}

        {currentTask.taskTypeName === 'typing' ? (
          <TaskTyping
            words={currentTask.words}
            questionType={currentTask.taskSubTypeName as TypingType}
            onComplete={handleTaskComplete}
          />
        ) : (
          <TaskConnection
            words={currentTask.words}
            questionType={currentTask.taskSubTypeName as ConnectionType}
            onComplete={handleTaskComplete}
          />
        )}
      </CardContent>
    </Card>
  )
}