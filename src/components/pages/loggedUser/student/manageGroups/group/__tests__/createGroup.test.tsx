import { render, screen } from '@testing-library/react';
import { CreateGroup } from '../createGroup';
import { UserProvider } from '@/components/utils/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { vi, describe, expect, it } from 'vitest';

vi.mock('@/lib/api/groupApi', () => ({
  createGroup: vi.fn(),
  fetchGroups: vi.fn(),
}));

const queryClient = new QueryClient();

const renderWithQueryClient = (component: JSX.Element) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>{component}</UserProvider>
    </QueryClientProvider>
  );
};

describe('CreateGroup', () => {
  it('renders the component with default elements', () => {
    renderWithQueryClient(<CreateGroup />);

    expect(screen.getByText('Manage Owned Groups')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New group name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Group password')).toBeInTheDocument();
    expect(screen.getByText('Create Group')).toBeInTheDocument();
  });
});