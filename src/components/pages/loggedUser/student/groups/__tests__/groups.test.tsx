import { render, screen } from "@testing-library/react";
import { Groups } from "../groups";
import { describe, expect, it } from "vitest";
import { UserProvider } from "@/components/utils/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from 'react-router-dom';

describe("Groups", () => {
  const queryClient = new QueryClient();

  it("should render Sidebar, GroupManagementJoinedGroups, and Footer", () => {
    render(
			<Router>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<Groups />
					</UserProvider>
				</QueryClientProvider>
			</Router>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Manage Groups")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("should render GroupJoinForm inside GroupManagementJoinedGroups", () => {
    render(
			<Router>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<Groups />
					</UserProvider>
				</QueryClientProvider>
			</Router>
    );

    expect(screen.getByPlaceholderText("Enter group code")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter group password")).toBeInTheDocument();
    expect(screen.getByText("Join Group")).toBeInTheDocument();
  });

  it("should render GroupList and GroupStatistics inside GroupManagementJoinedGroups", () => {
    render(
			<Router>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<Groups />
					</UserProvider>
				</QueryClientProvider>
			</Router>
    );

    expect(screen.getByText("Your Groups")).toBeInTheDocument();
    expect(screen.getByText("Group Informations")).toBeInTheDocument();
  });
});
