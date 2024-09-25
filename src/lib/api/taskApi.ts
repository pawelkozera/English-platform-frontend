import apiClient from "@/interceptor/axios-interceptor";
import { TaskAdd } from '../types';

export const addTask = async ({
	taskTypeName,
	subTypeName,
	content,
	correctAnswer,
	lessonId
}: TaskAdd): Promise<any>  => {
	const response = await apiClient.post('/api/v1/task/add', {
			taskTypeName,
			subTypeName,
			content,
			correctAnswer,
			lessonId
	});
	return response.data
};