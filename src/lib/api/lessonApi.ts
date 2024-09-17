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