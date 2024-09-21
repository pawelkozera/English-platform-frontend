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

  const mutation = useMutation(addWord, {
    onSuccess: (data) => {
      console.log("Word added successfully", data);
      setWord("");
      setTranslation("");
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

    mutation.mutate({
      word,
      translation,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Dodaj Nowe Słowo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label>Słowo</Label>
            <Input
              placeholder="Wpisz słowo"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>

          <div>
            <Label>Tłumaczenie</Label>
            <Input
              placeholder="Wpisz tłumaczenie"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isLoading || !word || !translation}
          >
            {mutation.isLoading ? "Dodawanie..." : "Dodaj Słowo"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
