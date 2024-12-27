import { render, screen, fireEvent } from '@testing-library/react';
import { TaskConnection } from '../taskConnection';
import { describe, it, expect, vi } from "vitest";
import { Word } from '@/lib/types';

const mockWords: Word[] = [
  { id: 1, word: 'cat', translation: 'kot', audioFilePath: '', imageFilePath: '' },
  { id: 2, word: 'dog', translation: 'pies', audioFilePath: '', imageFilePath: '' },
  { id: 3, word: 'bird', translation: 'ptak', audioFilePath: '', imageFilePath: '' },
];

describe('TaskConnection', () => {
  it('renders the component correctly', () => {
    render(
      <TaskConnection words={mockWords} questionType="translation" />
    );

    mockWords.forEach((word) => {
      expect(screen.getByText(word.word)).toBeInTheDocument();
      expect(screen.getByText(word.translation)).toBeInTheDocument();
    });
  });

  it('handles block selection and connections', () => {
    render(
      <TaskConnection words={mockWords} questionType="translation" />
    );

    const englishWord = screen.getByText('cat');
    const translationWord = screen.getByText('kot');

    fireEvent.click(englishWord);
    fireEvent.click(translationWord);

    expect(englishWord).not.toHaveStyle('background-color: gray');
    expect(translationWord).not.toHaveStyle('background-color: gray');
  });

  it('removes a connection when clicked again', () => {
    render(
      <TaskConnection words={mockWords} questionType="translation" />
    );

    const englishWord = screen.getByText('cat');
    const translationWord = screen.getByText('kot');

    fireEvent.click(englishWord);
    fireEvent.click(translationWord);

    fireEvent.click(englishWord);

    expect(englishWord).toHaveStyle('background-color: rgb(128, 128, 128)');
    expect(translationWord).toHaveStyle('background-color: rgb(128, 128, 128)');
  });

  it('checks answers and displays the result', () => {
    const onCompleteMock = vi.fn();

    render(
      <TaskConnection
        words={mockWords}
        questionType="translation"
        onComplete={onCompleteMock}
      />
    );

    fireEvent.click(screen.getByText('cat'));
    fireEvent.click(screen.getByText('kot'));

    fireEvent.click(screen.getByText('dog'));
    fireEvent.click(screen.getByText('pies'));

    fireEvent.click(screen.getByText('bird'));
    fireEvent.click(screen.getByText('ptak'));

    fireEvent.click(screen.getByText('Check Answers'));

    expect(onCompleteMock).toHaveBeenCalled();
  });
});
