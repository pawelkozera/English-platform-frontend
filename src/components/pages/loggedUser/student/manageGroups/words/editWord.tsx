import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "react-query";
import { editWord } from "@/lib/api/wordApi";
import { fetchWordsOwnedByUser } from "@/lib/api/wordApi";
import { WordSelection } from "../taskCreator/wordSelection";
import { Pagination } from "@/components/common/pagination";
import { baseURL } from "@/interceptor/axios-interceptor";

export function EditWord() {
  const [word, setWord] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  const [imageFilePath, setImageFilePath] = useState<string | null>(null);
  const [userWords, setUserWords] = useState<any[]>([]);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

	const fetchWords = async () => {
		try {
			const response = await fetchWordsOwnedByUser(currentPage, pageSize);

			if (response && response._embedded && response._embedded.wordResponseList) {
				setUserWords(response._embedded.wordResponseList);
				setTotalPages(response.page.totalPages);
			} else {
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
        setWord(selectedWord.word);
        setTranslation(selectedWord.translation);
        setAudioFilePath(selectedWord.audioFilePath || null);
        setImageFilePath(selectedWord.imageFilePath || null);
      }
    } else {
      setWord("");
      setTranslation("");
      setAudioFilePath(null);
      setImageFilePath(null);
    }
  }, [selectedWords, userWords]);

  const mutation = useMutation(({ wordId, formData }: { wordId: number; formData: FormData }) => editWord(wordId, formData), {
    onSuccess: () => {
      console.log("Word edited successfully");
      setWord("");
      setTranslation("");
      setAudioFile(null);
      setImageFile(null);
      setSelectedWords([]);
			fetchWords();
    },
    onError: (error) => {
      console.error("Error during word editing", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedWords.length !== 1) {
      console.error("Please select exactly one word to edit.");
      return;
    }

    if (!word || !translation) {
      console.error("Please provide both a word and a translation.");
      return;
    }

    const wordId = selectedWords[0];

    const formData = new FormData();
    formData.append("word", word);
    formData.append("translation", translation);
    if (audioFile) formData.append("audioFile", audioFile);
    if (imageFile) formData.append("imageFile", imageFile);

    mutation.mutate({ wordId, formData });
  };

  const handleWordSelection = (wordId: number) => {
    setSelectedWords((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [wordId]
    );
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

      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Edit word</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label>Word</Label>
              <Input
                placeholder="Enter word"
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </div>

            <div>
              <Label>Translation</Label>
              <Input
                placeholder="Enter translation"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
              />
            </div>

            <div>
              <Label>Audio file (Optional)</Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex flex-col items-center">
              {audioFilePath && <audio controls src={baseURL + '/' + audioFilePath} />}
            </div>

            <div>
              <Label>Image file (Optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex flex-col items-center">
              {imageFilePath && <img src={baseURL + '/' + imageFilePath} alt="Selected word" className="mb-4" />}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center">
            <Button
              type="submit"
              disabled={mutation.isLoading || !word || !translation}
            >
              {mutation.isLoading ? "Editing..." : "Edit word"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}