export const PRIORITY_OPTIONS = ["high", "medium", "low", "urgent"];

export const STATUSES = ["not_started", "pending", "in_progress", "completed"];

export const STATUS_OPTIONS = STATUSES.map((status) => ({
  value: status,
  label: status.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize each word
}));

export const SORT_ORDERS = {
    ASC: "asc",
    DESC: "desc",
  };