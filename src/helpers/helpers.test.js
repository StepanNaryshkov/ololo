import { sortTasks, filterTasks } from "./helpers";

describe("sortTasks", () => {
  const tasks = [
    { id: 1, title: "Task C", priority: "low", status: "open", customFields: { dueDate: "2023-12-01" } },
    { id: 2, title: "Task A", priority: "high", status: "in_progress", customFields: { dueDate: "2023-11-01" } },
    { id: 3, title: "Task B", priority: "medium", status: "done", customFields: { dueDate: "2023-10-01" } },
  ];

  it("should return tasks as-is if no sort column is provided", () => {
    expect(sortTasks(tasks, null, "asc")).toEqual(tasks);
  });

  it("should sort tasks in ascending order by title", () => {
    const sorted = sortTasks(tasks, "title", "asc");
    expect(sorted.map((t) => t.title)).toEqual(["Task A", "Task B", "Task C"]);
  });

  it("should sort tasks in descending order by title", () => {
    const sorted = sortTasks(tasks, "title", "desc");
    expect(sorted.map((t) => t.title)).toEqual(["Task C", "Task B", "Task A"]);
  });

  it("should sort tasks in ascending order by priority", () => {
    const sorted = sortTasks(tasks, "priority", "asc");
    expect(sorted.map((t) => t.priority)).toEqual(["high", "low", "medium"]);
  });

  it("should sort tasks in descending order by priority", () => {
    const sorted = sortTasks(tasks, "priority", "desc");
    expect(sorted.map((t) => t.priority)).toEqual(["medium", "low", "high"]);
  });

  it("should sort by custom field (dueDate) in ascending order", () => {
    const sorted = sortTasks(tasks, "dueDate", "asc");
    expect(sorted.map((t) => t.customFields.dueDate)).toEqual(["2023-10-01", "2023-11-01", "2023-12-01"]);
  });

  it("should sort by custom field (dueDate) in descending order", () => {
    const sorted = sortTasks(tasks, "dueDate", "desc");
    expect(sorted.map((t) => t.customFields.dueDate)).toEqual(["2023-12-01", "2023-11-01", "2023-10-01"]);
  });
});

describe("filterTasks", () => {
  const tasks = [
    { id: 1, title: "Fix bug", priority: "high", status: "open" },
    { id: 2, title: "Write tests", priority: "medium", status: "in_progress" },
    { id: 3, title: "Deploy app", priority: "low", status: "done" },
  ];

  it("should return all tasks if no filters are applied", () => {
    const filtered = filterTasks(tasks, {});
    expect(filtered).toEqual(tasks);
  });

  it("should filter tasks by title (case insensitive)", () => {
    const filtered = filterTasks(tasks, { filterTitle: "fix" });
    expect(filtered).toEqual([{ id: 1, title: "Fix bug", priority: "high", status: "open" }]);
  });

  it("should filter tasks by priority", () => {
    const filtered = filterTasks(tasks, { filterPriority: "medium" });
    expect(filtered).toEqual([{ id: 2, title: "Write tests", priority: "medium", status: "in_progress" }]);
  });

  it("should filter tasks by status", () => {
    const filtered = filterTasks(tasks, { filterStatus: "done" });
    expect(filtered).toEqual([{ id: 3, title: "Deploy app", priority: "low", status: "done" }]);
  });

  it("should filter tasks by title and priority", () => {
    const filtered = filterTasks(tasks, { filterTitle: "tests", filterPriority: "medium" });
    expect(filtered).toEqual([{ id: 2, title: "Write tests", priority: "medium", status: "in_progress" }]);
  });

  it("should filter tasks by title and status", () => {
    const filtered = filterTasks(tasks, { filterTitle: "deploy", filterStatus: "done" });
    expect(filtered).toEqual([{ id: 3, title: "Deploy app", priority: "low", status: "done" }]);
  });

  it("should return an empty array if no tasks match the filters", () => {
    const filtered = filterTasks(tasks, { filterTitle: "Nonexistent", filterPriority: "high" });
    expect(filtered).toEqual([]);
  });
});
