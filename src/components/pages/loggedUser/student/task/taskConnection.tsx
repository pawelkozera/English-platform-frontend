import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from 'lucide-react'
import { Word } from '@/lib/types';
import { ConnectionType } from '@/lib/types';
import { baseURL } from '@/interceptor/axios-interceptor';

const availableColors = ['blue', 'green', 'red', 'purple', 'orange']

interface TaskConnectionProps {
  words: Word[]
  questionType: ConnectionType
  onComplete?: () => void
  isPreview?: boolean 
  isExam?: boolean
  onCompleteExam?: (score: number) => void
  onMarkAsDone?: () => void
  taskId?: number
}

export function TaskConnection({ words, questionType, onComplete, isPreview = false, isExam = false, onCompleteExam, onMarkAsDone, taskId }: TaskConnectionProps) {
  const [selectedPair, setSelectedPair] = useState<[number, number] | null>(null)
  const [connections, setConnections] = useState<[number, number][]>([])
  const [checkResult, setCheckResult] = useState<boolean | null>(null)
  const [usedColors, setUsedColors] = useState<string[]>([])
  const [freeColors, setFreeColors] = useState<string[]>([...availableColors])

  const [dataWasLoaded, setDataWasLoaded] = useState(false);
  const [storageKey, setStorageKey] = useState<string>(() => {
    if (taskId) {
      return `task-${String(taskId)}`
    }
    return ''
  });

  const [questions, setQuestions] = useState<Word[]>([]);
  const [answers, setAnswers] = useState<Word[]>([]);

  const shuffleArray = ((array: Word[]) => {
    return array.slice().sort(() => Math.random() - 0.5);
  })

  useEffect(() => {
    setQuestions(shuffleArray(words));
    setAnswers(shuffleArray(words));
  }, [words]);

  useEffect(() => {
    if (storageKey) {
      const newStorageKey = taskId ? `task-${String(taskId)}` : '';
      setStorageKey(newStorageKey);
    
      if (newStorageKey) {
        const savedState = localStorage.getItem(newStorageKey);

        if (savedState) {
          const { connections, selectedPair, usedColors, freeColors, questions, answers } = JSON.parse(savedState);
          setConnections(connections);
          setSelectedPair(selectedPair);
          setUsedColors(usedColors);
          setFreeColors(freeColors);
          setQuestions(questions);
          setAnswers(answers);
        } 
        else {
          const shuffledQuestions = shuffleArray(words);
          const shuffledAnswers = shuffleArray(words);
          setQuestions(shuffledQuestions);
          setAnswers(shuffledAnswers);
          
          const stateToSave = {
            connections,
            selectedPair,
            usedColors,
            freeColors,
            questions: shuffledQuestions,
            answers: shuffledAnswers
          };
          localStorage.setItem(storageKey, JSON.stringify(stateToSave));
        }
      }

      setDataWasLoaded(true)
    }
  }, [taskId]);

  useEffect(() => {
    if (storageKey && dataWasLoaded) {
      const stateToSave = {
        connections,
        selectedPair,
        usedColors,
        freeColors,
        questions,
        answers
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));

      if (onMarkAsDone && connections.length > 0) {
        onMarkAsDone();
      }
    }
  }, [connections, selectedPair, usedColors, freeColors, storageKey]);

  const handleBlockClick = (index: number, isEnglish: boolean) => {
    const connectionIndex = connections.findIndex(conn =>
      (isEnglish && conn[0] === index) || (!isEnglish && conn[1] === index)
    );
  
    if (connectionIndex !== -1) {
      const updatedConnections = connections.filter((_, i) => i !== connectionIndex);
      const updatedUsedColors = usedColors.filter((_, i) => i !== connectionIndex);
      const removedColor = usedColors[connectionIndex];
  
      setConnections(updatedConnections);
      setUsedColors(updatedUsedColors);
      setFreeColors([...freeColors, removedColor]);
  
      if (isEnglish) {
        if (selectedPair && selectedPair[1] !== -1) {
          const newTranslationIndex = selectedPair[1];
          setConnections([...updatedConnections, [index, newTranslationIndex]]);
          setUsedColors([...updatedUsedColors, removedColor]);
          setFreeColors(freeColors.filter(color => color !== removedColor));
        }
      } else {
        if (selectedPair && selectedPair[0] !== -1) {
          const newEnglishIndex = selectedPair[0];
          setConnections([...updatedConnections, [newEnglishIndex, index]]);
          setUsedColors([...updatedUsedColors, removedColor]);
          setFreeColors(freeColors.filter(color => color !== removedColor));
        }
      }
      
      setSelectedPair(null);
    } else {
      if (selectedPair === null) {
        setSelectedPair([isEnglish ? index : -1, isEnglish ? -1 : index]);
      } else {
        const [englishIndex, translationIndex] = selectedPair;
        if (isEnglish && englishIndex === -1 && freeColors.length > 0) {
          const newColor = freeColors[0];
          setConnections([...connections, [index, translationIndex]]);
          setUsedColors([...usedColors, newColor]);
          setFreeColors(freeColors.slice(1));
          setSelectedPair(null);
        } else if (!isEnglish && translationIndex === -1 && freeColors.length > 0) {
          const newColor = freeColors[0];
          setConnections([...connections, [englishIndex, index]]);
          setUsedColors([...usedColors, newColor]);
          setFreeColors(freeColors.slice(1));
          setSelectedPair(null);
        } else {
          setSelectedPair([isEnglish ? index : -1, isEnglish ? -1 : index]);
        }
      }
    }
  }  

  const checkAnswers = () => {
    if (isExam && onComplete) {
      onComplete();
    }
  
    if (connections.length !== words.length) {
      setCheckResult(false);
      return;
    }
  
    const isCorrect = connections.every(([questionIndex, answerIndex]) =>
      questions[questionIndex].translation === answers[answerIndex].translation
    );
  
    setCheckResult(isCorrect);
  
    if (isCorrect && !isPreview) {
      if (isExam && onCompleteExam) {
        onCompleteExam(connections.length);
      } else if (onComplete) {
        onComplete();
      }
      resetTask();
    }
  };
  
  
  const resetTask = () => {
    setSelectedPair(null);
    setConnections([]);
    setCheckResult(null);
    setUsedColors([]);
    setFreeColors([...availableColors]);
  };

  const getBlockColor = (index: number, isEnglish: boolean) => {
    const connectionIndex = connections.findIndex(conn =>
      (isEnglish && conn[0] === index) || (!isEnglish && conn[1] === index)
    )

    if (selectedPair) {
      const [selectedEnglish, selectedTranslation] = selectedPair
      if ((isEnglish && selectedEnglish === index) || (!isEnglish && selectedTranslation === index)) {
        return 'yellow'
      }
    }

    return connectionIndex !== -1 ? usedColors[connectionIndex] : 'gray'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-8">
      <div className="w-1/2 pr-4">
          {questionType === 'translation' ? (
            questions.map((word, index) => (
              <div
                key={`english-${index}`}
                className="mb-4 p-3 border rounded cursor-pointer text-center"
                style={{ backgroundColor: getBlockColor(index, true) }}
                onClick={() => handleBlockClick(index, true)}
              >
                {word.word}
              </div>
            ))
          ) : (
            questions.map((word, index) => (
              <div
                key={`english-${index}`}
                className="mb-4 p-3 border rounded cursor-pointer text-center"
                style={{ backgroundColor: getBlockColor(index, true) }}
                onClick={() => handleBlockClick(index, true)}
              >
                {word.translation}
              </div>
            ))
          )}
        </div>

        <div className="w-1/2 pl-4">
          {questionType === 'translation' ? (
            answers.map((word, index) => (
              <div
                key={`translation-${index}`}
                className="mb-4 p-3 border rounded cursor-pointer text-center"
                style={{ backgroundColor: getBlockColor(index, false) }}
                onClick={() => handleBlockClick(index, false)}
              >
                {word.translation}
              </div>
            ))
          ) : (
            answers.map((word, index) => (
              <div
                key={`image-${index}`}
                className="mb-4 p-3 border rounded cursor-pointer text-center"
                style={{ backgroundColor: getBlockColor(index, false) }}
                onClick={() => handleBlockClick(index, false)}
              >
                <img src={baseURL + "/" + word.imageFilePath} alt={word.translation} className="max-h-60 mx-auto" />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        {words.length !== 0 && (
          <>
            {!isExam && (
              <Button onClick={checkAnswers} className="px-6 py-2">
                Check Answers
              </Button>
            )}
          </>
        )}
        {(checkResult !== null && words.length !== 0 && !isExam) && (
          <div className="mt-4 flex items-center justify-center">
            {checkResult ? (
              <>
                <CheckCircle className="text-green-500 mr-2" />
                <span className="text-green-500">Correct! All connections are right.</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500 mr-2" />
                <span className="text-red-500">Some connections are incorrect. Try again!</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}