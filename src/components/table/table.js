import React, { useContext, useState, useCallback } from "react";
import AppContext from "../../context";
import Pagination from "../pagination/pagination";
import TaskModal from "../modal/task-modal";
import Header from "../header/header";
import TaskBulkActions from "./task-bulk-actions";
import CustomFieldCell from "./custom-field-cell";
import CustomFieldHeader from "./custom-field-header";
import CustomFieldsModal from "../modal/fields-modal";
import SortableColumnHeader from "./sortable-column-header";
import TaskFilters from "../filtering/filtering";
import { sortTasks, filterTasks } from "../../helpers/helpers";
import {
  SORT_ORDERS,
  ITEMS_PER_PAGE_OPTIONS,
} from "../../helpers/constants";
import "./styles.css";

const columns = ["id", "title", "status", "priority"];

const TaskTable = () => {
  const { tasks, customFields, dispatch, ACTIONS } = useContext(AppContext);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCustomFieldsModalOpen, setIsCustomFieldsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkPriority, setBulkPriority] = useState("");

  const handleBulkEdit = useCallback(() => {
    if (selectedTasks.size === 0) return;

    dispatch({
      type: ACTIONS.BULK_EDIT,
      payload: {
        taskIds: Array.from(selectedTasks),
        updates: Object.fromEntries(
          Object.entries({
            status: bulkStatus,
            priority: bulkPriority,
          }).filter(([_, value]) => value), // Only include selected values
        ),
      },
    });

    setSelectedTasks(new Set());
    setBulkStatus("");
    setBulkPriority("");
  }, [selectedTasks, bulkStatus, bulkPriority, dispatch, ACTIONS]);

  /** Sorting logic */
  const handleSort = useCallback(
    (column) => {
      setSortOrder((prevOrder) =>
        sortColumn === column
          ? prevOrder === SORT_ORDERS.ASC
            ? SORT_ORDERS.DESC
            : SORT_ORDERS.ASC
          : SORT_ORDERS.ASC,
      );
      setSortColumn(column);
    },
    [sortColumn],
  );

  /** Filtering handlers */
  const handleFilterTitleChange = useCallback((e) => {
    setFilterTitle(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterPriorityChange = useCallback((e) => {
    setFilterPriority(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterStatusChange = useCallback((e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const filters = { filterTitle, filterPriority, filterStatus };
  const filteredTasks = filterTasks(tasks, filters);

  const sortedTasks = sortTasks(filteredTasks, sortColumn, sortOrder);

  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedTasks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedTasks.size === 0) return;
    const confirmDelete = window.confirm(`Delete ${selectedTasks.size} tasks?`);
    if (!confirmDelete) return;

    // Remove selected tasks
    selectedTasks.forEach((taskId) => {
      dispatch({ type: ACTIONS.DELETE_TASK, payload: taskId });
    });

    setSelectedTasks(new Set());

    // Check if the current page becomes empty after deletion
    const remainingTasks = tasks.length - selectedTasks.size;
    const newTotalPages = Math.ceil(remainingTasks / itemsPerPage);

    if (newTotalPages > 0 && currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    } else if (remainingTasks === 0) {
      setCurrentPage(1);
    }
  }, [selectedTasks, tasks, itemsPerPage, currentPage, dispatch, ACTIONS]);

  const toggleTaskSelection = useCallback((taskId) => {
    setSelectedTasks((prevSelected) => {
      const updatedSelection = new Set(prevSelected);
      updatedSelection.has(taskId)
        ? updatedSelection.delete(taskId)
        : updatedSelection.add(taskId);
      return updatedSelection;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedTasks((prevSelected) => {
      const currentPageTaskIds = new Set(paginatedData.map((task) => task.id));

      // If all tasks on the current page are already selected, deselect them
      const allSelected = paginatedData.every((task) =>
        prevSelected.has(task.id),
      );

      if (allSelected) {
        const newSelection = new Set(prevSelected);
        currentPageTaskIds.forEach((id) => newSelection.delete(id));
        return newSelection;
      }

      // Otherwise, add only the tasks on the current page to the selection
      return new Set([...prevSelected, ...currentPageTaskIds]);
    });
  }, [paginatedData]);

  const handleOpenTaskModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleOpenCustomFieldsModal = useCallback(() => {
    setIsCustomFieldsModalOpen((prev) => !prev);
  }, []);

  const handleDeleteTask = useCallback(
    (taskId) => {
      dispatch({ type: ACTIONS.DELETE_TASK, payload: taskId });
    },
    [dispatch, ACTIONS],
  );

  const handleEditTask = useCallback((task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const getSortIcon = useCallback(
    (column) =>
      sortColumn === column
        ? sortOrder === SORT_ORDERS.ASC
          ? "⬆"
          : "⬇"
        : "",
    [sortColumn, sortOrder],
  );

  const isEmpty = paginatedData.length === 0;

  return (
    <>
      <Header
        onOpenCustomFieldsModal={handleOpenCustomFieldsModal}
        onOpenTaskModal={handleOpenTaskModal}
      />

      <div className="task-table">
        {!isEmpty && <>
            <TaskBulkActions
              selectedTasks={selectedTasks}
              bulkStatus={bulkStatus}
              setBulkStatus={setBulkStatus}
              bulkPriority={bulkPriority}
              setBulkPriority={setBulkPriority}
              handleBulkEdit={handleBulkEdit}
              handleBulkDelete={handleBulkDelete}
            />
            <TaskFilters
              filterTitle={filterTitle}
              handleFilterTitleChange={handleFilterTitleChange}
              filterPriority={filterPriority}
              handleFilterPriorityChange={handleFilterPriorityChange}
              filterStatus={filterStatus}
              handleFilterStatusChange={handleFilterStatusChange}
              itemsPerPage={itemsPerPage}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        }

        {isEmpty ? (
          <div className="task-table__empty">
            <p>No tasks found. Create a new one!</p>
          </div>
        ) : (
          <>
            <main className="task-table__wrapper">
              <table className="task-table__table">
                <thead className="task-table__head">
                  <tr className="task-table__row">
                    <th className="task-table__header">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={selectedTasks.size === paginatedData.length}
                      />
                    </th>
                    {columns.map((col) => (
                      <SortableColumnHeader
                        key={col}
                        col={col}
                        handleSort={handleSort}
                        getSortIcon={getSortIcon}
                      />
                    ))}
                    {customFields.map((field) => (
                      <CustomFieldHeader
                        key={field.name}
                        field={field}
                        handleSort={handleSort}
                        getSortIcon={getSortIcon}
                      />
                    ))}
                    <th className="task-table__header">Actions</th>
                  </tr>
                </thead>
                <tbody className="task-table__body">
                  {paginatedData.map((task) => (
                    <tr key={task.id} className="task-table__row">
                      <td className="task-table__cell">
                        <input
                          type="checkbox"
                          className="task-table__checkbox"
                          onChange={() => toggleTaskSelection(task.id)}
                          checked={selectedTasks.has(task.id)}
                        />
                      </td>
                      <td className="task-table__cell">{task.id}</td>
                      <td className="task-table__cell">{task.title}</td>
                      <td className="task-table__cell">
                        <div
                          className={`task-table__status task-table__status--${task.status?.replace(" ", "_").toLowerCase()}`}
                        >
                          {task.status.replace("_", " ")}
                        </div>
                      </td>
                      <td
                        className={`task-table__cell task-table__priority task-table__priority--${task.priority?.replace(" ", "_").toLowerCase()}`}
                      >
                        {task.priority}
                      </td>
                      {customFields.map((field) => (
                        <CustomFieldCell
                          key={field.name}
                          field={field}
                          task={task}
                        />
                      ))}
                      <td className="task-table__cell">
                        <div className="flex">
                          <button
                            className="task-table__delete-button"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            X
                          </button>
                          <button
                            className="task-table__edit-button flex"
                            onClick={() => handleEditTask(task)}
                          >
                            <span>✏️</span> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </main>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseTaskModal}
          task={selectedTask}
        />
        <CustomFieldsModal
          isOpen={isCustomFieldsModalOpen}
          onClose={handleOpenCustomFieldsModal}
        />
      </div>
    </>
  );
};

export default TaskTable;
