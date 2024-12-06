import apiClient from "@/interceptor/axios-interceptor";
import { TaskAdd, CompleteTaskParams } from '../types';

export const addTask = async ({
  taskTypeName,
  taskSubTypeName,
  content,
  correctAnswer,
  lessonId,
  wordIds,
  score
}: TaskAdd): Promise<any> => {
  const response = await apiClient.post('/api/v1/task/add', {
    taskTypeName,
    taskSubTypeName,
    content,
    correctAnswer,
    lessonId,
    wordIds,
    score
  });
  return response.data;
};

export const fetchTaskById = async (taskId: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/task/${taskId}`);
  return response.data;
};

export const fetchTasksByIds = async (taskIds: number[]): Promise<any> => {
  const queryString = taskIds.map(id => `taskIds=${id}`).join('&');
  const response = await apiClient.get(`/api/v1/task/batch?${queryString}`);
  return response.data;
};

export const completeTask = async ({
  lessonId,
  taskId,
}: CompleteTaskParams): Promise<any>  => {
  const response = await apiClient.post(`/api/v1/task/complete`, {
    lessonId,
    taskId,
  });
  return response.data
};

export const fetchTasksOwnedByUser = async (page: number, size: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/task/all/owned/by/user?page=${page}&size=${size}`);
  return response.data;
};

export const deleteTaskById = async (taskId: number): Promise<any> => {
  const response = await apiClient.delete(`/api/v1/task/${taskId}/delete`);
  return response.data;
};