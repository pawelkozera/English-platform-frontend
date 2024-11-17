import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TaskConnection } from '../task/taskConnection'
import { TaskTypingExam } from '../task/taskTypingExam'
import { TypingType, ConnectionType, TaskResponse } from '@/lib/types'
import { Word } from '@/lib/types'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { addTestHistory } from '@/lib/api/testHistory'
import { useSuspiciousActivity } from './hooks/useSuspiciousActivity'

interface TestsTaskProps {
  tasks: TaskResponse[]
  timeDuration: number
}

export function TestsTask({ tasks, timeDuration }: TestsTaskProps) {
  const navigate = useNavigate();
  const { testInstanceId } = useParams();
  const testInstanceIdNumber = Number(testInstanceId);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<boolean[]>(() => {
    const storedCompletedTasks = localStorage.getItem('completedTasks');
    return storedCompletedTasks ? JSON.parse(storedCompletedTasks) : new Array(tasks.length).fill(false);
  });

  const [timeRemaining, setTimeRemaining] = useState(timeDuration * 60);

  const addTestHistoryMutation = useMutation(addTestHistory, {
    onSuccess: () => {
      navigate(`/tests`);
    },
    onError: (error: unknown) => {
      console.error("Error completing task:", error);
    },
  });

  const onBackButtonEvent = (e: PopStateEvent) => {
    e.preventDefault();
    if (window.confirm("If you go back, test will end. \nAre you sure?")) {
      handleFinish();
    } else {
      window.history.pushState("", "", window.location.pathname);
    }
  }

  useEffect(() => {
      window.history.pushState("", "", window.location.pathname);

      window.addEventListener('popstate', onBackButtonEvent);

      return () => {
        window.removeEventListener('popstate', onBackButtonEvent);  
      };
  }, []);  

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeRemaining <= 0) {
        handleFinish();
        clearInterval(interval);
      } else {
        setTimeRemaining(prevTime => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);
  
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
    const score = countScore()
    removeItemsFromLocalStorage()

    addTestHistoryMutation.mutate(
      {
        testInstanceId: testInstanceIdNumber,
        score: score,
      }
    );
  }

  const countScore = (): number => {
    let score: number = 0;

    tasks.forEach((task) => {
      if (task.taskTypeName === "typing") {
        score += countScoreForTyping(task)
      }
      else if (task.taskTypeName === "connection") {
        score += countScoreForConnection(task)
      }
    });
    
    return score
  }

  const countScoreForTyping = (task: TaskResponse): number => {
    let userAnswer: string | null = localStorage.getItem(`task-${task.id}`);
    if (!userAnswer) {
      return 0;
    }
  
    const userAnswersArray: string[] = JSON.parse(userAnswer) as string[];
  
    let score = 0;
    userAnswersArray.forEach((userAnswer, index) => {
      switch (task.taskSubTypeName) {
        case "translation":
        case "image":
        case "audio":
        case "retyping":
          if (userAnswer === task.words[index].translation.toLowerCase().trim()) {
            score += task.score / task.words.length
          }
          break;
        case "reverseTranslation":
          if (userAnswer === task.words[index].word.toLowerCase().trim()) {
            score += task.score / task.words.length
          }
          break;
      }
    });
    
    return score;
  };
  

  const countScoreForConnection = (task: TaskResponse): number => {
    let userAnswer: string | null = localStorage.getItem(`task-${task.id}`);
    if (!userAnswer) {
      return 0;
    }
  
    const savedData: { 
      connections: [number, number][], 
      answers: Word[], 
      questions: Word[] 
    } = JSON.parse(userAnswer);
    
    if (!savedData.connections || !Array.isArray(savedData.connections) || savedData.connections.length !== savedData.answers.length) {
      return 0;
    }

    const { connections, answers, questions } = savedData;
    
    let score = 0;
    connections.forEach(([questionIndex, answerIndex]: [number, number]) => {
      if (questions[questionIndex].id === answers[answerIndex].id) {
        score += task.score / task.words.length
      }
    });
  
    return score;
  };
  
  const removeItemsFromLocalStorage = () => {
    tasks.forEach(task => {
      localStorage.removeItem(`task-${task.id}`);
    });
    localStorage.removeItem('completedTasks');
  }

  const navigateToTask = (index: number) => {
    setCurrentTaskIndex(index)
  }

  useSuspiciousActivity({
    testInstanceId: testInstanceIdNumber,
    countScore: countScore,
  });

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  let displayTime;
  let timeStyle = {};

  if (hours > 0) {
    displayTime = `${hours} hours ${minutes} minutes ${seconds} seconds`;
  } else if (minutes > 0) {
    displayTime = `${minutes} minutes ${seconds} seconds`;
  } else {
    displayTime = `${seconds} seconds`;
    timeStyle = { color: 'red' };
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
          <div className="flex justify-end">
            <span style={timeStyle}>
              {displayTime}
            </span>
          </div>

          <div className="flex justify-between items-center w-full">
            <CardTitle className="flex-grow text-center">Question {currentTaskIndex + 1} of {tasks.length}</CardTitle>
          </div>
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

          <p id="hidden-text-english" className="hidden">Dog</p>
          <p id="hidden-text-polish" className="hidden">Pies</p>
        </CardContent>
      </Card>
    </div>
  )
}