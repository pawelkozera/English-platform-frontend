import { render, screen } from '@testing-library/react';
import { StatisticsManagement } from '../statisticsManagement';
import { vi, describe, expect, it } from 'vitest';

vi.mock('../statisticsTestsHistory', () => ({
  StatisticsTestsHistory: vi.fn(() => <div>Test History Content</div>),
}));

describe('StatisticsManagement', () => {
  it('renders StatisticsManagement component with tabs', () => {
    render(<StatisticsManagement />);
    
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText('Tests')).toBeInTheDocument();
    
    expect(screen.getByText('Test History Content')).toBeInTheDocument();
  });
});
