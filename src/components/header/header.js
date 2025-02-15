import React from "react";
import "./styles.css"; // ✅ Separate styles for the header

const TaskTableHeader = ({ onOpenCustomFieldsModal, onOpenTaskModal }) => {
  return (
    <header className="task-table-header">
      <button className="task-table-header__manage-fields" onClick={onOpenCustomFieldsModal}>
        ⚙️ Manage Custom Fields
      </button>
      <button className="task-table-header__add-button" onClick={onOpenTaskModal}>
        + New Task
      </button>
    </header>
  );
};

export default TaskTableHeader;
