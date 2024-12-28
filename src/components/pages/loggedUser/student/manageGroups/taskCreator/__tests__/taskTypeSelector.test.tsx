import { render, screen, fireEvent } from '@testing-library/react';
import { TaskTypeSelector } from '../taskTypeSelector';
import { TaskType, TypingType, ConnectionType } from '@/lib/types';
import { vi, describe, expect, it } from 'vitest';

describe('TaskTypeSelector', () => {
  const mockOnTaskTypeChange = vi.fn();
  const mockOnSubTaskTypeChange = vi.fn();

  const defaultProps = {
    taskType: 'typing' as TaskType,
    subTaskType: 'translation' as TypingType | ConnectionType,
    onTaskTypeChange: mockOnTaskTypeChange,
    onSubTaskTypeChange: mockOnSubTaskTypeChange,
  };

  it('renders TaskTypeSelector with default taskType as typing', () => {
    render(<TaskTypeSelector {...defaultProps} />);

    expect(screen.getByText('Task Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Typing')).toBeChecked();
    expect(screen.getByLabelText('Connection')).not.toBeChecked();
    expect(screen.getByText('Typing Options')).toBeInTheDocument();
    expect(screen.getByLabelText('Translation')).toBeInTheDocument();
    expect(screen.getByLabelText('Reverse translation')).toBeInTheDocument();
    expect(screen.getByLabelText('Image')).toBeInTheDocument();
    expect(screen.getByLabelText('Retyping')).toBeInTheDocument();
    expect(screen.getByLabelText('Audio')).toBeInTheDocument();
  });

  it('renders TaskTypeSelector with taskType as connection', () => {
    render(
      <TaskTypeSelector
        {...defaultProps}
        taskType="connection"
      />
    );
    expect(screen.getByLabelText('Connection')).toBeChecked();
    expect(screen.queryByLabelText('Typing Options')).not.toBeInTheDocument();
    expect(screen.getByText('Connect Options')).toBeInTheDocument();
    expect(screen.getByLabelText('Connect with Translation')).toBeInTheDocument();
    expect(screen.getByLabelText('Connect with Image')).toBeInTheDocument();
  });

  it('calls onTaskTypeChange when a taskType is selected', () => {
    render(<TaskTypeSelector {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Connection'));
    expect(mockOnTaskTypeChange).toHaveBeenCalledWith('connection');
  });

  it('calls onSubTaskTypeChange when a subTaskType is selected', () => {
    render(<TaskTypeSelector {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Reverse translation'));
    
    expect(mockOnSubTaskTypeChange).toHaveBeenCalledWith('reverseTranslation');
  });
});