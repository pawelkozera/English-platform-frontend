import { render, screen, fireEvent } from '@testing-library/react';
import { TaskTypingExam } from '../taskTypingExam';
import { Word, TypingType } from '@/lib/types';
import { describe, it, expect, vi } from "vitest";

const words: Word[] = [
  {id: 1, word: 'dog', translation: 'pies', imageFilePath: '', audioFilePath: '' },
  {id: 2, word: 'cat', translation: 'kot', imageFilePath: '', audioFilePath: '' },
];

const defaultProps = {
  words,
  questionType: 'translation' as TypingType,
};

describe('TaskTypingExam', () => {
  it('renders correctly with words and question type', () => {
    render(<TaskTypingExam {...defaultProps} />);

    words.forEach((word, index) => {
      const question = screen.getByText(`Translate: ${word.word}`);
      expect(question).toBeInTheDocument();
      const inputField = screen.getAllByPlaceholderText("Type your answer here")[index];
      expect(inputField).toBeInTheDocument();
    });
  });

  it('updates the input field when the user types', () => {
    render(<TaskTypingExam {...defaultProps} />);
  
    const inputField = screen.getAllByPlaceholderText("Type your answer here")[0];
  
    fireEvent.change(inputField, { target: { value: 'pies' } });
  
    expect(inputField).toHaveValue('pies');
  });
  
	it('renders the correct question type', () => {
		const questionTypes: TypingType[] = ["translation", "reverseTranslation", "image", "audio", "retyping"];
	
		questionTypes.forEach((type) => {
			render(<TaskTypingExam {...defaultProps} questionType={type} />);
	
			switch (type) {
				case "translation":
					const translationQuestions = screen.getAllByText(/Translate:/);
					expect(translationQuestions.length).toBeGreaterThan(0);
					break;
				case "reverseTranslation":
					const reverseTranslationQuestions = screen.getAllByText(/What\'s the original word for:/);
					expect(reverseTranslationQuestions.length).toBeGreaterThan(0);
					break;
				case "image":
					const imageQuestions = screen.getAllByText(/What\'s in this image?/);
					expect(imageQuestions.length).toBeGreaterThan(0);
					break;
				case "audio":
					const audioQuestions = screen.getAllByText(/What word do you hear?/);
					expect(audioQuestions.length).toBeGreaterThan(0);
					break;
				case "retyping":
					const retypingQuestions = screen.getAllByText(/Retype:/);
					expect(retypingQuestions.length).toBeGreaterThan(0);
					break;
				default:
					throw new Error(`Unknown question type: ${type}`);
			}
		});
	});	
	
  it('calls onMarkAsDone when input changes', () => {
		const onMarkAsDoneMock = vi.fn();
	
		render(<TaskTypingExam {...defaultProps} onMarkAsDone={onMarkAsDoneMock} />);
	
		const inputField = screen.getAllByPlaceholderText("Type your answer here")[0];
	
		fireEvent.change(inputField, { target: { value: 'pies' } });
	
		expect(onMarkAsDoneMock).toHaveBeenCalledTimes(1);
	});	
});
