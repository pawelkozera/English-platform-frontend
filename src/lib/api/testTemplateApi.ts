import apiClient from "@/interceptor/axios-interceptor";
import { TestTemplateAdd } from "../types";

export const addTask = async ({
    name,
    tasksIds
  }: TestTemplateAdd): Promise<any> => {
    const response = await apiClient.post('/api/v1/test/template/add', {
      name,
      tasksIds
    });
    return response.data;
};