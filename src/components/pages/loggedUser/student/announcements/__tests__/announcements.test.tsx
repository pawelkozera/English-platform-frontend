import { render, screen, waitFor } from "@testing-library/react";
import { Announcements } from "../announcements";
import { useUser } from "@/components/utils/UserContext";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { vi, describe, it, beforeEach, Mock, expect } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@/components/utils/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("@/lib/api/announcementApi", () => ({
  fetchAnnouncementsForDisplay: vi.fn(() =>
    Promise.resolve({
      _embedded: {
        announcementDisplayResponseList: [
          { title: "Test Announcement", content: "Test Content", createdAt: "2023-01-01" },
        ],
      },
      page: { totalPages: 1 },
    })
  ),
}));

describe("Announcements", () => {
  const mockUserContext = {
    selectedGroup: { id: 1, groupName: "Group 1", owner: true },
    groups: [{ id: 1, groupName: "Group 1" }],
    fetchAndSetUnseenAnouncementsCount: vi.fn(),
    unseenAnouncementsCounts: {},
  };

  const queryClient = new QueryClient();
  beforeEach(() => {
    (useUser as Mock).mockReturnValue(mockUserContext);
  });

  it("renders Announcements component correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={["/"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Announcements />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByText("Groups")).toBeInTheDocument();

      expect(screen.getByText("Received Announcements")).toBeInTheDocument();
      expect(screen.getByText("Send Announcement")).toBeInTheDocument();
    });
  });
});
