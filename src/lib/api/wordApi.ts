import apiClient from "@/interceptor/axios-interceptor";

export const addWord = async (formData: FormData): Promise<any> => {
  const response = await apiClient.post('/api/v1/word/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchWordsOwnedByUser = async (page: number = 0, size: number = 10): Promise<any> => {
  const response = await apiClient.get(`/api/v1/word/all/owned/by/user`, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};
