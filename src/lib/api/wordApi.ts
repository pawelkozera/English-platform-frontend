import apiClient from "@/interceptor/axios-interceptor";
import { WordAdd } from '../types';

export const addWord = async ({
	word,
    translation
}: WordAdd): Promise<any>  => {
	const response = await apiClient.post('/api/v1/word/add', {
			word,
            translation
	});
	return response.data
};