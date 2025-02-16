import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskTable from "./table";
import AppContext from "../../context";

describe("TaskTable Component", () => {
  const mockDispatch = jest.fn();
  const renderTaskTable = (tasks = [], customFields = [], history = [], future = []) => {
    render(
      <AppContext.Provider
        value={{
          tasks,
          customFields,
          dispatch: mockDispatch,
          history,
          future,
          ACTIONS: { DELETE_TASK: "DELETE_TASK", BULK_EDIT: "BULK_EDIT", UNDO: "UNDO", REDO: "REDO" },
        }}
      >
        <TaskTable />
      </AppContext.Provider>
    );  
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with no tasks", () => {
    renderTaskTable();
    expect(screen.getByText("No tasks found. Create a new one!"))
      .toBeInTheDocument();
  });

  test("renders tasks when provided", () => {
    const tasks = [
      { id: 1, title: "Test Task", status: "pending", priority: "high" },
      { id: 2, title: "Another Task", status: "completed", priority: "low" }
    ];
    renderTaskTable(tasks);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Another Task")).toBeInTheDocument();
  });

  test("calls dispatch to delete a task", () => {
    const tasks = [{ id: 1, title: "Task to Delete", status: "pending", priority: "medium" }];
    renderTaskTable(tasks);

    fireEvent.click(screen.getByText("X"));
    expect(mockDispatch).toHaveBeenCalledWith({ type: "DELETE_TASK", payload: 1 });
  });

  test("calls bulk edit action on selected tasks", () => {
    const tasks = [
      { id: 1, title: "Task One", status: "pending", priority: "medium" },
      { id: 2, title: "Task Two", status: "pending", priority: "high" }
    ];
    renderTaskTable(tasks);

    fireEvent.click(screen.getAllByRole("checkbox")[1]); // Select first task
    fireEvent.click(screen.getAllByRole("checkbox")[2]); // Select second task
    fireEvent.click(screen.getByText("Apply"));
    
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "BULK_EDIT" }));
  });
});
