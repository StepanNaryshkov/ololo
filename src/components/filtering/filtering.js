import React from "react";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  ITEMS_PER_PAGE_OPTIONS,
} from "../../helpers/constants";
import "./styles.css";

const TaskFilters = ({
  filterTitle,
  handleFilterTitleChange,
  filterPriority,
  handleFilterPriorityChange,
  filterStatus,
  handleFilterStatusChange,
  itemsPerPage,
  handleItemsPerPageChange,
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

      <label htmlFor="priority-filter" className="visually-hidden">Priority:</label>
      <select
        id="priority-filter"
        className="task-filters__select"
        value={filterPriority}
        onChange={handleFilterPriorityChange}
      >
        <option value="">All Priorities</option>
        {PRIORITY_OPTIONS.map((priority) => (
          <option key={priority} value={priority}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </option>
        ))}
      </select>

      <label htmlFor="status-filter" className="visually-hidden">Status:</label>
      <select
        id="status-filter"
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

      <label htmlFor="items-per-page" className="visually-hidden">Items per page:</label>
      <select
        id="items-per-page"
        className="task-filters__select"
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
      >
        {ITEMS_PER_PAGE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskFilters;
