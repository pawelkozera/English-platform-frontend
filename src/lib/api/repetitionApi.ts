import apiClient from "@/interceptor/axios-interceptor";
import { AddWordToRepetitions, RemoveWordFromRepetitions } from "../types";

export const addWordToRepetitions  = async ({
    wordId
  }: AddWordToRepetitions): Promise<any> => {
    const response = await apiClient.post('/api/v1/repetition/add', {
      wordId
    });
    return response.data;
};

export const removeWordFromRepetitions  = async ({
    wordId
  }: RemoveWordFromRepetitions): Promise<any> => {
    const response = await apiClient.post('/api/v1/', {
      wordId
    });
    return response.data;
};