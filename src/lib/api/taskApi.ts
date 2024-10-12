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

export const fetchTaskById= async (taskId: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/task/${taskId}`);
  return response.data;
};