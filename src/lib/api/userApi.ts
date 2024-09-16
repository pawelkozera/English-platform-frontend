import apiClient from "@/interceptor/axios-interceptor";
import { SignupParams, SigninParams } from "../types";

export const fetchProfile = async (): Promise<any> => {
  const response = await apiClient.get('/api/v1/user/profile');
  return response.data;
};

export const signup = async ({
  email,
  password,
  firstName,
  lastName,
  role,
}: SignupParams): Promise<any> => {
  const response = await apiClient.post('/api/v1/auth/signup', {
    email,
    password,
    firstName,
    lastName,
    role,
  });
  return response.data;
};

export const signin = async ({
  email,
  password
}: SigninParams): Promise<any> => {
  const response = await apiClient.post('/api/v1/auth/signin', {
    email,
    password
  });
  return response.data;
};