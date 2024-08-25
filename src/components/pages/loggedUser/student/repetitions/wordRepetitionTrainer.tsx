import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function WordRepetitionTrainer() {
  const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showAnswer, setShowAnswer] = useState(false)
  const [showRatingButtons, setShowRatingButtons] = useState(false)

  const [words, setWords] = useState([
    { id: 1, word: "Bonjour", translation: "Hello", image: "https://porysunki.com/environment/cache/images/500_500_productGfx_1344/bonjour.jpg" },
    { id: 2, word: "Merci", translation: "Thank you", image: null },
    { id: 3, word: "Au revoir", translation: "Goodbye", image: "/placeholder.svg?height=100&width=100" },
  ])  

  const [currentWord, setCurrentWord] = useState(words[0])
  const [wordsLength] = useState(words.length)
  const progress = ((correctAnswerCounter + 1) / wordsLength) * 100

  const checkAnswer = () => {
    setShowAnswer(true)
    setShowRatingButtons(true)
  }

  const showHint = () => {
    if (userAnswer.length === 0) {
      setUserAnswer(currentWord.translation[0])
      return
    }
    else if (userAnswer === currentWord.translation) {
      return
    }

    for (let i = 0; i < userAnswer.length; i++) {
      if (userAnswer[i] !== currentWord.translation[i]) {
        setUserAnswer(currentWord.translation.slice(0, i+1))
        return
      }
    }

    setUserAnswer(userAnswer + currentWord.translation.slice(userAnswer.length, userAnswer.length + 1));
  }

  const handleRating = (rating: string) => {
    let newWords: typeof words = words;
    if (rating === "Great") {
      newWords = words.filter(word => word.id !== currentWord.id)
      setWords(newWords)
      setCorrectAnswerCounter(correctAnswerCounter + 1)
    }
    nextWord(newWords)
  }

  const nextWord = (newWords: typeof words) => {
    if (newWords.length > 0) {
      setUserAnswer("")
      setShowAnswer(false)
      setShowRatingButtons(false)
      const randomIndex: number = Math.floor(Math.random() * newWords.length);
      setCurrentWord(newWords[randomIndex])
    }
  }

  const highlightMistakes = (correct: string, attempt: string) => {
    return correct.split('').map((char, index) => (
      <span key={index} className={char.toLowerCase() !== attempt[index]?.toLowerCase() ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
        {char}
      </span>
    ))
  }

  return (
    <div className="w-2/3 mx-auto mt-10 p-6 bg-secondary rounded-lg shadow-lg">
      {(words.length > 0 && currentWord) ? (
        <>
          <p className="mb-2"> {correctAnswerCounter + 1} / {wordsLength}</p>
          <Progress value={progress} className="mb-6" />
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">{currentWord.word}</h2>
            {currentWord.image && (
              <img src={currentWord.image} alt={currentWord.word} className="w-fit h-fit mx-auto object-cover mb-4 rounded" />
            )}
          </Card>
          <Card className="p-6 mb-6">
            <Input
              type="text"
              placeholder="Type your answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="mb-4"
            />
            {showAnswer && (
              <div className="mb-4">
                <p className="font-semibold">Correct answer:</p>
                <p>{highlightMistakes(currentWord.translation, userAnswer)}</p>
              </div>
            )}
            {!showRatingButtons ? (
              <div className="flex justify-center">
                <Button onClick={showHint} variant="orange" className="w-1/3 m-4">Hint</Button>
                <Button onClick={checkAnswer} variant="green" className="w-1/3 m-4">Check</Button>
              </div>
            ) : (
              <div className="flex justify-between">
                <Button onClick={() => handleRating("Poor")} variant="destructive" className="w-1/3 m-4">Poor</Button>
                <Button onClick={() => handleRating("So-so")} variant="orange" className="w-1/3 m-4">So-so</Button>
                <Button onClick={() => handleRating("Great")} variant="green" className="w-1/3 m-4">Great</Button>
              </div>
            )}
          </Card>
        </>
      ) : (
        <>
          <Card className="p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold mb-4">&#127881; Congratulations! &#127881;</h2>
            <p className="text-lg">&#127880; You've completed all your reviews for today. &#127880;</p>
            <p className="text-lg">&#128039; Keep up the great work and continue practicing to improve even more! &#128039;</p>
          </Card>
          <img src={"https://cdn.pixabay.com/photo/2013/07/12/18/47/penguins-153879_960_720.png"} alt="Congratulations" className="w-fit h-fit mx-auto object-cover mb-4 rounded" />
        </>
      )}
    </div>
  )
}