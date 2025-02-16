import { taskReducer, ACTIONS } from "./context";

// Mock localStorage properly before running tests
beforeEach(() => {
  Object.defineProperty(global, "localStorage", {
    value: {
      getItem: jest.fn(() => JSON.stringify([])), // Mock returning empty array
      setItem: jest.fn(), // Correctly mock setItem as a Jest function
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

describe("taskReducer", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      tasks: [],
      customFields: [],
      history: [],
      future: [],
    };
  });

  it("should set tasks with SET_TASKS action", () => {
    const newTasks = [{ id: 1, title: "Task 1" }];
    const newState = taskReducer(initialState, {
      type: ACTIONS.SET_TASKS,
      payload: newTasks,
    });

    expect(newState.tasks).toEqual(newTasks);
  });

  it("should add a new task with ADD_TASK action", () => {
    const newTask = { id: 1, title: "New Task" };
    const newState = taskReducer(initialState, {
      type: ACTIONS.ADD_TASK,
      payload: newTask,
    });

    expect(newState.tasks).toContainEqual(newTask);
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "tasks",
      JSON.stringify([newTask])
    );
  });

  it("should delete a task with DELETE_TASK action", () => {
    const state = {
      ...initialState,
      tasks: [{ id: 1, title: "Task to delete" }],
    };

    const newState = taskReducer(state, {
      type: ACTIONS.DELETE_TASK,
      payload: 1,
    });

    expect(newState.tasks).toEqual([]);
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  it("should edit a task with EDIT_TASK action", () => {
    const state = {
      ...initialState,
      tasks: [{ id: 1, title: "Old Title" }],
    };

    const newState = taskReducer(state, {
      type: ACTIONS.EDIT_TASK,
      payload: { id: 1, data: { title: "Updated Title" } },
    });

    expect(newState.tasks[0].title).toBe("Updated Title");
    expect(global.localStorage.setItem).toHaveBeenCalled();
  });

  it("should handle UNDO action", () => {
    const state = {
      ...initialState,
      tasks: [{ id: 1, title: "Task 1" }],
      history: [[{ id: 1, title: "Old Task" }]],
      future: [],
    };

    const newState = taskReducer(state, { type: ACTIONS.UNDO });

    expect(newState.tasks).toEqual([{ id: 1, title: "Old Task" }]);
    expect(newState.future).toEqual([[{ id: 1, title: "Task 1" }]]);
  });

  it("should handle REDO action", () => {
    const state = {
      ...initialState,
      tasks: [{ id: 1, title: "Old Task" }],
      history: [],
      future: [[{ id: 1, title: "Task 1" }]],
    };

    const newState = taskReducer(state, { type: ACTIONS.REDO });

    expect(newState.tasks).toEqual([{ id: 1, title: "Task 1" }]);
    expect(newState.future).toEqual([]);
  });

  it("should bulk edit tasks", () => {
    const state = {
      ...initialState,
      tasks: [
        { id: 1, title: "Task 1", status: "open", customFields: {} },
        { id: 2, title: "Task 2", status: "open", customFields: {} },
      ],
    };

    const newState = taskReducer(state, {
      type: ACTIONS.BULK_EDIT,
      payload: { taskIds: [1, 2], updates: { status: "closed" } },
    });

    expect(newState.tasks).toEqual([
      { id: 1, title: "Task 1", status: "closed", customFields: {} },
      { id: 2, title: "Task 2", status: "closed", customFields: {} },
    ]);
  });

  it("should add a custom field", () => {
    const newField = { name: "Category", type: "text" };
    const newState = taskReducer(initialState, {
      type: ACTIONS.ADD_CUSTOM_FIELD,
      payload: newField,
    });

    expect(newState.customFields).toContainEqual(newField);
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      "customFields",
      JSON.stringify([newField])
    );
  });

  it("should remove a custom field", () => {
    const state = {
      ...initialState,
      customFields: [{ name: "Category", type: "text" }],
    };

    const newState = taskReducer(state, {
      type: ACTIONS.REMOVE_CUSTOM_FIELD,
      payload: "Category",
    });

    expect(newState.customFields).toEqual([]);
  });
});
