import { render, screen, cleanup } from "@testing-library/react";
import { WordManagement } from "../wordManagement";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

vi.mock("../addWord", () => ({
  AddWord: () => <div>Add Word Component</div>,
}));
vi.mock("../editWord", () => ({
  EditWord: () => <div>Edit Word Component</div>,
}));
vi.mock("../deleteWord", () => ({
  DeleteWord: () => <div>Delete Word Component</div>,
}));

afterEach(cleanup)

describe("WordManagement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders WordManagement with default tab as 'Create'", () => {
    renderWithProviders(<WordManagement />);

    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();

    expect(screen.getByText("Create")).toHaveAttribute("data-state", "active");

    expect(screen.getByText("Add Word Component")).toBeInTheDocument();
  });
});
