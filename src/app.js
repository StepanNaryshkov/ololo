import React, { useState, useCallback } from "react";
import "./styles.css";
import ErrorBoundary from "./error-boundary";
import { AppProvider } from "./context";
import TaskTable from "./components/table/table";
import Kanban from "./components/kanban/kanban";

const ViewToggle = ({ currentView, setView }) => {
  const handleSetKanban = useCallback(() => setView("kanban"), [setView]);
  const handleSetTable = useCallback(() => setView("table"), [setView]);

  return (
    <div className="view-toggle">
      <button onClick={handleSetKanban} className={`toggle-button ${currentView === "kanban" ? "active" : ""}`}>
        Kanban
      </button>
      <button onClick={handleSetTable} className={`toggle-button ${currentView === "table" ? "active" : ""}`}>
        Table
      </button>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("table");

  return (
    <AppProvider>
      <ErrorBoundary>
        <h1>Task Manager from Ololo ❤️</h1>
        <ViewToggle currentView={view} setView={setView} />
        {view === "kanban" ? <Kanban /> : <TaskTable />}
      </ErrorBoundary>
    </AppProvider>
  );
}
