import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskFilters from "./filtering";
import "@testing-library/jest-dom";
import { STATUS_OPTIONS, } from "../../helpers/constants";

const mockHandleFilterTitleChange = jest.fn();
const mockHandleFilterPriorityChange = jest.fn();
const mockHandleFilterStatusChange = jest.fn();
const mockHandleItemsPerPageChange = jest.fn();

describe("TaskFilters Component", () => {
  const renderComponent = (props = {}) => {
    return render(
      <TaskFilters
        filterTitle=""
        handleFilterTitleChange={mockHandleFilterTitleChange}
        filterPriority=""
        handleFilterPriorityChange={mockHandleFilterPriorityChange}
        filterStatus=""
        handleFilterStatusChange={mockHandleFilterStatusChange}
        itemsPerPage=""
        handleItemsPerPageChange={mockHandleItemsPerPageChange}
        {...props}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders title input field", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("Search title...")).toBeInTheDocument();
  });

  test("calls handleFilterTitleChange on title input change", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Search title...");
    fireEvent.change(input, { target: { value: "Task 1" } });

    expect(mockHandleFilterTitleChange).toHaveBeenCalledTimes(1);
  });

  test("renders priority filter when enabled", () => {
    renderComponent({ filterPriority: "medium" });

    const prioritySelect = screen.getByLabelText("Priority:", { selector: "select" });
    expect(prioritySelect).toBeInTheDocument();
  });

  test("calls handleFilterPriorityChange on priority selection", () => {
    renderComponent({ filterPriority: "low" });

    const prioritySelect = screen.getByLabelText("Priority:", { selector: "select" });
    fireEvent.change(prioritySelect, { target: { value: "high" } });

    expect(mockHandleFilterPriorityChange).toHaveBeenCalledTimes(1);
  });

  test("renders status filter dropdown", () => {
    renderComponent({ filterStatus: "open" });

    const statusSelect = screen.getByLabelText("Status:", { selector: "select" });
    expect(statusSelect).toBeInTheDocument();
  });

  test("calls handleFilterStatusChange on status selection", () => {
    renderComponent({ filterStatus: "open" });

    const statusSelect = screen.getByLabelText("Status:", { selector: "select" });
    fireEvent.change(statusSelect, { target: { value: STATUS_OPTIONS[1].value } });

    expect(mockHandleFilterStatusChange).toHaveBeenCalledTimes(1);
  });

  test("renders items per page filter when enabled", () => {
    renderComponent({ itemsPerPage: "10" });

    const itemsPerPageSelect = screen.getByLabelText("Items per page:", { selector: "select" });
    expect(itemsPerPageSelect).toBeInTheDocument();
  });

  test("calls handleItemsPerPageChange on selecting items per page", () => {
    renderComponent({ itemsPerPage: "10" });

    const itemsPerPageSelect = screen.getByLabelText("Items per page:", { selector: "select" });
    fireEvent.change(itemsPerPageSelect, { target: { value: "20" } });

    expect(mockHandleItemsPerPageChange).toHaveBeenCalledTimes(1);
  });

  test("does not render priority filter if filterPriority is not provided", () => {
    renderComponent();
    expect(screen.queryByLabelText("Priority:", { selector: "select" })).not.toBeInTheDocument();
  });

  test("does not render items per page filter if itemsPerPage is not provided", () => {
    renderComponent();
    expect(screen.queryByLabelText("Items per page:", { selector: "select" })).not.toBeInTheDocument();
  });
});