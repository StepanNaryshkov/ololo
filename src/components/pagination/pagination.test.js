import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "./pagination";

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();

  const renderPagination = (currentPage, totalPages) => {
    render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={mockOnPageChange}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders pagination buttons correctly", () => {
    renderPagination(1, 5);
    
    expect(screen.getByText("◀ Prev")).toBeInTheDocument();
    expect(screen.getByText("Next ▶")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("calls onPageChange when clicking next button", () => {
    renderPagination(1, 5);
    
    fireEvent.click(screen.getByText("Next ▶"));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test("calls onPageChange when clicking previous button", () => {
    renderPagination(2, 5);
    
    fireEvent.click(screen.getByText("◀ Prev"));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test("disables previous button on first page", () => {
    renderPagination(1, 5);
    
    expect(screen.getByText("◀ Prev")).toBeDisabled();
  });

  test("disables next button on last page", () => {
    renderPagination(5, 5);
    
    expect(screen.getByText("Next ▶")).toBeDisabled();
  });

  test("calls onPageChange when clicking a numbered page", () => {
    renderPagination(3, 5);
    
    fireEvent.click(screen.getByText("2"));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test("renders ellipsis when necessary", () => {
    renderPagination(3, 10);
    
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });
});
