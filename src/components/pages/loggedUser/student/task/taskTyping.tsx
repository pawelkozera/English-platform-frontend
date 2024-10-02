import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Volume2 } from "lucide-react"
import { Word } from "@/lib/types"

type QuestionType = "translation" | "reverseTranslation" | "image" | "retyping" | "audio"

interface LanguageLearningProps {
  words: Word[]
  questionType: QuestionType
}

export function TaskTyping({ words, questionType }: LanguageLearningProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const currentWord = words[currentWordIndex]

  useEffect(() => {
    setUserInput("")
    setIsCorrect(null)
    setHasSubmitted(false)
  }, [currentWordIndex, questionType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let correct = false

    switch (questionType) {
      case "translation":
        correct = userInput.toLowerCase().trim() === currentWord.translation.toLowerCase().trim()
        break
      case "reverseTranslation":
        correct = userInput.toLowerCase().trim() === currentWord.word.toLowerCase().trim()
        break
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
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    setIsCorrect(null)
    setHasSubmitted(false)
  }

  const renderQuestion = () => {
    switch (questionType) {
      case "translation":
        return <p className="text-2xl font-semibold mb-4">{currentWord.word}</p>
      case "reverseTranslation":
        return <p className="text-2xl font-semibold mb-4">{currentWord.translation}</p>
      case "image":
        return (
          <img
            src={currentWord.imageFilePath || "/placeholder.svg?height=200&width=200"}
            alt="Word representation"
            className="w-48 h-48 object-cover mb-4"
          />
        )
      case "retyping":
        return <p className="text-2xl font-semibold mb-4">{currentWord.word}</p>
      case "audio":
        return (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              console.log("Playing audio:", currentWord.audioFilePath)
            }}
          >
            <Volume2 className="h-4 w-4" />
            <span className="sr-only">Play audio</span>
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-md mx-auto bg-background p-8 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          {renderQuestion()}
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
      {isCorrect !== null && hasSubmitted && (
        <div className={`mt-6 p-3 text-center rounded-md ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {isCorrect ? "Correct!" : `Incorrect. The correct answer is: ${questionType === "translation" ? currentWord.translation : currentWord.word}.`}
        </div>
      )}
    </div>
  )
}