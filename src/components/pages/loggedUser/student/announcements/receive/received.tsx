import { useState } from "react";
import { useQuery } from "react-query";
import { Announcement } from "./announcement";
import { Pagination } from "@/components/common/pagination";
import { fetchAnnouncementsForDisplay } from "@/lib/api/announcementApi";
import { useUser } from "@/components/utils/UserContext";

interface AnnouncementResponse {
  title: string;
  content: string;
  createdAt: string;
}

export function Received() {
  const { selectedGroup, fetchAndSetUnseenAnouncementsCount, unseenAnouncementsCounts } = useUser();
  const groupId = selectedGroup?.id;

  const [page, setPage] = useState(0)
  const pageSize = 3

  const { data, isLoading, error } = useQuery(
    ['announcements', groupId, page, pageSize],
    () => fetchAnnouncementsForDisplay(groupId!, page, pageSize),
    {
      enabled: !!groupId,
      keepPreviousData: true,
      onSuccess: () => {
        if (selectedGroup && unseenAnouncementsCounts[selectedGroup.id] > 0) {
          fetchAndSetUnseenAnouncementsCount(selectedGroup.id, true);
        }
      }
    }
  );

  if (!groupId) {
    return <p>Please select a group to view announcements.</p>;
  }

  if (isLoading) {
    return <p>Loading announcements...</p>;
  }

  if (error instanceof Error) {
    return <p>Error fetching announcements: {error.message}</p>;
  }

  const announcements = data?._embedded?.announcementDisplayResponseList || [];
  const totalPages = data?.page?.totalPages || 1

  if (announcements.length === 0) {
    return <p>No announcements available.</p>;
  }

  return (
    <div className="container mx-auto  py-8">
      <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
        {announcements.map((announcement: AnnouncementResponse, index: number) => (
          <div key={index} className="w-full">
            <Announcement
              title={announcement.title}
              content={announcement.content}
              date={new Date(announcement.createdAt).toLocaleDateString()}
              variant={"default"}
            />
          </div>
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
