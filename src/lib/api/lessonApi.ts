import apiClient from "@/interceptor/axios-interceptor";
import { LessonAdd } from '../types';

export const addLesson = async ({
  title,
  groupId
}: LessonAdd): Promise<any>  => {
	const response = await apiClient.post('/api/v1/lesson/add', {
    title,
    groupId
	});
	return response.data
};

export const fetchLessonsFromGroup = async (groupId: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/lesson/all/from/group/${groupId}`);
  return response.data;
};

export const fetchLessonsForDisplay= async (groupId: number, page: number = 0, size: number = 10): Promise<any> => {
  const response = await apiClient.get(`/api/v1/lesson/all/for/display/${groupId}`, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};