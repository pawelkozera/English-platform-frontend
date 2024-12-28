import { render, screen } from '@testing-library/react';
import { Sidebar } from '../sidebar';
import { useUser } from '@/components/utils/UserContext';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, beforeAll, afterEach, Mock } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('@/components/utils/UserContext', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/interceptor/axios-interceptor', () => ({
  post: vi.fn(),
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe('Sidebar', () => {
  const mockUserContext = {
    logout: vi.fn(),
    groups: [{ id: 1, groupName: 'Group 1' }],
    selectedGroup: { id: 1, groupName: 'Group 1' },
    setSelectedGroup: vi.fn(),
    repetitionCounts: { 1: 3 },
    unseenAnouncementsCounts: { 1: 2 },
  };

  beforeEach(() => {
    (useUser as Mock).mockReturnValue(mockUserContext);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders sidebar correctly', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Lessons')).toBeInTheDocument();
    expect(screen.getByText('Tests')).toBeInTheDocument();
    expect(screen.getByText('Repetitions')).toBeInTheDocument();
    expect(screen.getByText('Announcements')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Groups' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Owned Groups' })).toBeInTheDocument();
  
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });  

  it('displays repetition count and announcement count badges', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Repetitions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Announcements')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
