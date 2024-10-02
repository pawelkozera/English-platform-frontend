import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from 'lucide-react'
import { Word } from '@/lib/types';

const words: Word[] = [
  { id: 1, word: "Hello", translation: "Hola", audioFilePath: "", imageFilePath: "" },
  { id: 2, word: "Goodbye", translation: "Adiós", audioFilePath: "", imageFilePath: "" },
  { id: 3, word: "Thank you", translation: "Gracias", audioFilePath: "", imageFilePath: "" },
  { id: 4, word: "Please", translation: "Por favor", audioFilePath: "", imageFilePath: "" },
]

const availableColors = ['blue', 'green', 'red', 'purple', 'orange']

export function TaskConnection() {
  const [selectedPair, setSelectedPair] = useState<[number, number] | null>(null)
  const [connections, setConnections] = useState<[number, number][]>([])
  const [checkResult, setCheckResult] = useState<boolean | null>(null)
  const [usedColors, setUsedColors] = useState<string[]>([])
  const [freeColors, setFreeColors] = useState<string[]>([...availableColors])

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
    const isCorrect = connections.every(([englishIndex, translationIndex]) =>
      words[englishIndex].translation === words[translationIndex].translation
    )
    setCheckResult(isCorrect)
  }

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
          {words.map((word, index) => (
            <div
              key={`english-${index}`}
              className="mb-4 p-3 border rounded cursor-pointer text-center"
              style={{ backgroundColor: getBlockColor(index, true) }}
              onClick={() => handleBlockClick(index, true)}
            >
              {word.word}
            </div>
          ))}
        </div>
        <div className="w-1/2 pl-4">
          {words.map((word, index) => (
            <div
              key={`translation-${index}`}
              className="mb-4 p-3 border rounded cursor-pointer text-center"
              style={{ backgroundColor: getBlockColor(index, false) }}
              onClick={() => handleBlockClick(index, false)}
            >
              {word.translation}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-center">
        <Button onClick={checkAnswers} className="px-6 py-2">
          Check Answers
        </Button>
        {checkResult !== null && (
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