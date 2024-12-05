import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { fetchWordsOwnedByUser, deleteWordById } from "@/lib/api/wordApi";
import { WordSelection } from "../taskCreator/wordSelection";
import { Pagination } from "@/components/common/pagination";
import { baseURL } from "@/interceptor/axios-interceptor";

export function DeleteWord() {
  const [userWords, setUserWords] = useState<any[]>([]);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, _setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWordDetails, setSelectedWordDetails] = useState<{
    word: string;
    translation: string;
    audioFilePath: string | null;
    imageFilePath: string | null;
  } | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchWords = async () => {
    try {
      const response = await fetchWordsOwnedByUser(currentPage, pageSize);

      if (response && response._embedded && response._embedded.wordResponseList) {
        setUserWords(response._embedded.wordResponseList);
        setTotalPages(response.page.totalPages);
      } else {
				setUserWords([]);
        console.error("No words found");
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (selectedWords.length === 1) {
      const selectedWord = userWords.find((word) => word.id === selectedWords[0]);
      if (selectedWord) {
        setSelectedWordDetails({
          word: selectedWord.word,
          translation: selectedWord.translation,
          audioFilePath: selectedWord.audioFilePath || null,
          imageFilePath: selectedWord.imageFilePath || null,
        });
      }
    } else {
      setSelectedWordDetails(null);
    }
  }, [selectedWords, userWords]);

  const deleteMutation = useMutation((wordId: number) => deleteWordById(wordId), {
    onSuccess: () => {
      console.log("Word deleted successfully");
      setSelectedWords([]);
      fetchWords();
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An unexpected error occurred while deleting the word.");
      }
    },
  });

  const handleDelete = () => {
    if (selectedWords.length !== 1) {
      setErrorMessage("Please select exactly one word to delete.");
      return;
    }

    deleteMutation.mutate(selectedWords[0]);
  };

  const handleWordSelection = (wordId: number) => {
    setSelectedWords((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [wordId]
    );
		setErrorMessage(null);
  };

  return (
    <div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Select Words</CardTitle>
        </CardHeader>
        <CardContent>
          <WordSelection
            userWords={userWords}
            selectedWords={selectedWords}
            onWordSelection={handleWordSelection}
          />
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

			{errorMessage && (
        <div className="text-red-500 text-center mt-4">{errorMessage}</div>
      )}

      {selectedWordDetails && (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle>Word Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="font-semibold">{selectedWordDetails.word}</p>
						<p className="text-sm text-gray-500">{selectedWordDetails.translation}</p>
            {selectedWordDetails.imageFilePath && (
              <img
                src={baseURL + '/' + selectedWordDetails.imageFilePath}
                alt="Word"
                className="mt-4"
              />
            )}
            {selectedWordDetails.audioFilePath && (
              <audio controls className="mt-4">
                <source src={baseURL + '/' + selectedWordDetails.audioFilePath} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}