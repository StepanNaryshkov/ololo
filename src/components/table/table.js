import React, { useContext, useState, useCallback } from "react";
import AppContext from "../../context";
import Pagination from "../pagination/pagination";
import TaskModal from "../modal/task-modal";
import Header from "../header/header";
import CustomFieldsModal from "../modal/fields-modal";
import TaskFilters from "../filtering/filtering"; // ✅ Import filter component
import "./styles.css";

const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
};

const TaskTable = () => {
  const { tasks, customFields, dispatch, ACTIONS } = useContext(AppContext);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCustomFieldsModalOpen, setIsCustomFieldsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  /** ✅ Sorting logic */
  const handleSort = useCallback((column) => {
    setSortOrder((prevOrder) =>
      sortColumn === column ? (prevOrder === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : SORT_ORDERS.ASC) : SORT_ORDERS.ASC
    );
    setSortColumn(column);
  }, [sortColumn]);

  /** ✅ Filtering handlers */
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

  /** ✅ Sorting logic */
  const sortedTasks = sortColumn
    ? [...tasks].sort((a, b) => {
        const aValue = a[sortColumn] ?? a.customFields?.[sortColumn] ?? "";
        const bValue = b[sortColumn] ?? b.customFields?.[sortColumn] ?? "";

        if (aValue < bValue) return sortOrder === SORT_ORDERS.ASC ? -1 : 1;
        if (aValue > bValue) return sortOrder === SORT_ORDERS.ASC ? 1 : -1;
        return 0;
      })
    : tasks;

  /** ✅ Pagination logic */
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedTasks.slice(startIndex, startIndex + itemsPerPage);

  /** ✅ Button Click Handlers */
  const handleOpenTaskModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleOpenCustomFieldsModal = useCallback(() => {
    setIsCustomFieldsModalOpen((prev) => !prev);
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    dispatch({ type: ACTIONS.DELETE_TASK, payload: taskId });
  }, [dispatch, ACTIONS]);

  const handleEditTask = useCallback((task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  /** ✅ Function to display sorting icons */
  const getSortIcon = useCallback(
    (column) => (sortColumn === column ? (sortOrder === SORT_ORDERS.ASC ? "⬆" : "⬇") : ""),
    [sortColumn, sortOrder]
  );

  return (
    <>
      <Header
        onOpenCustomFieldsModal={handleOpenCustomFieldsModal}
        onOpenTaskModal={handleOpenTaskModal}
      />

      <div className="task-table">
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

        <table className="task-table__table">
          <thead className="task-table__head">
            <tr className="task-table__row">
              <th className="task-table__header table__header--clickable" onClick={() => handleSort("id")}>
                ID {getSortIcon("id")}
              </th>
              <th className="task-table__header table__header--clickable" onClick={() => handleSort("title")}>
                Title {getSortIcon("title")}
              </th>
              <th className="task-table__header table__header--clickable" onClick={() => handleSort("status")}>
                Status {getSortIcon("status")}
              </th>
              <th className="task-table__header table__header--clickable" onClick={() => handleSort("priority")}>
                Priority {getSortIcon("priority")}
              </th>
              {customFields.map((field) => (
                <th key={field.name} className="task-table__header" onClick={() => handleSort(field.name)}>
                  {field.name} {getSortIcon(field.name)}
                </th>
              ))}
              <th className="task-table__header">Actions</th>
            </tr>
          </thead>
          <tbody className="task-table__body">
            {paginatedData.map((task) => (
              <tr key={task.id} className="task-table__row">
                <td className="task-table__cell">{task.id}</td>
                <td className="task-table__cell">{task.title}</td>
                <td className="task-table__cell">
                  <div className={`task-table__status task-table__status--${task.status.replace(" ", "_").toLowerCase()}`}>
                    {task.status.replace("_", " ")}
                  </div>
                </td>
                <td className={`task-table__cell task-table__priority task-table__priority--${task.priority.replace(" ", "_").toLowerCase()}`}>
                  {task.priority}
                </td>
                {customFields.map((field) => (
                  <td key={field.name} className={`task-table__cell task-table__cell--custom ${
                    field.type === "checkbox" && task.customFields?.[field.name] ? "task-table__cell--checked" : ""
                  }`}>
                    {field.type === "checkbox" ? (
                      <input type="checkbox" disabled checked={!!task.customFields?.[field.name]} />
                    ) : (
                      task.customFields?.[field.name] ?? "N/A"
                    )}
                  </td>
                ))}
                <td className="task-table__cell">
                  <button className="task-table__delete-button" onClick={() => handleDeleteTask(task.id)}>
                    X
                  </button>
                  <button className="task-table__edit-button" onClick={() => handleEditTask(task)}>
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        <TaskModal isOpen={isModalOpen} onClose={handleCloseTaskModal} task={selectedTask} />
        <CustomFieldsModal isOpen={isCustomFieldsModalOpen} onClose={handleOpenCustomFieldsModal} />
      </div>
    </>
  );
};

export default TaskTable;
