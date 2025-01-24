import { render, screen } from '@testing-library/react';
import { LessonSelector } from '../lessonSelector';
import { vi, describe, expect, it } from 'vitest';

describe('LessonSelector', () => {		
  it('renders lessons correctly', () => {
    const lessons = [
      { title: 'Lesson 1', lessonId: 1, groupIds: [1] },
      { title: 'Lesson 2', lessonId: 2, groupIds: [2] },
    ];

    render(<LessonSelector lessons={lessons} selectedLesson={[]} onLessonChange={vi.fn()} />);

    expect(screen.getByText('Lesson 1')).toBeInTheDocument();
    expect(screen.getByText('Lesson 2')).toBeInTheDocument();
  });

  it('applies a border when the lesson is selected', () => {
		const lessons = [
			{ title: 'Lesson 1', lessonId: 1, groupIds: [1] },
			{ title: 'Lesson 2', lessonId: 2, groupIds: [2] },
		];
	
		render(
			<LessonSelector
				lessons={lessons}
				selectedLesson={[{ title: 'Lesson 1', lessonId: 1, groupIds: [1] }]}
				onLessonChange={vi.fn()}
			/>
		);

		const lesson1Card = screen.getByText('Lesson 1').closest('.cursor-pointer');
		expect(lesson1Card).toHaveClass('border-primary');
		const lesson2Card = screen.getByText('Lesson 2').closest('.cursor-pointer');
		expect(lesson2Card).not.toHaveClass('border-primary');
	});	
});
