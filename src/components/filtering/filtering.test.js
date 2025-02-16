import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskFilters from "./filtering";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  ITEMS_PER_PAGE_OPTIONS,
} from "../../helpers/constants";

describe("TaskFilters Component", () => {
  const mockHandlers = {
    handleFilterTitleChange: jest.fn(),
    handleFilterPriorityChange: jest.fn(),
    handleFilterStatusChange: jest.fn(),
    handleItemsPerPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all filters correctly", () => {
    render(
      <TaskFilters
        filterTitle=""
        handleFilterTitleChange={mockHandlers.handleFilterTitleChange}
        filterPriority=""
        handleFilterPriorityChange={mockHandlers.handleFilterPriorityChange}
        filterStatus=""
        handleFilterStatusChange={mockHandlers.handleFilterStatusChange}
        itemsPerPage={ITEMS_PER_PAGE_OPTIONS[0]}
        handleItemsPerPageChange={mockHandlers.handleItemsPerPageChange}
      />
    );

    expect(screen.getByPlaceholderText("Search title...")).toBeInTheDocument();
    expect(screen.getByText("All Priorities")).toBeInTheDocument();
    expect(screen.getByText("All Statuses")).toBeInTheDocument();
    expect(screen.getByText(`${ITEMS_PER_PAGE_OPTIONS[0]} per page`)).toBeInTheDocument();
  });

  test("calls handleFilterTitleChange on input change", () => {
    render(<TaskFilters filterTitle="" {...mockHandlers} />);

    const input = screen.getByPlaceholderText("Search title...");
    fireEvent.change(input, { target: { value: "New Task" } });

    expect(mockHandlers.handleFilterTitleChange).toHaveBeenCalled();
  });

  test("calls handleFilterPriorityChange on select change", () => {
    render(<TaskFilters filterPriority="" {...mockHandlers} />);

    const select = screen.getByText("All Priorities").closest("select");
    fireEvent.change(select, { target: { value: PRIORITY_OPTIONS[0] } });

    expect(mockHandlers.handleFilterPriorityChange).toHaveBeenCalled();
  });

  test("calls handleFilterStatusChange on select change", () => {
    render(<TaskFilters filterStatus="" {...mockHandlers} />);

    const select = screen.getByText("All Statuses").closest("select");
    fireEvent.change(select, { target: { value: STATUS_OPTIONS[0].value } });

    expect(mockHandlers.handleFilterStatusChange).toHaveBeenCalled();
  });

  test("calls handleItemsPerPageChange on select change", () => {
    render(<TaskFilters itemsPerPage={ITEMS_PER_PAGE_OPTIONS[0]} {...mockHandlers} />);

    const select = screen.getByText(`${ITEMS_PER_PAGE_OPTIONS[0]} per page`).closest("select");
    fireEvent.change(select, { target: { value: ITEMS_PER_PAGE_OPTIONS[1] } });

    expect(mockHandlers.handleItemsPerPageChange).toHaveBeenCalled();
  });
});
