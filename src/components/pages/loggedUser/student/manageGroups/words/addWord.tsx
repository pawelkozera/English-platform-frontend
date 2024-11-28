import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "react-query";
import { addWord } from "@/lib/api/wordApi";

export function AddWord() {
  const [word, setWord] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const mutation = useMutation(addWord, {
    onSuccess: (data) => {
      console.log("Word added successfully", data);
      setWord("");
      setTranslation("");
      setAudioFile(null);
      setImageFile(null);
    },
    onError: (error) => {
      console.error("Error during word creation", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!word || !translation) {
      console.error("Please provide both a word and a translation.");
      return;
    }

    const formData = new FormData();
    formData.append("word", word);
    formData.append("translation", translation);
    if (audioFile) formData.append("audioFile", audioFile);
    if (imageFile) formData.append("imageFile", imageFile);

    mutation.mutate(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Add new word</CardTitle>
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

          <div>
            <Label>Image file (Optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isLoading || !word || !translation}
          >
            {mutation.isLoading ? "Adding..." : "Add word"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
