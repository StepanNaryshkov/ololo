import React, { useContext, useCallback, useEffect } from "react";
import AppContext from "../../context";
import "./styles.css";

const Header = ({ onOpenTaskModal, onOpenCustomFieldsModal }) => {
  const { dispatch, history, future, ACTIONS } = useContext(AppContext);

  const handleUndo = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO });
  }, [dispatch, ACTIONS]);

  const handleRedo = useCallback(() => {
    dispatch({ type: ACTIONS.REDO });
  }, [dispatch, ACTIONS]);

  // Add keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      }
      if (event.ctrlKey && event.key === "y") {
        handleRedo();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleUndo, handleRedo]);

  return (
    <header className="header">
      <button
        className="header__button header__button--undo"
        onClick={handleUndo}
        disabled={history.length === 0}
      >
        ⬅ Undo
      </button>
      <button
        className="header__button header__button--redo"
        onClick={handleRedo}
        disabled={future.length === 0}
      >
        ➡ Redo
      </button>
      <button
        className="header__button header__button--custom"
        onClick={onOpenCustomFieldsModal}
      >
        ⚙️ Manage Custom Fields
      </button>
      <button
        className="header__button header__button--add"
        onClick={onOpenTaskModal}
      >
        + New Task
      </button>
    </header>
  );
};

export default Header;
