import apiClient from "@/interceptor/axios-interceptor";
import { AnnouncementAdd } from "../types";

export const addAnnouncement = async ({
	groupId,
	title,
	content
}: AnnouncementAdd): Promise<any>  => {
		const response = await apiClient.post('/api/v1/announcement/add', {
		groupId,
		title,
		content
		});
		return response.data
};

export const fetchAnnouncementsForDisplay= async (groupId: number, page: number = 0, size: number = 1): Promise<any> => {
	const response = await apiClient.get(`/api/v1/announcement/all/for/display/${groupId}`, {
		params: {
			page: page,
			size: size,
		},
	});
	return response.data;
};