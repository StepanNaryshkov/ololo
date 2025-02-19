import React, { useState, useContext, useCallback, useEffect } from "react";
import AppContext from "../../context";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../../helpers/constants";
import "./styles.css";

const TaskModal = ({ isOpen, onClose, task = null, defaultPriority }) => {
  const { dispatch, ACTIONS, customFields } = useContext(AppContext);
  const predefinedPriority = defaultPriority || "medium";
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(predefinedPriority);

  const [status, setStatus] = useState("not_started");
  const [error, setError] = useState("");
  const [customFieldValues, setCustomFieldValues] = useState({});

  // Reset fields when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setPriority(predefinedPriority);
      setStatus("not_started");
      setCustomFieldValues({});
      setError("");
    }
  }, [isOpen, predefinedPriority]);

  // Populate fields when editing a task
  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title);
      setPriority(task.priority);
      setStatus(task.status);
      setCustomFieldValues(task.customFields || {});
    }
  }, [isOpen, task]);

  // Handlers for standard fields
  const handleTitleChange = useCallback((e) => setTitle(e.target.value), []);
  const handlePriorityChange = useCallback(
    (e) => setPriority(e.target.value),
    [],
  );
  const handleStatusChange = useCallback((e) => setStatus(e.target.value), []);

  // Handler for custom fields
  const handleCustomFieldChange = useCallback((e, field) => {
    setCustomFieldValues((prevValues) => ({
      ...prevValues,
      [field.name]:
        field.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!title.trim()) {
        setError("Title is required!");
        return;
      }

      if (task) {
        dispatch({
          type: ACTIONS.EDIT_TASK,
          payload: {
            id: task.id,
            data: { title, priority, status, customFields: customFieldValues },
          },
        });
      } else {
        const newTask = {
          id: Date.now(),
          title,
          priority,
          status,
          customFields: customFieldValues,
        };
        dispatch({ type: ACTIONS.ADD_TASK, payload: newTask });
      }

      onClose();
    },
    [
      title,
      priority,
      status,
      customFieldValues,
      task,
      dispatch,
      ACTIONS,
      onClose,
    ],
  );

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal">
        <h2 id="modal-title">{task ? "Edit Task" : "Add New Task"}</h2>

        {error && (
          <p className="modal__error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className="modal__label">
            Title:
          </label>
          <input
            autoFocus
            id="title"
            className="modal__input"
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
          />

          {/* Priority Selection */}
          <fieldset className="modal__fieldset">
            <legend className="modal__legend">Priority:</legend>
            {PRIORITY_OPTIONS.map((option) => (
              <label key={option} className="modal__radio">
                <input
                  type="radio"
                  name="priority"
                  value={option}
                  checked={priority === option}
                  onChange={handlePriorityChange}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </fieldset>

          {/* Status Dropdown */}
          <label htmlFor="status" className="modal__label">
            Status:
          </label>
          <select
            id="status"
            className="modal__select"
            value={status}
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <>
              <h3 className="modal__section-title">Custom Fields</h3>
              {customFields.map((field) => (
                <div key={field.name} className="modal__custom-field">
                  <label className="modal__label">{field.name}:</label>
                  {field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      className="modal__checkbox"
                      checked={!!customFieldValues[field.name]} // Ensures checkbox is editable
                      onChange={(e) => handleCustomFieldChange(e, field)} // onChange now correctly updates state
                    />
                  ) : (
                    <input
                      type={field.type}
                      className="modal__input"
                      value={customFieldValues[field.name] || ""}
                      onChange={(e) => handleCustomFieldChange(e, field)}
                    />
                  )}
                </div>
              ))}
            </>
          )}

          <div className="modal__actions">
            <button type="submit" className="modal__button modal__button--save">
              {task ? "Save Changes" : "Save"}
            </button>
            <button
              type="button"
              className="modal__button modal__button--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
