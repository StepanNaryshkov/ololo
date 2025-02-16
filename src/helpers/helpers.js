export const sortTasks = (tasks, sortColumn, sortOrder) => {
    if (!sortColumn) return tasks;
  
    return [...tasks].sort((a, b) => {
      const aValue = a[sortColumn] ?? a.customFields?.[sortColumn] ?? "";
      const bValue = b[sortColumn] ?? b.customFields?.[sortColumn] ?? "";
  
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };
  
  export const filterTasks = (tasks, filters) => {
    const { filterTitle, filterPriority, filterStatus } = filters;
  
    return tasks.filter((task) => {
      const matchesTitle = filterTitle
        ? task.title.toLowerCase().includes(filterTitle.toLowerCase())
        : true;
  
      const matchesPriority = filterPriority ? task.priority === filterPriority : true;
  
      const matchesStatus = filterStatus ? task.status === filterStatus : true;
  
      return matchesTitle && matchesPriority && matchesStatus;
    });
  };