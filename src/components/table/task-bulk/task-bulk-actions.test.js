import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskBulkActions from "./task-bulk-actions";
import { STATUSES, PRIORITY_OPTIONS } from "../../../helpers/constants";

describe("TaskBulkActions", () => {
  const setBulkStatus = jest.fn();
  const setBulkPriority = jest.fn();
  const handleBulkEdit = jest.fn();
  const handleBulkDelete = jest.fn();

  it("calls setBulkStatus on status change", () => {
    render(
      <TaskBulkActions
        selectedTasks={new Set(["task1", "task2"])}
        bulkStatus=""
        setBulkStatus={setBulkStatus}
        bulkPriority=""
        setBulkPriority={setBulkPriority}
        handleBulkEdit={handleBulkEdit}
        handleBulkDelete={handleBulkDelete}
      />
    );

    const statusSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(statusSelect, { target: { value: STATUSES[0] } });

    expect(setBulkStatus).toHaveBeenCalledWith(STATUSES[0]);
  });

  it("calls setBulkPriority on priority change", () => {
    render(
      <TaskBulkActions
        selectedTasks={new Set(["task1", "task2"])}
        bulkStatus=""
        setBulkStatus={setBulkStatus}
        bulkPriority=""
        setBulkPriority={setBulkPriority}
        handleBulkEdit={handleBulkEdit}
        handleBulkDelete={handleBulkDelete}
      />
    );

    const prioritySelect = screen.getAllByRole("combobox")[1]; // Second select is for priority
    fireEvent.change(prioritySelect, { target: { value: PRIORITY_OPTIONS[0] } });

    expect(setBulkPriority).toHaveBeenCalledWith(PRIORITY_OPTIONS[0]);
  });
});
