import { createContext, useReducer, useEffect } from "react";
import { fetchData } from "./api/get-all";

// Load from localStorage
const loadTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
const loadCustomFields = () => JSON.parse(localStorage.getItem("customFields")) || [];

// Define actions
const ACTIONS = {
  SET_TASKS: "SET_TASKS",
  ADD_TASK: "ADD_TASK",
  DELETE_TASK: "DELETE_TASK",
  EDIT_TASK: "EDIT_TASK",
  SET_CUSTOM_FIELDS: "SET_CUSTOM_FIELDS",
  ADD_CUSTOM_FIELD: "ADD_CUSTOM_FIELD",
  REMOVE_CUSTOM_FIELD: "REMOVE_CUSTOM_FIELD",
};

// Reducer function
const taskReducer = (state, action) => {
  console.log("Reducer Action:", action.type);
  
  switch (action.type) {
    case ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload };

    case ACTIONS.ADD_TASK:
      const newTasks = [action.payload, ...state.tasks];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return { ...state, tasks: newTasks };

    case ACTIONS.DELETE_TASK:
      const filteredTasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(filteredTasks));
      return { ...state, tasks: filteredTasks };

    case ACTIONS.EDIT_TASK:
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id ? { ...task, ...action.payload.data } : task
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };

    case ACTIONS.SET_CUSTOM_FIELDS:
      localStorage.setItem("customFields", JSON.stringify(action.payload));
      return { ...state, customFields: action.payload };

    case ACTIONS.ADD_CUSTOM_FIELD:
      const newFields = [...state.customFields, action.payload];
      localStorage.setItem("customFields", JSON.stringify(newFields));
      return { ...state, customFields: newFields };

    case ACTIONS.REMOVE_CUSTOM_FIELD:
      const filteredFields = state.customFields.filter(field => field.name !== action.payload);
      const updatedTasksForField = state.tasks.map(task => {
        const newTask = { ...task };
        delete newTask[action.payload]; // Remove field from all tasks
        return newTask;
      });

      localStorage.setItem("customFields", JSON.stringify(filteredFields));
      localStorage.setItem("tasks", JSON.stringify(updatedTasksForField));

      return { ...state, customFields: filteredFields, tasks: updatedTasksForField };

    default:
      return state;
  }
};

// Context provider
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: loadTasks(),
    customFields: loadCustomFields(),
  });

  useEffect(() => {
    const loadData = async () => {
      const apiTasks = await fetchData();
      console.log("API Tasks:", apiTasks);

      dispatch({ type: ACTIONS.SET_TASKS, payload: apiTasks });
    };

    loadData();
  }, []);

  return (
    <AppContext.Provider value={{ ...state, dispatch, ACTIONS }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
