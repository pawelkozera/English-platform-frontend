import apiClient from "@/interceptor/axios-interceptor";
import { CreateGroupParams, JoinGroupParams } from "../types";

export const fetchGroups = async (): Promise<any>  => {
  const response = await apiClient.get('/api/v1/user/allGroups');
  return response.data;
};

export const createGroup = async ({
  groupName,
  password,
}: CreateGroupParams): Promise<any>  => {
  const response = await apiClient.post('/api/v1/group/createGroup', {
    groupName,
    password,
  });
  return response.data
};

export const joinGroup = async ({
  groupCode,
  password,
}: JoinGroupParams): Promise<any>  => {
  const response = await apiClient.post('/api/v1/group/join', {
    groupCode,
    password,
  });
  return response.data
};