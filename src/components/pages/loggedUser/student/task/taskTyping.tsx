import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Word } from "@/lib/types"
import { TypingType } from "@/lib/types"
import { RepetitionButton } from "../repetitions/repetitionButton"
import { baseURL } from "@/interceptor/axios-interceptor"

interface TaskTypingProps {
  words: Word[]
  questionType: TypingType
  onComplete?: () => void
  isPreview?: boolean 
}

export function TaskTyping({ words, questionType, onComplete, isPreview = false }: TaskTypingProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [completedWords, setCompletedWords] = useState<number[]>([])

  useEffect(() => {
    setCurrentWordIndex(0)
    setCompletedWords([])
    setUserInput("")
    setIsCorrect(null)
    setHasSubmitted(false)
  }, [words])

  const availableWords = words.filter((_, index) => !completedWords.includes(index))
  const progress = ((words.length - availableWords.length) / words.length) * 100

  useEffect(() => {
    if (availableWords.length === 0) {
      setCurrentWordIndex(0)
    } else if (currentWordIndex >= availableWords.length) {
      setCurrentWordIndex(0)
    }
  }, [availableWords, currentWordIndex])

  const currentWord = availableWords.length > 0 ? availableWords[currentWordIndex] : null

  useEffect(() => {
    if (currentWord) {
      setUserInput("")
      setIsCorrect(null)
      setHasSubmitted(false)
    }
  }, [currentWordIndex, questionType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentWord) return

    let correct = false

    switch (questionType) {
      case "translation":
        correct = userInput.toLowerCase().trim() === currentWord.translation.toLowerCase().trim()
        break
      case "reverseTranslation":
      case "image":
      case "audio":
      case "retyping":
        correct = userInput.toLowerCase().trim() === currentWord.word.toLowerCase().trim()
        break
    }

    setIsCorrect(correct)
    setHasSubmitted(true)
  }

  const handleNext = () => {
    if (currentWord && isCorrect) {
      setCompletedWords((prev) => [...prev, words.indexOf(currentWord)])
    }

    if (availableWords.length - 1 === 0 && !isPreview && onComplete && isCorrect) {
      onComplete()
    } else if (availableWords.length > 0) {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % availableWords.length)
    }

    setIsCorrect(null)
    setHasSubmitted(false)
  }

  const renderQuestion = () => {
    if (!currentWord) return null

    switch (questionType) {
      case "translation":
        return (
          <div>
            <img
              src={baseURL + "/" + currentWord.imageFilePath || "/placeholder.svg?height=200&width=200"}
              alt="Word representation"
              className="w-48 h-48 object-cover mb-4"
            />
            <p className="text-2xl font-semibold mb-4">{currentWord.word}</p>
          </div>
        )
      case "reverseTranslation":
        return (
          <div>
            <img
              src={baseURL + "/" + currentWord.imageFilePath || "/placeholder.svg?height=200&width=200"}
              alt="Word representation"
              className="w-48 h-48 object-cover mb-4"
            />
            <p className="text-2xl font-semibold mb-4">{currentWord.translation}</p>
          </div>
        )
      case "retyping":
        return (
          <div>
            <img
              src={baseURL + "/" + currentWord.imageFilePath || "/placeholder.svg?height=200&width=200"}
              alt="Word representation"
              className="w-48 h-48 object-cover mb-4"
            />
            <p className="text-2xl font-semibold mb-4">{currentWord.word}</p>
          </div>
        )
      case "image":
        return (
          <img
            src={baseURL + "/" + currentWord.imageFilePath || "/placeholder.svg?height=200&width=200"}
            alt="Word representation"
            className="w-48 h-48 object-cover mb-4"
          />
        )
      case "audio":
        return (
            <audio controls className="mt-2 mb-8">
              <source
                src={baseURL + "/" + currentWord.audioFilePath}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-md mx-auto bg-background p-8 rounded-xl shadow-lg">
      {words.length !== 0 && (
        <>
          <p className="mb-2">Progress: {words.length - availableWords.length} / {words.length}</p>
          <Progress value={progress} className="mb-6" />
        </>
      )}
      
      {words.length === 0 ? (
        <></>
      ) : availableWords.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {(() => {
            switch (questionType) {
              case "retyping":
                return <p>Retype</p>;
              case "image":
                return <p>What's in this image?</p>;
              case "audio":
                return <p>What do you hear?</p>;
              case "translation":
                return <p>Translate this word</p>;
              case "reverseTranslation":
                return <p>What's the original word for:</p>;
              default:
                return <p>Unknown question type</p>;
            }
          })()}

          <div className="flex flex-col items-center">
            {renderQuestion()}
            {currentWord?.id && (
              <RepetitionButton 
                wordId={currentWord.id} 
                isPreview={isPreview} 
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer" className="text-sm font-medium text-muted-foreground">Your answer:</Label>
            <Input
              id="answer"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer here"
              className="w-full"
            />
          </div>
          <div className="flex justify-between space-x-4">
            <Button type="submit" className="flex-1">Submit</Button>
            <Button
              onClick={handleNext}
              variant="outline"
              className="flex-1"
              disabled={!hasSubmitted}
            >
              Next
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center">You've completed all the words!</div>
      )}
      {isCorrect !== null && hasSubmitted && (
        <div className={`mt-6 p-3 text-center rounded-md ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${questionType === "translation" ? currentWord?.translation : currentWord?.word}.`}
        </div>
      )}
    </div>
  )
}