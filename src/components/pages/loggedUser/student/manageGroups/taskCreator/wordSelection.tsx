import { Card, CardContent } from "@/components/ui/card"
import { baseURL } from "@/interceptor/axios-interceptor";

interface Word {
  id: number;
  word: string;
  translation: string;
  imageFilePath: string;
  audioFilePath: string;
}

interface WordSelectionProps {
  userWords: Word[];
  selectedWords: number[];
  onWordSelection: (wordId: number) => void;
}

export function WordSelection({ userWords, selectedWords, onWordSelection }: WordSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {userWords.map((word) => (
        <Card
          key={word.id}
          className={`cursor-pointer ${selectedWords.includes(word.id) ? 'border-primary' : ''}`}
          onClick={() => onWordSelection(word.id)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center space-y-4">
              <img
                src={baseURL + `/${word.imageFilePath}`}
                alt={word.word}
                className="w-12 h-12 object-cover rounded"
              />

              <div className="text-center">
                <p className="font-semibold">{word.word}</p>
                <p className="text-sm text-gray-500">{word.translation}</p>
              </div>

              <audio controls className="mt-2 transform scale-75">
                <source
                  src={baseURL + `/${word.audioFilePath}`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          </CardContent>
        </Card>      
      ))}
    </div>
  )
}