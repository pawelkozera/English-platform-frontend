import { render, screen, fireEvent } from '@testing-library/react';
import { TaskSelection } from '../taskSelection';
import { vi, describe, expect, it } from 'vitest';
import { Task, TypingType, ConnectionType } from '@/lib/types';
import { UserProvider } from "@/components/utils/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from 'react-router-dom';

describe('TaskSelection Component', () => {
	const queryClient = new QueryClient();
  const mockOnTaskSelection = vi.fn();

  const userTasks: Task[] = [
    {
      id: 1,
      description: 'Task 1',
      taskTypeName: 'typing',
      taskSubTypeName: 'translation' as TypingType,
      words: [
        { id: 1, word: 'word1', translation: 'translation1', audioFilePath: '', imageFilePath: '' },
        { id: 2, word: 'word2', translation: 'translation2', audioFilePath: '', imageFilePath: '' },
      ],
      questionType: 'translation' as TypingType,
    },
    {
      id: 2,
      description: 'Task 2',
      taskTypeName: 'connection',
      taskSubTypeName: 'translation' as ConnectionType,
      words: [
        { id: 3, word: 'word3', translation: 'translation3', audioFilePath: '', imageFilePath: '' },
        { id: 4, word: 'word4', translation: 'translation4', audioFilePath: '', imageFilePath: '' },
      ],
      questionType: 'translation' as ConnectionType,
    },
  ];

  it('renders tasks correctly', () => {
    render(
      <TaskSelection
        userTasks={userTasks}
        selectedTasks={[]}
        onTaskSelection={mockOnTaskSelection}
        showSelectButton={true}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('changes button text to "Selected" after a task is selected', () => {
    render(
      <TaskSelection
        userTasks={userTasks}
        selectedTasks={[1]}
        onTaskSelection={mockOnTaskSelection}
        showSelectButton={true}
      />
    );

    const buttonTask1 = screen.getByText('Selected');
    expect(buttonTask1).toBeInTheDocument();

    const buttonTask2 = screen.getByText('Select');
    expect(buttonTask2).toBeInTheDocument();
  });

  it('calls onTaskSelection when a task is selected or deselected', () => {
    render(
      <TaskSelection
        userTasks={userTasks}
        selectedTasks={[1]}
        onTaskSelection={mockOnTaskSelection}
        showSelectButton={true}
      />
    );

    fireEvent.click(screen.getByText('Selected'));

    expect(mockOnTaskSelection).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('Select'));

    expect(mockOnTaskSelection).toHaveBeenCalledWith(2);
  });

  it('renders the button text correctly when showSelectButton is false', () => {
    render(
      <TaskSelection
        userTasks={userTasks}
        selectedTasks={[1]}
        onTaskSelection={mockOnTaskSelection}
        showSelectButton={false}
      />
    );

    const buttonTask2 = screen.getByText('Add to test');
    expect(buttonTask2).toBeInTheDocument();

    const buttonTask1 = screen.getByText('Remove from test');
    expect(buttonTask1).toBeInTheDocument();
  });

  it('renders correctly in exam mode', () => {
		render(
					<Router>
						<QueryClientProvider client={queryClient}>
							<UserProvider>
								<TaskSelection
									userTasks={userTasks}
									selectedTasks={[]}
									onTaskSelection={mockOnTaskSelection}
									isExam={true}
									showSelectButton={true}
								/>
							</UserProvider>
						</QueryClientProvider>
					</Router>
				);

    expect(screen.getByText('word3')).toBeInTheDocument();
  });

  it('renders correctly in non-exam mode', () => {
		render(
			<Router>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<TaskSelection
							userTasks={userTasks}
							selectedTasks={[]}
							onTaskSelection={mockOnTaskSelection}
							isExam={false}
							showSelectButton={true}
						/>
					</UserProvider>
				</QueryClientProvider>
			</Router>
		);

    expect(screen.getByText('word1')).toBeInTheDocument();
  });
});
