export interface User {
    firstName: string;
    lastName: string;
    email: string;
  }
  
export interface Group {
  id: number;
  groupName: string;
  groupCode: string;
  owner: boolean;
}

export interface CreateGroupParams {
  groupName: string;
  password: string;
}

export interface JoinGroupParams {
  groupCode: string;
  password: string;
}

export interface SignupParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface SigninParams {
  email: string;
  password: string;
}

export interface TaskAdd {
  taskTypeName: string;
  taskSubTypeName: string;
  content: string | File;
  correctAnswer: string;
  lessonId: number;
  wordIds: number[];
  score: number;
}

export interface LessonAdd {
  title: string;
  groupId: number;
}

export interface Word {
  id: number;
  word: string;
  translation: string;
  audioFilePath: string;
  imageFilePath: string;
}
export interface CompleteTaskParams {
  lessonId: number;
  taskId: number;
}

export interface Task {
    id: number;
    taskTypeName: TaskType;
    taskSubTypeName: TypingType | ConnectionType;
    description: string;
    words: Word[];
    questionType: TypingType | ConnectionType;
}

export interface TestTemplateAdd {
  name: string;
  tasksIds: number[];
}

export interface TestInterfaceAdd {
  testTemplateId: number;
  groupId: number;
  activationTime: string;
  endTime: string;
}

export interface TestHistoryAdd {
  testInstanceId: number;
  score: number;
}

export interface WordResponse {
  id: number;
  word: string;
  translation: string;
  audioFilePath: string;
  imageFilePath: string;
}

export interface TaskResponse {
  id: number;
  taskTypeName: string;
  taskSubTypeName: string;
  content: string;
  correctAnswer: string;
  completed: boolean; 
  words: WordResponse[];
  score: number;
}

export type TaskType = 'typing' | 'connection'
export type TypingType = "translation" | "reverseTranslation" | "image" | "retyping" | "audio";
export type ConnectionType = 'translation' | 'image';