import { render, screen, fireEvent } from '@testing-library/react';
import { WordSelection } from '../wordSelection';
import { vi, describe, expect, it } from 'vitest';

const mockUserWords = [
  {
    id: 1,
    word: 'Hello',
    translation: 'Cześć',
    imageFilePath: 'images/hello.jpg',
    audioFilePath: 'audio/hello.mp3'
  },
  {
    id: 2,
    word: 'Goodbye',
    translation: 'Do widzenia',
    imageFilePath: 'images/goodbye.jpg',
    audioFilePath: 'audio/goodbye.mp3'
  }
];

const mockSelectedWords = [1];

const mockOnWordSelection = vi.fn(); 

describe('WordSelection', () => {

  it('renders correctly with user words', () => {
    render(
      <WordSelection
        userWords={mockUserWords}
        selectedWords={mockSelectedWords}
        onWordSelection={mockOnWordSelection}
      />
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Cześć')).toBeInTheDocument();
    expect(screen.getByText('Goodbye')).toBeInTheDocument();
    expect(screen.getByText('Do widzenia')).toBeInTheDocument();

    expect(screen.getByAltText('Hello')).toBeInTheDocument();
    expect(screen.getByAltText('Goodbye')).toBeInTheDocument();
  });

  it('applies border-primary class to selected word', () => {
    render(
      <WordSelection
        userWords={mockUserWords}
        selectedWords={mockSelectedWords}
        onWordSelection={mockOnWordSelection}
      />
    );
  
    const helloCard = screen.getByText('Hello').closest('.cursor-pointer');
    expect(helloCard).toHaveClass('border-primary');
  
    const goodbyeCard = screen.getByText('Goodbye').closest('.cursor-pointer');
    expect(goodbyeCard).not.toHaveClass('border-primary');
  });  

  it('calls onWordSelection when a word is clicked', () => {
    render(
      <WordSelection
        userWords={mockUserWords}
        selectedWords={mockSelectedWords}
        onWordSelection={mockOnWordSelection}
      />
    );

    fireEvent.click(screen.getByText('Goodbye'));

    expect(mockOnWordSelection).toHaveBeenCalledWith(2);
  });

  it('does not apply border-primary class to unselected word', () => {
    render(
      <WordSelection
        userWords={mockUserWords}
        selectedWords={[]}
        onWordSelection={mockOnWordSelection}
      />
    );

    const helloCard = screen.getByText('Hello').closest('div');
    expect(helloCard).not.toHaveClass('border-primary');
  });
});