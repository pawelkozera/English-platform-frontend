import { render, screen} from '@testing-library/react';
import { TestsManagement } from '../testsManagement';
import { vi, describe, expect, it } from 'vitest';
import { UserProvider } from "@/components/utils/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from 'react-router-dom';

vi.mock('../launchTest', () => ({
  LaunchTest: () => <div>Launch Test Component</div>,
}));
vi.mock('../testCreator', () => ({
  TestCreator: () => <div>Create Test Component</div>,
}));
vi.mock('../deleteTest', () => ({
  DeleteTest: () => <div>Delete Test Component</div>,
}));

describe('TestsManagement', () => {
	const queryClient = new QueryClient();

  it('renders all tabs correctly', () => {
    render(
			<Router>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<TestsManagement />
					</UserProvider>
				</QueryClientProvider>
			</Router>
		);

    expect(screen.getByText('Launch')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders the default selected tab content', () => {
    render(
			<Router>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<TestsManagement />
					</UserProvider>
				</QueryClientProvider>
			</Router>
		);
		
    expect(screen.getByText('Launch Test Component')).toBeInTheDocument();
    expect(screen.queryByText('Create Test Component')).toBeNull();
    expect(screen.queryByText('Delete Test Component')).toBeNull();
  });
});
