import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchRepetitionWordsByGroup, updateRepetitions } from "@/lib/api/repetitionApi";
import { useUser } from "@/components/utils/UserContext";
import { RepetitionUpdateRequest } from "@/lib/types";
import { baseURL } from "@/interceptor/axios-interceptor";

type Word = {
  repetitionWordId: number;
  word: string;
  translation: string;
  imageFilePath: string | null;
  audioFilePath: string | null;
};

export function WordRepetitionTrainer() {
  const { repetitionCounts, selectedGroup, updateRepetitionCountForGroup, fetchAndSetRepetitionCount } = useUser();
  const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [showRatingButtons, setShowRatingButtons] = useState(false);
  const [ratingCache, setRatingCache] = useState<Map<number, number>>(new Map());
  const [progress, setProgress] = useState(0);
  const [wordsLength, setWordsLength] = useState(0);

  const { data: fetchedWords, isLoading } = useQuery(
    ["repetitionWords", selectedGroup?.id],
    () =>
      fetchRepetitionWordsByGroup({
        groupId: selectedGroup?.id || 0,
        answeredWordIds: [],
        limit: 30,
      }),
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
      onSuccess: () => {
        if (selectedGroup) {
          fetchAndSetRepetitionCount(selectedGroup.id, true);
          setWordsLength(repetitionCounts[selectedGroup.id]);
        }
      }
    }
  );

  const [words, setWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);

  const [correctAnswers, setCorrectAnswers] = useState<
    { repetitionWordId: number; word: string; translation: string }[]
  >([]);

  const mutation = useMutation(updateRepetitions, {
    onSuccess: (data) => {
      console.log("Repetition updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating repetition:", error);
    }
  });

  useEffect(() => {
    if (correctAnswers.length >= 5 && selectedGroup) {
      sendUpdateRequests();
      setCorrectAnswers([]);
      fetchMoreWords();
      updateRepetitionCountForGroup(selectedGroup.id, repetitionCounts[selectedGroup.id] - 1);
    }
    else if (words.length === 0 && correctAnswers.length > 0 && selectedGroup) {
      sendUpdateRequests();
      setCorrectAnswers([]);
      updateRepetitionCountForGroup(selectedGroup.id, 0);
    }
  }, [correctAnswers, words]);

  const sendUpdateRequests = () => {
    const updateRequests: RepetitionUpdateRequest[] = correctAnswers
      .map((answer) => {
        const grade = ratingCache.get(answer.repetitionWordId);
  
        if (grade === undefined) {
          return null;
        }
  
        return {
          repetitionWordId: answer.repetitionWordId,
          grade: grade,
        };
      })
      .filter((request) => request !== null);
  
    if (updateRequests.length > 0) {
      mutation.mutate(updateRequests);
    }
  };

  const fetchMoreWords = async () => {
    try {
      const answeredWordIds = [
        ...words.map((word) => word.repetitionWordId),
        ...correctAnswers.map((answer) => answer.repetitionWordId),
      ];
      const newWords = await fetchRepetitionWordsByGroup({
        groupId: 1,
        answeredWordIds,
        limit: 10,
      });
      setWords((prevWords) => [...prevWords, ...newWords]);
    } catch (error) {
      console.error("Error fetching more words:", error);
    }
  };  

  useEffect(() => {
    if (fetchedWords?.length) {
      setWords((prevWords) => {
        const existingIds = new Set(prevWords.map((word) => word.repetitionWordId));
        const uniqueWords = fetchedWords.filter((word: Word) => !existingIds.has(word.repetitionWordId));
        return [...prevWords, ...uniqueWords];
      });
      if (!currentWord && fetchedWords.length > 0) {
        setCurrentWord(fetchedWords[0]);
      }
    }
  }, [fetchedWords]);

  useEffect(() => {
    let wordsLength = 0;
    if (selectedGroup) {
      wordsLength = repetitionCounts[selectedGroup.id];
    }
    setWordsLength(wordsLength);
  }, []);

  useEffect(() => {
    setProgress((correctAnswerCounter / wordsLength) * 100);
  }, [correctAnswerCounter]);

  const checkAnswer = () => {
    if (currentWord) {
      setShowAnswer(true);
      setShowRatingButtons(true);
    }
  };

  const showHint = () => {
    if (userAnswer.length === 0 && currentWord) {
      setUserAnswer(currentWord.word[0]);
      return;
    } else if (userAnswer === currentWord?.word) {
      return;
    }

    for (let i = 0; i < userAnswer.length; i++) {
      if (userAnswer[i] !== currentWord!.word[i]) {
        setUserAnswer(currentWord!.word.slice(0, i + 1));
        return;
      }
    }

    setUserAnswer(
      userAnswer + currentWord!.word.slice(userAnswer.length, userAnswer.length + 1)
    );
  };

  const handleRating = (rating: string) => {
    if (currentWord) {
      let newWords = words;
      if (rating === "Great" || rating === "So-so") {
        newWords = words.filter((word) => word.repetitionWordId !== currentWord.repetitionWordId);
        setWords(newWords);
        setCorrectAnswerCounter(correctAnswerCounter + 1);
        setCorrectAnswers((prev) => [
          ...prev,
          { repetitionWordId: currentWord.repetitionWordId, word: currentWord.word, translation: currentWord.translation },
        ]);
      }

      if (!ratingCache.has(currentWord.repetitionWordId)) {
        let numberRating = 1;
        if (rating === "So-so") {
          numberRating = 2;
        }
        else if (rating === "Great") {
          numberRating = 3;
        }
        
        setRatingCache(new Map(ratingCache.set(currentWord.repetitionWordId, numberRating)));
      }

      nextWord(newWords);
    }
  };

  const nextWord = (newWords: typeof words) => {
    if (newWords.length > 0) {
      setUserAnswer("");
      setShowAnswer(false);
      setShowRatingButtons(false);
      const randomIndex: number = Math.floor(Math.random() * newWords.length);
      setCurrentWord(newWords[randomIndex]);
    }
  };

  const highlightMistakes = (correct: string, attempt: string) => {
    return correct.split("").map((char, index) => (
      <span
        key={index}
        className={
          char.toLowerCase() !== attempt[index]?.toLowerCase()
            ? "text-red-500 font-bold"
            : "text-green-500 font-bold"
        }
      >
        {char}
      </span>
    ));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-2/3 mx-auto mt-10 p-6 bg-secondary rounded-lg shadow-lg">
      {wordsLength > 0 && (
        <>
          <p className="mb-2">
            {correctAnswerCounter} / {wordsLength}
          </p>
          <Progress value={progress} className="mb-6" />
        </>
      )}
      {words.length > 0 && currentWord ? (
        <>
          <Card className="p-6 mb-6 flex flex-col items-center">
            {currentWord.imageFilePath && (
              <img
                src={baseURL + "/" + currentWord.imageFilePath}
                alt={currentWord.word}
                className="mx-auto object-cover mb-4 rounded max-h-96"
              />
            )}

            <h2 className="text-2xl font-bold mb-4">{currentWord.translation}</h2>

            <audio controls className="mt-2">
              <source
                src={baseURL + "/" + currentWord.audioFilePath}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
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
                <p>{highlightMistakes(currentWord.word, userAnswer)}</p>
              </div>
            )}
            {!showRatingButtons ? (
              <div className="flex justify-center">
                <Button
                  onClick={showHint}
                  variant="orange"
                  className="w-1/3 m-4"
                  disabled={mutation.isLoading}
                >
                  Hint
                </Button>
                <Button
                  onClick={checkAnswer}
                  variant="green"
                  className="w-1/3 m-4"
                  disabled={mutation.isLoading}
                >
                  Check
                </Button>
              </div>
            ) : (
              <div className="flex justify-between">
                <Button
                  onClick={() => handleRating("Poor")}
                  variant="destructive"
                  className="w-1/3 m-4"
                  disabled={mutation.isLoading}
                >
                  Poor
                </Button>
                <Button
                  onClick={() => handleRating("So-so")}
                  variant="orange"
                  className="w-1/3 m-4"
                  disabled={mutation.isLoading}
                >
                  So-so
                </Button>
                <Button
                  onClick={() => handleRating("Great")}
                  variant="green"
                  className="w-1/3 m-4"
                  disabled={mutation.isLoading}
                >
                  Great
                </Button>
              </div>
            )}
          </Card>
        </>
      ) : (
        <>
          <Card className="p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold mb-4">&#127881; Congratulations! &#127881;</h2>
            <p className="text-lg">
              &#127880; You've completed all your reviews for today. &#127880;
            </p>
            <p className="text-lg">
              &#128039; Keep up the great work and continue practicing to improve
              even more! &#128039;
            </p>
          </Card>
          <img
            src={
              "https://cdn.pixabay.com/photo/2013/07/12/18/47/penguins-153879_960_720.png"
            }
            alt="Congratulations"
            className="w-fit h-fit mx-auto object-cover mb-4 rounded"
          />
        </>
      )}
    </div>
  );
}