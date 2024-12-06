import apiClient from "@/interceptor/axios-interceptor";
import { TestInterfaceAdd } from "../types";

export const launchTest = async ({
  testTemplateId,
  groupId,
  activationTime,
  endTime,
  timeDuration
}: TestInterfaceAdd): Promise<any> => {
  const response = await apiClient.post('/api/v1/test/instance/add', {
    testTemplateId,
    groupId,
    activationTime,
    endTime,
    timeDuration
  });
  return response.data;
};

export const fetchTestInstancesForDisplay= async (groupId: number, page: number = 0, size: number = 10): Promise<any> => {
  const response = await apiClient.get(`/api/v1/test/instance/all/for/display/${groupId}`, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};

export const fetchTasksForTestInstance= async (testInstanceId: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/test/instance/${testInstanceId}/tasks`);
  return response.data;
};

export const fetchTestInstancesForGroup= async (groupId: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/test/instance/instances/group/${groupId}`);
  return response.data;
};