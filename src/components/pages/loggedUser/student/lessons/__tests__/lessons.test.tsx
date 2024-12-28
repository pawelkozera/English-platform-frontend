import { render, screen, act } from '@testing-library/react';
import { Lessons } from '../lessons';
import { vi, describe, expect, it } from "vitest";
import { UserProvider } from '@/components/utils/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@/components/common/sidebar', () => ({
  Sidebar: () => <div>Sidebar Mock</div>
}));

vi.mock('@/components/common/footer', () => ({
  Footer: () => <div>Footer Mock</div>
}));

vi.mock('./lessonsDisplay', () => ({
  LessonsDisplay: () => <div>LessonsDisplay Mock</div>
}));

describe('Lessons Component', () => {
  it('should render Sidebar, LessonsDisplay, and Footer components', async () => {
    const queryClient = new QueryClient();

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <BrowserRouter>
              <Lessons />
            </BrowserRouter>
          </UserProvider>
        </QueryClientProvider>
      );
    });

    expect(screen.getByText('Sidebar Mock')).toBeInTheDocument();
    await screen.findByRole('heading', { name: /Lessons/i });
    expect(screen.getByText('Footer Mock')).toBeInTheDocument();
  });
});
