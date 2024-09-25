import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUser } from '@/components/utils/UserContext'
import { fetchLessonsFromGroup } from '@/lib/api/lessonApi'
import { fetchWordsOwnedByUser } from '@/lib/api/wordApi'
import { useMutation } from "react-query";
import { addTask } from "@/lib/api/taskApi";

type TaskType = 'typing' | 'connection'
type TypingType = 'translation' | 'reverseTranslation' | 'retype' | 'image' | 'audio'
type ConnectionType = 'translation' | 'image'

export function TaskCreator() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [userWords, setUserWords] = useState<any[]>([]);
  const [taskType, setTaskType] = useState<TaskType>('typing')
  const [subTaskType, setSubTaskType] = useState<TypingType | ConnectionType>('translation')
  const [selectedWords, setSelectedWords] = useState<number[]>([])
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const { selectedGroup } = useUser()

  const mutation = useMutation(addTask, {
    onSuccess: (data) => {
      console.log("Task added successfully", data);
    },
    onError: (error) => {
      console.error("Error during task creation", error);
    },
  });

  useEffect(() => {
    if (selectedGroup) {
      const fetchLessons = async () => {
        try {
          const lessonsData = await fetchLessonsFromGroup(selectedGroup.id);
          setLessons(lessonsData);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      };

      fetchLessons();
    }
  }, [selectedGroup]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const wordsData = await fetchWordsOwnedByUser();
        setUserWords(wordsData);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, []);

  const handleWordSelection = (wordId: number) => {
    setSelectedWords(prev => 
      prev.includes(wordId) ? prev.filter(id => id !== wordId) : [...prev, wordId]
    )
  }

  const renderWordSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {userWords.map(word => (
        <Card key={word.id} className={`cursor-pointer ${selectedWords.includes(word.id) ? 'border-primary' : ''}`}
             onClick={() => handleWordSelection(word.id)}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img src={word.img} alt={word.word} className="w-12 h-12 object-cover rounded" />
              <div>
                <p className="font-semibold">{word.word}</p>
                <p className="text-sm text-gray-500">{word.translation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTaskPreview = () => {
    return (
      <></>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Task Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lesson">Select Lesson</Label>
              <Select onValueChange={(value) => setSelectedLesson(value ? Number(value) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lesson" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Task Type</Label>
              <RadioGroup onValueChange={(value: TaskType) => setTaskType(value)} defaultValue="typing">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="typing" id="typing" />
                    <Label htmlFor="typing">Typing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="connection" id="connection" />
                    <Label htmlFor="connection">Connection</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            {taskType === 'typing' ? (
              <div>
                <Label>Typing Options</Label>
                <div className="mb-4" />
                <RadioGroup onValueChange={(value: TypingType) => setSubTaskType(value)} defaultValue="translation">
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="translation" id="translation" />
                      <Label htmlFor="translation">Translation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reverseTranslation" id="reverseTranslation" />
                      <Label htmlFor="reverseTranslation">Reverse translation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="image" id="image" />
                      <Label htmlFor="image">Image</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="retyping" id="retyping" />
                      <Label htmlFor="retyping">Retyping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="audio" id="audio" />
                      <Label htmlFor="audio">Audio</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            ) : taskType === 'connection' ? (
              <div>
                <Label>Connect Options</Label>
                <div className="mb-4" />
                <RadioGroup onValueChange={(value: ConnectionType) => setSubTaskType(value)} defaultValue="image">
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="translation" id="translation" />
                      <Label htmlFor="translation">Connect with Translation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="image" id="image" />
                      <Label htmlFor="image">Connect with Image</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Select Words</CardTitle>
        </CardHeader>
        <CardContent>
          {renderWordSelection()}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Task Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTaskPreview()}
        </CardContent>
      </Card>

      <Button className="mt-4 w-full" disabled={!selectedLesson || selectedWords.length === 0}>
        Create Task
      </Button>
    </div>
  )
}