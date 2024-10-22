import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Word, TypingType } from '@/lib/types'

interface TaskTypingProps {
  words: Word[]
  questionType: TypingType
  onComplete?: () => void
  isPreview?: boolean 
}

export default function TaskTypingExam({ words, questionType, onComplete, isPreview = false }: TaskTypingProps) {
  const [userInputs, setUserInputs] = useState<string[]>(Array(words.length).fill(''))
  const inputRefs = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    const newInputs = [...userInputs]
    newInputs[index] = value
    setUserInputs(newInputs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const results = words.map((word, index) => {
      const userInput = userInputs[index].toLowerCase().trim()
      let correct = false

      switch (questionType) {
        case "translation":
          correct = userInput === word.translation.toLowerCase().trim()
          break
        case "reverseTranslation":
          correct = userInput === word.word.toLowerCase().trim()
          break
        case "image":
        case "audio":
        case "retyping":
          correct = userInput === word.word.toLowerCase().trim()
          break
      }
      return { word, correct }
    })

    console.log(results)
    if (onComplete) onComplete()
  }

  const renderQuestion = (word: Word, index: number) => {
    switch (questionType) {
      case "translation":
        return <p className="text-lg font-semibold mb-2">Translate: {word.word}</p>
      case "reverseTranslation":
        return <p className="text-lg font-semibold mb-2">What's the original word for: {word.translation}</p>
      case "image":
        return (
          <div className="mb-2">
            <p className="text-lg font-semibold mb-2">What's in this image?</p>
            <img src={word.imageFilePath} alt="Question image" width={200} height={200} className="rounded-md" />
          </div>
        )
      case "audio":
        return (
          <div className="mb-2">
            <p className="text-lg font-semibold mb-2">What word do you hear?</p>
          </div>
        )
      case "retyping":
        return <p className="text-lg font-semibold mb-2">Retype: {word.word}</p>
    }
  }

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
          <Button type="submit" className="w-full mt-4">
            Submit Answers
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}