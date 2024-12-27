import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TaskTyping } from "../taskTyping"
import { Word } from "@/lib/types"
import { describe, it, expect, vi } from "vitest";
import { UserProvider } from "@/components/utils/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from 'react-router-dom';

describe("TaskTyping Component", () => {
	const queryClient = new QueryClient();

  const mockWords: Word[] = [
    { id: 1, word: "cat", translation: "kot", imageFilePath: "", audioFilePath: "" },
    { id: 2, word: "dog", translation: "pies", imageFilePath: "", audioFilePath: "" },
  ];

  const mockOnComplete = vi.fn();

  const renderComponent = (props: Partial<React.ComponentProps<typeof TaskTyping>> = {}) => {
    return render(
			<Router>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<TaskTyping
							words={mockWords}
							questionType="translation"
							onComplete={mockOnComplete}
							{...props}
						/>
					</UserProvider>
				</QueryClientProvider>
			</Router>
    );
  };

  it("renders progress bar and updates progress correctly", () => {
    renderComponent()
    expect(screen.getByText(/Progress: 0 \/ 2/)).toBeInTheDocument()
  })

  it("displays the correct question for translation type", () => {
    renderComponent()
    expect(screen.getByText(mockWords[0].word)).toBeInTheDocument()
  })

  it("allows submitting correct answers and updates progress", async () => {
    renderComponent()

    const input = screen.getByPlaceholderText("Type your answer here")
    const submitButton = screen.getByRole("button", { name: "Submit" })
    const nextButton = screen.getByRole("button", { name: "Next" })

    fireEvent.change(input, { target: { value: "kot" } })
    fireEvent.click(submitButton)

    await waitFor(() => expect(screen.getByText("Correct!")).toBeInTheDocument())
    fireEvent.click(nextButton)

    expect(screen.getByText(/Progress: 1 \/ 2/)).toBeInTheDocument()
  })

  it("shows incorrect feedback when the answer is wrong", async () => {
    renderComponent()

    const input = screen.getByPlaceholderText("Type your answer here")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    fireEvent.change(input, { target: { value: "incorrect" } })
    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(screen.getByText("Incorrect. The correct answer is: kot.")).toBeInTheDocument()
    )
  })

  it("disables the Next button until Submit is clicked", () => {
    renderComponent()

    const nextButton = screen.getByRole("button", { name: "Next" })
    expect(nextButton).toBeDisabled()
  })

  it("calls onComplete after finishing all words", async () => {
    renderComponent()

    const input = screen.getByPlaceholderText("Type your answer here")
    const submitButton = screen.getByRole("button", { name: "Submit" })
    const nextButton = screen.getByRole("button", { name: "Next" })

    // Answer first word correctly
    fireEvent.change(input, { target: { value: "kot" } })
    fireEvent.click(submitButton)
    await waitFor(() => fireEvent.click(nextButton))

    // Answer second word correctly
    fireEvent.change(input, { target: { value: "pies" } })
    fireEvent.click(submitButton)
    await waitFor(() => fireEvent.click(nextButton))

    expect(mockOnComplete).toHaveBeenCalledTimes(1)
  })

  it("resets the state when the word list changes", () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Type your answer here"), { target: { value: "kot" } })

    render(
			<Router>
				<QueryClientProvider client={queryClient}>
					<UserProvider>
						<TaskTyping
							words={[{ id: 3, word: "bird", translation: "ptak", imageFilePath: "", audioFilePath: "" }]}
							questionType="translation"
						/>
					</UserProvider>
				</QueryClientProvider>
			</Router>
    )

    expect(screen.getByText("Progress: 0 / 1")).toBeInTheDocument()
  })
})
