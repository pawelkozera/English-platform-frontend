import apiClient from "@/interceptor/axios-interceptor";

export const addWord = async (formData: FormData): Promise<any> => {
  const response = await apiClient.post('/api/v1/word/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
