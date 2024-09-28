import apiClient from "@/interceptor/axios-interceptor";
import { TaskAdd } from '../types';

export const addTask = async ({
  taskTypeName,
  taskSubTypeName,
  content,
  correctAnswer,
  lessonId,
  wordIds
}: TaskAdd): Promise<any> => {
  const response = await apiClient.post('/api/v1/task/add', {
    taskTypeName,
    taskSubTypeName,
    content,
    correctAnswer,
    lessonId,
    wordIds
  });
  return response.data;
};
