import "./styles.css";
import ErrorBoundary from "./error-boundary";
import { AppProvider } from "./context";
import TaskTable from "./components/table/table";

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <h1>Task Manager from Ololo ':)'</h1>
        <TaskTable />
      </ErrorBoundary>
    </AppProvider>
  );
}
