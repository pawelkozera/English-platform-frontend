import apiClient from "@/interceptor/axios-interceptor";
import { LessonAdd } from '../types';

export const addLesson = async ({
  title,
  groupId
}: LessonAdd): Promise<any>  => {
	const response = await apiClient.post('/api/v1/lesson/add', {
    title,
    groupId
	});
	return response.data
};


export const editLesson = async (
  lessonId: number,
  { title, groupIds }: { title: string; groupIds: number[] }
): Promise<any> => {
  const response = await apiClient.put(
    `/api/v1/lesson/${lessonId}/update`,
    { title, groupIds },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const fetchLessonsFromGroup = async (groupId: number, page: number = 0, size: number = 10): Promise<any> => {
  const response = await apiClient.get(`/api/v1/lesson/all/from/group/${groupId}`, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};

export const fetchLessonsFromGroupWithId = async (groupId: number, page: number = 0, size: number = 10): Promise<any> => {
  const response = await apiClient.get(`/api/v1/lesson/all/from/group/with/groupIds/${groupId}`, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};

export const fetchLessonsNotAssignedToGroup = async (groupId: number, page: number = 0, size: number = 10): Promise<any> => {
  const response = await apiClient.get(`/api/v1/lesson/all/not/assigned/to/group/${groupId}`, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};

export const fetchLessonsForDisplay= async (groupId: number, page: number = 0, size: number = 10): Promise<any> => {
  const response = await apiClient.get(`/api/v1/lesson/all/for/display/${groupId}`, {
    params: {
      page: page,
      size: size,
    },
  });
  return response.data;
};

export const fetchTasksForLesson= async (lessonId: number): Promise<any> => {
  const response = await apiClient.get(`/api/v1/lesson/${lessonId}/tasks`);
  return response.data;
};