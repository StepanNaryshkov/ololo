import React, { useCallback } from 'react';

const SortableColumnHeader = ({ col, handleSort, getSortIcon }) => {
  const onSort = useCallback(() => handleSort(col), [handleSort, col]);

  return (
    <th
      className="task-table__header task-table__header--clickable"
      onClick={onSort}
    >
      {col.charAt(0).toUpperCase() + col.slice(1)} {getSortIcon(col)}
    </th>
  );
};

export default SortableColumnHeader;