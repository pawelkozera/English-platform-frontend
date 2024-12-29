import { render, screen, fireEvent } from "@testing-library/react";
import { AddWord } from "../addWord";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useMutation } from "react-query";

vi.mock("@/lib/api/wordApi", () => ({
  addWord: vi.fn(),
}));

vi.mock("react-query", () => ({
  useMutation: vi.fn(),
}));

describe("AddWord", () => {
  const mockMutate = vi.fn();
  const mockUseMutation = useMutation as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
  });

  it("renders the AddWord form with all fields", () => {
    render(<AddWord />);

    expect(screen.getByPlaceholderText("Enter word")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter translation")).toBeInTheDocument();
    expect(screen.getByText("Audio file (Optional)")).toBeInTheDocument();
    expect(screen.getByText("Image file (Optional)")).toBeInTheDocument();
    expect(screen.getByText("Add word")).toBeInTheDocument();
  });

  it("enables the submit button only when word and translation are provided", () => {
    render(<AddWord />);

    const wordInput = screen.getByPlaceholderText("Enter word");
    const translationInput = screen.getByPlaceholderText("Enter translation");
    const submitButton = screen.getByText("Add word");

    expect(submitButton).toBeDisabled();

    fireEvent.change(wordInput, { target: { value: "test" } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(translationInput, { target: { value: "test translation" } });
    expect(submitButton).toBeEnabled();
  });

  it("displays 'Adding...' when the mutation is loading", async () => {
    mockUseMutation.mockReturnValueOnce({
      mutate: mockMutate,
      isLoading: true,
    });

    render(<AddWord />);
    const submitButton = screen.getByText("Adding...");

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});