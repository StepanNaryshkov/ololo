import React from "react";

const CustomFieldCell = ({ field, task }) => {
    const isChecked =
      field.type === "checkbox" && task.customFields?.[field.name];
  
    return (
      <td
        className={`task-table__cell task-table__cell--custom ${
          isChecked ? "task-table__cell--checked" : ""
        }`}
      >
        {field.type === "checkbox" ? (
          <input type="checkbox" disabled checked={!!isChecked} />
        ) : (
          (task.customFields?.[field.name] ?? "N/A")
        )}
      </td>
    );
  };

export default CustomFieldCell;