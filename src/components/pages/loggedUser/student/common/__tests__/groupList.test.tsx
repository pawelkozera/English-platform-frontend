import { render, screen, fireEvent } from "@testing-library/react";
import { GroupList } from "../groupList";
import { vi, describe, expect, it } from "vitest";

describe("GroupList", () => {
  const mockSetSelectedGroup = vi.fn();

  const groups = [
    { id: 1, groupName: "Group 1", groupCode: "ABC123", owner: true },
    { id: 2, groupName: "Group 2", groupCode: "DEF456", owner: false },
    { id: 3, groupName: "Group 3", groupCode: "GHI789", owner: true },
  ];

  it("should render the GroupList with groups", () => {
    render(<GroupList groups={groups} setSelectedGroup={mockSetSelectedGroup} />);
  
    expect(screen.getByText("Your Groups")).toBeInTheDocument();
  
    groups.forEach((group) => {
      expect(screen.getByText(group.groupName)).toBeInTheDocument();
    });

    const selectButtons = screen.getAllByText("Select");
    expect(selectButtons.length).toBe(groups.length);
  });
  

  it("should call setSelectedGroup when the Select button is clicked", () => {
    render(<GroupList groups={groups} setSelectedGroup={mockSetSelectedGroup} />);

    const selectButton = screen.getAllByText("Select")[0];
    fireEvent.click(selectButton);

    expect(mockSetSelectedGroup).toHaveBeenCalledWith(groups[0]);
  });

  it("should render no groups message if groups array is empty", () => {
    render(<GroupList groups={[]} setSelectedGroup={mockSetSelectedGroup} />);

    expect(screen.queryByText("Your Groups")).toBeInTheDocument();
    expect(screen.queryByText("Select")).toBeNull();
  });
});
