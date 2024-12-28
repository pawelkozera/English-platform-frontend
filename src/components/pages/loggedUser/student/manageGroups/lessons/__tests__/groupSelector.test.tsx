import { render, screen, fireEvent } from '@testing-library/react';
import { GroupSelector } from '../groupSelector';
import { vi, describe, expect, it, beforeEach } from 'vitest';

describe('GroupSelector', () => {
  const mockOnGroupChange = vi.fn();

  const groups = [
    { id: 1, groupName: 'Group 1' },
    { id: 2, groupName: 'Group 2' },
    { id: 3, groupName: 'Group 3' },
  ];

  const selectedGroups = [{ id: 1, groupName: 'Group 1' }];

	beforeEach(() => {
		mockOnGroupChange.mockClear();
	});	

  it('renders the group cards', () => {
    render(
      <GroupSelector
        groups={groups}
        selectedGroups={selectedGroups}
        onGroupChange={mockOnGroupChange}
      />
    );

    groups.forEach((group) => {
      expect(screen.getByText(group.groupName)).toBeInTheDocument();
    });
  });

  it('calls onGroupChange when a group card is clicked', () => {
    render(
      <GroupSelector
        groups={groups}
        selectedGroups={selectedGroups}
        onGroupChange={mockOnGroupChange}
      />
    );

    fireEvent.click(screen.getByText('Group 2'));

    expect(mockOnGroupChange).toHaveBeenCalledTimes(1);
    expect(mockOnGroupChange).toHaveBeenCalledWith([
      { id: 1, groupName: 'Group 1' },
      { id: 2, groupName: 'Group 2' },
    ]);
  });

  it('applies "border-primary" class to selected groups', () => {
    render(
      <GroupSelector
        groups={groups}
        selectedGroups={selectedGroups}
        onGroupChange={mockOnGroupChange}
      />
    );

    expect(screen.getByText('Group 1').closest('.cursor-pointer')).toHaveClass('border-primary');
    expect(screen.getByText('Group 2').closest('.cursor-pointer')).not.toHaveClass('border-primary');
  });
});
