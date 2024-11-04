import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Word, TypingType } from '@/lib/types'

interface TaskTypingProps {
  words: Word[]
  questionType: TypingType
  onComplete?: () => void
  onMarkAsDone?: () => void
  isPreview?: boolean 
  taskId?: number
}

export function TaskTypingExam({ words, questionType, onComplete, onMarkAsDone, isPreview = false, taskId }: TaskTypingProps) {
  const [storageKey, setStorageKey] = useState<string>(() => {
    if (taskId) {
      return `task-${String(taskId)}`
    }
    return ''
  });
  
  const [userInputs, setUserInputs] = useState<string[]>(() => {
    return Array(words.length).fill('');
  });

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const newStorageKey = taskId ? `task-${String(taskId)}` : '';
    setStorageKey(newStorageKey);
  
    if (newStorageKey) {
      const savedInputs = localStorage.getItem(newStorageKey);
  
      if (savedInputs && Array.isArray(JSON.parse(savedInputs))) {
        setUserInputs(JSON.parse(savedInputs));
      } else {
        setUserInputs(Array(words.length).fill(''));
      }
    } else {
      setUserInputs(Array(words.length).fill(''));
    }
  
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [taskId]);

  const handleChange = (index: number, value: string) => {
    if (Array.isArray(userInputs)) {
      const newInputs = [...userInputs];
      newInputs[index] = value;
      setUserInputs(newInputs);

      if (onMarkAsDone) {
        onMarkAsDone();
      }
  
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(newInputs));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const results = words.map((word, index) => {
      const userInput = userInputs[index].toLowerCase().trim();
      let correct = false;

      switch (questionType) {
        case "translation":
        case "image":
        case "audio":
        case "retyping":
          correct = userInput === word.translation.toLowerCase().trim();
          break;
        case "reverseTranslation":
          correct = userInput === word.word.toLowerCase().trim();
          break;
      }
      return { word, correct };
    });

    console.log(results);
    if (onComplete) {
      setUserInputs(Array(words.length).fill(''));
      onComplete();
    }
  };

  const renderQuestion = (word: Word, index: number) => {
    switch (questionType) {
      case "translation":
        return <p className="text-lg font-semibold mb-2">Translate: {word.word}</p>;
      case "reverseTranslation":
        return <p className="text-lg font-semibold mb-2">What's the original word for: {word.translation}</p>;
      case "image":
        return (
          <div className="mb-2">
            <p className="text-lg font-semibold mb-2">What's in this image?</p>
            <img src={word.imageFilePath} alt="Question image" width={200} height={200} className="rounded-md" />
          </div>
        );
      case "audio":
        return (
          <div className="mb-2">
            <p className="text-lg font-semibold mb-2">What word do you hear?</p>
          </div>
        );
      case "retyping":
        return <p className="text-lg font-semibold mb-2">Retype: {word.word}</p>;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Typing Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {words.map((word, index) => (
            <div key={index} className="mb-4">
              {renderQuestion(word, index)}
              <Input
                ref={(el) => (inputRefs.current[index] = el!)}
                type="text"
                value={userInputs[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Type your answer here"
                className="w-full mb-2"
              />
            </div>
          ))}
        </form>
      </CardContent>
    </Card>
  );
}