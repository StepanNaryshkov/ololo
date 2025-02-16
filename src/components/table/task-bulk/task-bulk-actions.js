import React, { useCallback } from "react";
import {
    STATUSES,
    PRIORITY_OPTIONS,
  } from "../../../helpers/constants";

const TaskBulkActions = ({
  selectedTasks,
  bulkStatus,
  setBulkStatus,
  bulkPriority,
  setBulkPriority,
  handleBulkEdit,
  handleBulkDelete,
}) => {
  const onBulkStatusChange = useCallback(
    (e) => setBulkStatus(e.target.value),
    [setBulkStatus],
  );
  const onBulkPriorityChange = useCallback(
    (e) => setBulkPriority(e.target.value),
    [setBulkPriority],
  );

  if (selectedTasks.size <= 1) return null; // Hide if less than 2 tasks selected

  return (
    <div className="task-bulk-actions">
      <span>{selectedTasks.size} selected</span>

      <select
        className="task-bulk-actions__select"
        value={bulkStatus}
        onChange={onBulkStatusChange}
      >
        <option value="">Change Status</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status?.replace("_", " ")}
          </option>
        ))}
      </select>

      <select
        className="task-bulk-actions__select"
        value={bulkPriority}
        onChange={onBulkPriorityChange}
      >
        <option value="">Change Priority</option>
        {PRIORITY_OPTIONS.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>

      <button className="task-bulk-actions__button" onClick={handleBulkEdit}>
        Apply
      </button>
      <button
        className="task-bulk-actions__button task-bulk-actions__button--delete"
        onClick={handleBulkDelete}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default TaskBulkActions;