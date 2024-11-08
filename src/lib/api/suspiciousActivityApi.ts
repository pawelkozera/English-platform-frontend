import apiClient from "@/interceptor/axios-interceptor";
import { SuspiciousActivityAdd } from "../types";

export const addSuspiciousActivity = async ({
    testInstanceId,
    description
  }: SuspiciousActivityAdd): Promise<any> => {
    const response = await apiClient.post('/api/v1/suspicious/activity/add', {
      testInstanceId,
      description
    });
    return response.data;
};