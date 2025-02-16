import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskModal from "./task-modal";
import AppContext from "../../context";

describe("TaskModal Component", () => {
  const mockDispatch = jest.fn();
  const mockOnClose = jest.fn();
  const renderModal = (isOpen, task = null, customFields = []) => {
    render(
      <AppContext.Provider
        value={{
          dispatch: mockDispatch,
          ACTIONS: { ADD_TASK: "ADD_TASK", EDIT_TASK: "EDIT_TASK" },
          customFields,
        }}
      >
        <TaskModal isOpen={isOpen} onClose={mockOnClose} task={task} />
      </AppContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when isOpen is false", () => {
    renderModal(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("renders correctly when isOpen is true", () => {
    renderModal(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add New Task")).toBeInTheDocument();
  });

  test("pre-fills fields when editing a task", () => {
    const task = { id: 1, title: "Test Task", priority: "high", status: "in_progress", customFields: {} };
    renderModal(true, task);
    
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("high")).toBeChecked();
    expect(screen.getByRole("combobox", { name: /status/i })).toHaveValue("in_progress");
  });

  test("shows error if title is empty on submit", () => {
    renderModal(true);
    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText("Title is required!")).toBeInTheDocument();
  });

  test("calls dispatch to add a new task", () => {
    renderModal(true);
    fireEvent.change(screen.getByLabelText("Title:"), { target: { value: "New Task" } });
    fireEvent.click(screen.getByText("Save"));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "ADD_TASK" }));
  });

  test("calls dispatch to edit a task", () => {
    const task = { id: 1, title: "Old Task", priority: "low", status: "not_started", customFields: {} };
    renderModal(true, task);
    fireEvent.change(screen.getByLabelText("Title:"), { target: { value: "Updated Task" } });
    fireEvent.click(screen.getByText("Save Changes"));
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "EDIT_TASK" }));
  });

  test("calls onClose when Cancel button is clicked", () => {
    renderModal(true);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
