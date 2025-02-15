import "./styles.css";
import ErrorBoundary from "./error-boundary";
import { AppProvider } from "./context";
import TaskTable from "./components/table/table";

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <TaskTable />
      </ErrorBoundary>
    </AppProvider>
  );
}
