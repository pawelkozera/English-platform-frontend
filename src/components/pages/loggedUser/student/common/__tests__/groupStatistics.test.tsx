import { render, screen, fireEvent } from "@testing-library/react";
import { GroupStatistics } from "../groupStatistics";
import { vi, describe, it, expect } from "vitest";

describe("GroupStatistics", () => {
  const mockOnLeaveGroup = vi.fn();

  const groupWithOwner = {
    id: 1,
    groupName: "Group 1",
    groupCode: "G1CODE",
    owner: true,
  };

  const groupWithoutOwner = {
    id: 2,
    groupName: "Group 2",
    groupCode: "G2CODE",
    owner: false,
  };

  it("should render group information if a group is selected", () => {
    render(<GroupStatistics selectedGroup={groupWithOwner} />);

    expect(screen.getByText("Group Informations")).toBeInTheDocument();
    expect(screen.getByText(`Name: ${groupWithOwner.groupName}`)).toBeInTheDocument();
    expect(screen.getByText(`Group Code: ${groupWithOwner.groupCode}`)).toBeInTheDocument();

    expect(screen.getByText("You are the owner of this group.")).toBeInTheDocument();
  });

  it("should show 'Leave Group' button for non-owners if showOnlyOwner is false", () => {
    render(<GroupStatistics selectedGroup={groupWithoutOwner} showOnlyOwner={false} onLeaveGroup={mockOnLeaveGroup} />);

    expect(screen.getByText("Leave Group")).toBeInTheDocument();
  });

  it("should not show 'Leave Group' button if showOnlyOwner is true", () => {
    render(<GroupStatistics selectedGroup={groupWithoutOwner} showOnlyOwner={true} onLeaveGroup={mockOnLeaveGroup} />);

    expect(screen.queryByText("Leave Group")).toBeNull();
  });

  it("should call onLeaveGroup when 'Leave Group' button is clicked", () => {
    render(<GroupStatistics selectedGroup={groupWithoutOwner} onLeaveGroup={mockOnLeaveGroup} />);

    const leaveButton = screen.getByText("Leave Group");
    fireEvent.click(leaveButton);

    expect(mockOnLeaveGroup).toHaveBeenCalled();
  });

  it("should render 'No group selected.' if no group is selected", () => {
    render(<GroupStatistics selectedGroup={null} />);

    expect(screen.getByText("No group selected.")).toBeInTheDocument();
  });
});
