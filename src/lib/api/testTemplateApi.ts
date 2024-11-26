import apiClient from "@/interceptor/axios-interceptor";
import { TestTemplateAdd } from "../types";

export const addTestTemplate = async ({
    name,
    tasksIds
  }: TestTemplateAdd): Promise<any> => {
    const response = await apiClient.post('/api/v1/test/template/add', {
      name,
      tasksIds
    });
    return response.data;
};

export const fetchTestTemplatesOwnedByUser = async (page: number, size: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/test/template/all/owned/by/user?page=${page}&size=${size}`);
  return response.data;
};

export const fetchTestHistoryForDisplay= async (groupId: number, page: number = 0, size: number = 10): Promise<any> => {
  const response = await apiClient.get(`/api/v1/test/history/all/for/display/${groupId}`, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};