import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { GroupManagement } from "../groupManagement";
import { useUser } from "@/components/utils/UserContext";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

vi.mock("@/components/utils/UserContext", () => ({
  useUser: vi.fn(),
}));

describe("GroupManagement", () => {
  const mockSetSelectedGroup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables owner-specific tabs when user is not an owner", () => {
    (useUser as Mock).mockReturnValue({
      selectedGroup: { owner: false },
      groups: [],
      setSelectedGroup: mockSetSelectedGroup,
    });

    renderWithProviders(<GroupManagement />);

    expect(screen.getByText("Statistics")).toBeDisabled();
    expect(screen.getByText("Manage Tasks")).toBeDisabled();
    expect(screen.getByText("Manage Words")).toBeDisabled();
    expect(screen.getByText("Manage Lessons")).toBeDisabled();
    expect(screen.getByText("Manage Tests")).toBeDisabled();
  });

  it("enables owner-specific tabs when user is an owner", () => {
    (useUser as Mock).mockReturnValue({
      selectedGroup: { owner: true },
      groups: [],
      setSelectedGroup: mockSetSelectedGroup,
    });

    renderWithProviders(<GroupManagement />);

    expect(screen.getByText("Statistics")).toBeEnabled();
    expect(screen.getByText("Manage Tasks")).toBeEnabled();
    expect(screen.getByText("Manage Words")).toBeEnabled();
    expect(screen.getByText("Manage Lessons")).toBeEnabled();
    expect(screen.getByText("Manage Tests")).toBeEnabled();
  });	
});
