import apiClient from "@/interceptor/axios-interceptor";
import { TestInterfaceAdd } from "../types";

export const launchTest = async ({
    testTemplateId,
    groupId,
    activationTime,
    endTime,
  }: TestInterfaceAdd): Promise<any> => {
    const response = await apiClient.post('/api/v1/test/instance/add', {
      testTemplateId,
      groupId,
      activationTime,
      endTime,
    });
    return response.data;
  };