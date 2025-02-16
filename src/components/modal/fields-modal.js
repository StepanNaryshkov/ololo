import React, { useState, useContext, useCallback } from "react";
import AppContext from "../../context";

const fieldTypes = ["text", "number", "checkbox"];

const CustomFieldsModal = ({ isOpen, onClose }) => {
  const { customFields, dispatch, ACTIONS } = useContext(AppContext);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [error, setError] = useState("");

  const handleFieldNameChange = useCallback(
    (e) => setFieldName(e.target.value),
    [],
  );
  const handleFieldTypeChange = useCallback(
    (e) => setFieldType(e.target.value),
    [],
  );

  const handleAddField = useCallback(() => {
    if (
      !fieldName.trim() ||
      customFields.some((field) => field.name === fieldName)
    ) {
      setError("Invalid or duplicate field name!");
      return;
    }

    dispatch({
      type: ACTIONS.ADD_CUSTOM_FIELD,
      payload: { name: fieldName, type: fieldType },
    });
    setFieldName("");
    setError("");
  }, [fieldName, fieldType, customFields, dispatch, ACTIONS]);

  const handleRemoveField = useCallback(
    (name) => {
      dispatch({ type: ACTIONS.REMOVE_CUSTOM_FIELD, payload: name });
    },
    [dispatch, ACTIONS],
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal__title">Manage Custom Fields</h2>

        <label className="modal__label">Field Name:</label>
        <input
          autoFocus
          type="text"
          className="modal__input"
          placeholder="Field name"
          value={fieldName}
          onChange={handleFieldNameChange}
        />

        <label className="modal__label">Field Type:</label>
        <select
          className="modal__select"
          value={fieldType}
          onChange={handleFieldTypeChange}
        >
          {fieldTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button
          className="modal__button modal__button--add"
          onClick={handleAddField}
        >
          Add Field
        </button>
        {error && <p className="modal__error">{error}</p>}

        <ul className="modal__list">
          {customFields.map((field) => (
            <li key={field.name} className="modal__list-item">
              {field.name} ({field.type})
              <button
                className="modal__button modal__button--delete"
                onClick={() => handleRemoveField(field.name)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        <button
          className="modal__button modal__button--close"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomFieldsModal;
