import { render, screen } from "@testing-library/react";
import { TaskCreator } from "../taskCreator";
import { useUser } from "@/components/utils/UserContext";
import { vi, describe, expect, it, beforeEach, Mock } from 'vitest';

vi.mock("@/components/utils/UserContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("@/lib/api/lessonApi", () => ({
  fetchLessonsFromGroup: vi.fn(),
}));

vi.mock("@/lib/api/wordApi", () => ({
  fetchWordsOwnedByUser: vi.fn(),
}));

vi.mock("react-query", () => ({
  useMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
  }),
}));

vi.mock("@/components/ui/button", () => ({
	Button: ({ children, ...props }: { children: React.ReactNode }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/card", () => ({
	Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (newPage: number) => void
}
  
vi.mock("@/components/common/pagination", () => ({
  Pagination: ({ page, totalPages } : PaginationProps) => (
    <div>
      Pagination: Page {page} of {totalPages}
    </div>
  ),
}));

vi.mock("./lessonSelector", () => ({
  LessonSelector: ({ }) => (
    <div>LessonSelector Component</div>
  ),
}));
vi.mock("./taskTypeSelector", () => ({
  TaskTypeSelector: ({  }) => (
    <div>TaskTypeSelector Component</div>
  ),
}));
vi.mock("./wordSelection", () => ({
  WordSelection: ({ }) => (
    <div>WordSelection Component</div>
  ),
}));
vi.mock("../../task/taskTyping", () => ({
  TaskTyping: ({  }) => <div>TaskTyping Component</div>,
}));
vi.mock("../../task/taskConnection", () => ({
  TaskConnection: ({ }) => <div>TaskConnection Component</div>,
}));

describe("TaskCreator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useUser as Mock).mockReturnValue({
      selectedGroup: { id: 1 },
    });
  });

  it("renders the TaskCreator component", () => {
    render(<TaskCreator />);
		
    expect(screen.getByText(/Select Lessons/i)).toBeInTheDocument();
    expect(screen.getByText(/Task Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Words/i)).toBeInTheDocument();
    expect(screen.getByText(/Task Preview/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Task/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Test Score/i)).toBeInTheDocument();
  });
});
