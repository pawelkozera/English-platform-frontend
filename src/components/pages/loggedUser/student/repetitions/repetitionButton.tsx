import { Button } from "@/components/ui/button";
import { CirclePlus, CircleMinus } from "lucide-react";
import { addWordToRepetitions, removeWordFromRepetitions, fetchIsWordInRepetitions } from "@/lib/api/repetitionApi";
import { useMutation, useQuery } from "react-query";
import { useUser } from "@/components/utils/UserContext";

interface RepetitionButtonProps {
  wordId: number;
  isPreview?: boolean;
}

export function RepetitionButton({ wordId, isPreview = false }: RepetitionButtonProps) {
  const { selectedGroup } = useUser();

  const { data: isInRepetitions, isLoading, refetch } = useQuery(
    ['wordInRepetitions', wordId],
    () => fetchIsWordInRepetitions(wordId),
    {
      enabled: !isPreview,
      initialData: false,
      refetchOnWindowFocus: false
    }
  );

  const addWordToRepetitionsMutation = useMutation(addWordToRepetitions, {
    onSuccess: () => {
      console.log("Added word to repetitions");
      refetch();
    },
    onError: (error) => {
      console.error("Error adding word to repetitions:", error);
    },
  });

  const removeWordFromRepetitionsMutation = useMutation(removeWordFromRepetitions, {
    onSuccess: () => {
      console.log("Removed word from repetitions");
      refetch();
    },
    onError: (error) => {
      console.error("Error removing word from repetitions:", error);
    },
  });

  const handleToggleRepetition = async () => {
    if (isPreview) {
      return;
    }

    if (isInRepetitions) {
      removeWordFromRepetitionsMutation.mutate({
        wordId: wordId,
      });
    } else {
      const groupId = selectedGroup?.id;
      
      if (groupId) {
        addWordToRepetitionsMutation.mutate({
          wordId: wordId,
          groupId: selectedGroup.id
        });
      }
    }
  };

  if (isLoading) {
    return <Button type="button" disabled={true}>Loading...</Button>;
  }

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