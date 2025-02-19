import React, { useContext, useState, useCallback } from "react";
import TaskModal from "../modal/task-modal";
import TaskFilters from "../filtering/filtering";
import { filterTasks } from "../../helpers/helpers";
import { PRIORITY_OPTIONS } from "../../helpers/constants";
import AppContext from "../../context";
import "./styles.css";

const KanbanBoard = () => {
  const { tasks } = useContext(AppContext);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPriority, setCurrentPriority] = useState(null);

  const handleEditTask = useCallback((task) => {
    setSelectedTask(task);
    setCurrentPriority(task.priority);
  }, []);

  const handleOpenTaskModal = useCallback((priority) => {
    setCurrentPriority(priority);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setCurrentPriority(null);
  }, []);

  return (
    <>
      <div className="kanban-board">
        {PRIORITY_OPTIONS.map((priority) => (
          <Column
            key={priority}
            priority={priority}
            columnTasks={tasks.filter((task) => task.priority === priority)}
            onOpenTaskModal={handleOpenTaskModal}
            handleEditTask={handleEditTask}
          />
        ))}
      </div>

      {currentPriority && (
        <TaskModal
          isOpen={true}
          onClose={handleCloseTaskModal}
          task={selectedTask}
          defaultPriority={currentPriority}
        />
      )}
    </>
  );
};

const Column = ({ priority, columnTasks, onOpenTaskModal, handleEditTask }) => {
  const { dispatch, ACTIONS, tasks } = useContext(AppContext);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleFilterTitleChange = useCallback((e) => setFilterTitle(e.target.value), []);
  const handleFilterStatusChange = useCallback((e) => setFilterStatus(e.target.value), []);
  const handleClick = useCallback(() => onOpenTaskModal(priority), [onOpenTaskModal, priority]);

  const filters = { filterTitle, filterPriority: priority, filterStatus };
  const filteredTasks = filterTasks(columnTasks, filters);

  /** Drag-and-Drop Handlers */
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("priority", priority); // Store column priority for validation
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, hoveredTaskId, hoveredElement) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData("taskId");
    const draggedTaskPriority = e.dataTransfer.getData("priority");
  
    // Ensure task stays in the same column
    if (draggedTaskPriority !== priority) return;
  
    // Find the dragged and hovered tasks
    const allTasks = [...tasks];
    const draggedTask = allTasks.find((t) => t.id.toString() === draggedTaskId);
    const hoveredTask = allTasks.find((t) => t.id.toString() === hoveredTaskId);
  
    if (!draggedTask || !hoveredTask) return;
  
    // Get tasks from the same priority column
    const columnTasks = allTasks.filter((task) => task.priority === priority);
    const otherTasks = allTasks.filter((task) => task.priority !== priority);
  
    // Remove the dragged task from its current position
    const draggedTaskIndex = columnTasks.findIndex((t) => t.id === draggedTask.id);
    if (draggedTaskIndex !== -1) {
      columnTasks.splice(draggedTaskIndex, 1);
    }
  
    // Get the Y-coordinate of the hovered task's DOM element
    const hoveredRect = hoveredElement.getBoundingClientRect();
    const mouseY = e.clientY; // Mouse Y position
    const hoveredMidY = hoveredRect.top + hoveredRect.height / 2;
  
    // Determine if we should insert **before** or **after**
    const hoveredTaskIndex = columnTasks.findIndex((t) => t.id === hoveredTask.id);
    if (mouseY < hoveredMidY) {
      // Drop before the hovered task
      columnTasks.splice(hoveredTaskIndex, 0, draggedTask);
    } else {
      // Drop after the hovered task
      columnTasks.splice(hoveredTaskIndex + 1, 0, draggedTask);
    }
  
    // Merge reordered column tasks with unchanged tasks
    const updatedTasks = [...columnTasks, ...otherTasks];
  
    dispatch({ type: ACTIONS.REORDER_TASKS, payload: { updatedTasks } });
  };
  
  
  
  

  return (
    <div className="kanban-column">
      <h2 className="kanban-board__title">{priority}</h2>
      <button className="kanban-board__button kanban-board__button--add" onClick={handleClick}>
        + New Task
      </button>
      <TaskFilters
        filterTitle={filterTitle}
        handleFilterTitleChange={handleFilterTitleChange}
        filterStatus={filterStatus}
        handleFilterStatusChange={handleFilterStatusChange}
      />
      <ul className="kanban-board__list" onDragOver={handleDragOver}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              handleEditTask={handleEditTask}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))
        ) : (
          <li className="kanban-board__empty-state">
            No tasks available.
          </li>
        )}
      </ul>
    </div>
  );
};

const TaskCard = ({ task, handleEditTask, onDragStart, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = useCallback(() => handleEditTask(task), [task, handleEditTask]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = () => {
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    setIsDragOver(false);
    onDrop(e, task.id + '', e.currentTarget); // Pass hovered task ID and element
  };
  

  return (
    <li
      className={`kanban-board__item ${isDragOver ? "droppable-zone--hover" : ""}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <button
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        onClick={handleClick}
        className="kanban-board__task"
      >
        <span>{task.title}</span>
        <span className={`task-status task-status--${task.status?.replace(" ", "_").toLowerCase()}`}>
          {task.status.replace("_", " ")}
        </span>
      </button>
    </li>
  );
};


export default KanbanBoard;
