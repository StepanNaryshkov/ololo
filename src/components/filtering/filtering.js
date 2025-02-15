import React from "react";
import "./styles.css";

const PRIORITY_OPTIONS = ["high", "medium", "low", "urgent"];
const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

const TaskFilters = ({
  filterTitle,
  handleFilterTitleChange,
  filterPriority,
  handleFilterPriorityChange,
  filterStatus,
  handleFilterStatusChange,
  itemsPerPage,
  handleItemsPerPageChange
}) => {
  return (
    <div className="task-filters">
      <input 
        type="text" 
        className="task-filters__input"
        placeholder="Search title..." 
        value={filterTitle}
        onChange={handleFilterTitleChange}
      />

      <select 
        className="task-filters__select"
        value={filterPriority}
        onChange={handleFilterPriorityChange}
      >
        <option value="">All Priorities</option>
        {PRIORITY_OPTIONS.map(priority => (
          <option key={priority} value={priority}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </option>
        ))}
      </select>

      <select 
        className="task-filters__select"
        value={filterStatus}
        onChange={handleFilterStatusChange}
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select 
        className="task-filters__select"
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
      >
        {ITEMS_PER_PAGE_OPTIONS.map(size => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskFilters;
