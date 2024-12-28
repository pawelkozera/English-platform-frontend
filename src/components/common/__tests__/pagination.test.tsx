import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "../pagination";

describe("Pagination", () => {
  it("disables the Previous button on the first page", () => {
    render(
      <Pagination page={0} totalPages={5} onPageChange={vi.fn()} />
    );

    const previousButton = screen.getByRole("button", { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it("disables the Next button on the last page", () => {
    render(
      <Pagination page={4} totalPages={5} onPageChange={vi.fn()} />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it("calls onPageChange with the correct value when clicking Next", () => {
    const onPageChangeMock = vi.fn();
    render(
      <Pagination page={2} totalPages={5} onPageChange={onPageChangeMock} />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with the correct value when clicking Previous", () => {
    const onPageChangeMock = vi.fn();
    render(
      <Pagination page={2} totalPages={5} onPageChange={onPageChangeMock} />
    );

    const previousButton = screen.getByRole("button", { name: /previous/i });
    fireEvent.click(previousButton);
    expect(onPageChangeMock).toHaveBeenCalledWith(1);
  });

  it("renders the correct page number text", () => {
    render(
      <Pagination page={2} totalPages={5} onPageChange={vi.fn()} />
    );

    const pageText = screen.getByText(/page 3 of 5/i);
    expect(pageText).toBeInTheDocument();
  });

  it("handles totalPages being 0 gracefully", () => {
    render(
      <Pagination page={0} totalPages={0} onPageChange={vi.fn()} />
    );

    const pageText = screen.getByText(/page 1 of 1/i);
    expect(pageText).toBeInTheDocument();
  });
});