import apiClient from "@/interceptor/axios-interceptor";
import { TestHistoryAdd } from "../types";
import axios from "axios";

export const addTestHistoryBeaconEndpoint = apiClient.defaults.baseURL + '/api/v1/test/history/addTestHistoryBeacon'

export const addTestHistory = async ({
    testInstanceId,
    score
  }: TestHistoryAdd): Promise<any> => {
    const response = await apiClient.post('/api/v1/test/history/add', {
      testInstanceId,
      score
    });
    return response.data;
};

export const fetchTestHistoryCompletionStatus = async (TestHistoryId: number) => {
  try {
    const response = await apiClient.get(`/api/v1/test/history/check/completion/${TestHistoryId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
};