import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TypingType, ConnectionType, TaskType } from '@/lib/types';

type TaskTypeSelectorProps = {
  taskType: TaskType;
  subTaskType: TypingType | ConnectionType;
  onTaskTypeChange: (value: TaskType) => void;
  onSubTaskTypeChange: (value: TypingType | ConnectionType) => void;
};

export function TaskTypeSelector({
  taskType,
  subTaskType,
  onTaskTypeChange,
  onSubTaskTypeChange
}: TaskTypeSelectorProps) {
  return (
    <div>
      <Label>Task Type</Label>
      <div className="mb-4" />
      <RadioGroup
        value={taskType}
        onValueChange={onTaskTypeChange}
        defaultValue="typing"
      >
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

      {taskType === 'typing' ? (
        <div>
          <Label>Typing Options</Label>
          <div className="mb-4" />
          <RadioGroup
            value={subTaskType}
            onValueChange={onSubTaskTypeChange}
            defaultValue="translation"
          >
            <div className="flex space-x-4">
              <RadioGroupItem value="translation" id="translation" />
              <Label htmlFor="translation">Translation</Label>
              <RadioGroupItem value="reverseTranslation" id="reverseTranslation" />
              <Label htmlFor="reverseTranslation">Reverse translation</Label>
              <RadioGroupItem value="image" id="image" />
              <Label htmlFor="image">Image</Label>
              <RadioGroupItem value="retyping" id="retyping" />
              <Label htmlFor="retyping">Retyping</Label>
              <RadioGroupItem value="audio" id="audio" />
              <Label htmlFor="audio">Audio</Label>
            </div>
          </RadioGroup>
        </div>
      ) : taskType === 'connection' ? (
        <div>
          <Label>Connect Options</Label>
          <div className="mb-4" />
          <RadioGroup
            value={subTaskType}
            onValueChange={onSubTaskTypeChange}
            defaultValue="translation"
          >
            <div className="flex space-x-4">
              <RadioGroupItem value="translation" id="translation" />
              <Label htmlFor="translation">Connect with Translation</Label>
              <RadioGroupItem value="image" id="image" />
              <Label htmlFor="image">Connect with Image</Label>
            </div>
          </RadioGroup>
        </div>
      ) : null}
    </div>
  );
}