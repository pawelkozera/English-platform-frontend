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
  subTypeName: string;
  content: string | File;
  correctAnswer: string;
  lessonId: number;
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