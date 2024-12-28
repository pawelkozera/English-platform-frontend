import { render, screen } from '@testing-library/react';
import { AddLesson } from '../addLesson';
import { useMutation } from 'react-query';
import { useUser } from '@/components/utils/UserContext';
import { vi, describe, expect, it, beforeEach } from 'vitest';

vi.mock('react-query', () => ({
  useMutation: vi.fn(),
}));

vi.mock('@/components/utils/UserContext', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/components/AddLesson/groupSelector', () => ({
  GroupSelector: vi.fn(() => <div>GroupSelector</div>),
}));

describe('AddLesson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with form fields', () => {
		const mutateMock = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mutateMock,
      mutateAsync: vi.fn(),
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: vi.fn(),
      isIdle: false,
      status: 'loading',
      context: null,
      failureCount: 0,
      isPaused: false,
      variables: undefined,
    });

    vi.mocked(useUser).mockReturnValue({
      user: null,
      groups: [{ id: 1, groupName: 'Group 1', groupCode: 'G1CODE', owner: true }],
      selectedGroup: null,
      login: vi.fn(),
      logout: vi.fn(),
      setSelectedGroup: vi.fn(),
      refetchGroups: vi.fn(),
      repetitionCounts: {},
      updateRepetitionCountForGroup: vi.fn(),
      fetchAndSetRepetitionCount: vi.fn(),
      unseenAnouncementsCounts: {},
      updateUnseenAnouncementsCountForGroup: vi.fn(),
      fetchAndSetUnseenAnouncementsCount: vi.fn(),
    });

    render(<AddLesson />);

		expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter lesson title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Adding.../i })).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', () => {
    const mutateMock = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mutateMock,
      mutateAsync: vi.fn(),
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: vi.fn(),
      isIdle: false,
      status: 'loading',
      context: null,
      failureCount: 0,
      isPaused: false,
      variables: undefined,
    });

    vi.mocked(useUser).mockReturnValue({
      user: null,
      groups: [{ id: 1, groupName: 'Group 1', groupCode: 'G1CODE', owner: true }],
      selectedGroup: { id: 1, groupName: 'Group 1', groupCode: 'G1CODE', owner: true },
      login: vi.fn(),
      logout: vi.fn(),
      setSelectedGroup: vi.fn(),
      refetchGroups: vi.fn(),
      repetitionCounts: {},
      updateRepetitionCountForGroup: vi.fn(),
      fetchAndSetRepetitionCount: vi.fn(),
      unseenAnouncementsCounts: {},
      updateUnseenAnouncementsCountForGroup: vi.fn(),
      fetchAndSetUnseenAnouncementsCount: vi.fn(),
    });

    render(<AddLesson />);

    expect(screen.getByRole('button', { name: /Adding.../i })).toBeDisabled();
  });

  it('displays loading text when mutation is in progress', () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      groups: [{ id: 1, groupName: 'Group 1', groupCode: 'G1CODE', owner: true }],
      selectedGroup: null,
      login: vi.fn(),
      logout: vi.fn(),
      setSelectedGroup: vi.fn(),
      refetchGroups: vi.fn(),
      repetitionCounts: {},
      updateRepetitionCountForGroup: vi.fn(),
      fetchAndSetRepetitionCount: vi.fn(),
      unseenAnouncementsCounts: {},
      updateUnseenAnouncementsCountForGroup: vi.fn(),
      fetchAndSetUnseenAnouncementsCount: vi.fn(),
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isLoading: true,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: vi.fn(),
      isIdle: false,
      status: 'loading',
      context: null,
      failureCount: 0,
      isPaused: false,
      variables: undefined,
    });

    render(<AddLesson />);

    expect(screen.getByRole('button', { name: /Adding.../i })).toBeDisabled();
  });
});