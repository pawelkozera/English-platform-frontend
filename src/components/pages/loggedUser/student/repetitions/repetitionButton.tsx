import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleMinus } from "lucide-react";
import { addWordToRepetitions, removeWordFromRepetitions } from "@/lib/api/repetitionApi";
import { useMutation } from "react-query";

interface RepetitionButtonProps {
  wordId: number;
}

export function RepetitionButton({ wordId }: RepetitionButtonProps) {
  const [isInRepetitions, setIsInRepetitions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addWordToRepetitionsMutation = useMutation(addWordToRepetitions, {
    onSuccess: () => {
      setIsInRepetitions(true);
      console.log("Added word to repetitions");
    },
    onError: (error) => {
      console.error("Error completing task:", error);
    },
  });

  const handleToggleRepetition = async () => {
    addWordToRepetitionsMutation.mutate({
      wordId: wordId,
    });
  };

  return (
    <Button
			type="button"
      onClick={handleToggleRepetition}
      disabled={isLoading}
      variant={isInRepetitions ? "outline" : "green"}
    >
      {isInRepetitions ? (
        <>
          <CircleMinus className="w-5 h-5 mr-2" /> Remove from Repetitions
        </>
      ) : (
        <>
          <CirclePlus className="w-5 h-5 mr-2" /> Add to Repetitions
        </>
      )}
    </Button>
  );
}