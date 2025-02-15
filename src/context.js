import React, { createContext, useReducer, useEffect, useCallback } from "react";
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
  UNDO: "UNDO",
  REDO: "REDO",
};

// Initial state
const initialState = {
  tasks: loadTasks(),
  customFields: loadCustomFields(),
  history: [],
  future: [],
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Reducer function
const taskReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload };

    case ACTIONS.ADD_TASK:
      newState = { 
        ...state, 
        tasks: [action.payload, ...state.tasks],
        history: [...state.history, state.tasks], 
        future: []
      };
      saveTasks(newState.tasks);
      break;

    case ACTIONS.DELETE_TASK:
      newState = { 
        ...state, 
        tasks: state.tasks.filter(task => task.id !== action.payload),
        history: [...state.history, state.tasks], 
        future: []
      };
      saveTasks(newState.tasks);
      break;

    case ACTIONS.EDIT_TASK:
      newState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.data } : task
        ),
        history: [...state.history, state.tasks], 
        future: []
      };
      saveTasks(newState.tasks);
      break;

    case ACTIONS.UNDO:
      if (state.history.length === 0) return state;
      const previousTasks = state.history[state.history.length - 1];
      newState = {
        ...state,
        tasks: previousTasks,
        history: state.history.slice(0, -1),
        future: [state.tasks, ...state.future],
      };
      saveTasks(newState.tasks);
      break;

    case ACTIONS.REDO:
      if (state.future.length === 0) return state;
      const nextTasks = state.future[0];
      newState = {
        ...state,
        tasks: nextTasks,
        history: [...state.history, state.tasks],
        future: state.future.slice(1),
      };
      saveTasks(newState.tasks);
      break;

    default:
      return state;
  }
  return newState;
};

// Context provider
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      const apiTasks = await fetchData();
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
