import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../footer';
import '@testing-library/jest-dom'

describe('Footer', () => {
    it('renders the footer component', () => {
      render(<Footer />);
  
      const footerText = screen.getByText(/© 2024 LearnJoy\. All rights reserved\./i);
      expect(footerText).toBeInTheDocument();
  
      const footerElement = screen.getByRole('contentinfo');
      expect(footerElement).toBeInTheDocument();
    });
  });
  