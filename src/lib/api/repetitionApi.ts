import apiClient from "@/interceptor/axios-interceptor";
import { AddWordToRepetitions, RemoveWordFromRepetitions } from "../types";

export const addWordToRepetitions  = async ({
    wordId,
    groupId
  }: AddWordToRepetitions): Promise<any> => {
    const response = await apiClient.post('/api/v1/repetition/add', {
      wordId,
      groupId
    });
    return response.data;
};

export const removeWordFromRepetitions  = async ({
    wordId
  }: RemoveWordFromRepetitions): Promise<any> => {
    const response = await apiClient.delete(`/api/v1/repetition/remove/${wordId}`);
    return response.data;
};

export const fetchIsWordInRepetitions = async (wordId: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/repetition/exists/${wordId}`);
  return response.data;
};