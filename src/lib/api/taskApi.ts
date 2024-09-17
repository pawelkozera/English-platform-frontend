import apiClient from "@/interceptor/axios-interceptor";
import { TaskAdd } from '../types';

export const addTask = async ({
	taskTypeName,
	content,
	correctAnswer,
	lessonId
}: TaskAdd): Promise<any>  => {
	const response = await apiClient.post('/api/v1/task/add', {
			taskTypeName,
			content,
			correctAnswer,
			lessonId
	});
	return response.data
};