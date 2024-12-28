import { render, screen} from '@testing-library/react';
import { TaskManagement } from '../taskManagement';
import { vi, describe, expect, it } from 'vitest';

vi.mock('../taskCreator', () => ({
  TaskCreator: vi.fn(() => <div>Task Creator Component</div>),
}));

vi.mock('../taskDelete', () => ({
  TaskDelete: vi.fn(() => <div>Task Delete Component</div>),
}));

describe('TaskManagement', () => {
  it('renders TaskCreator component when "Create" tab is selected by default', () => {
    render(<TaskManagement />);

    expect(screen.getByText('Task Creator Component')).toBeInTheDocument();
    expect(screen.queryByText('Task Delete Component')).not.toBeInTheDocument();
  });	
});
