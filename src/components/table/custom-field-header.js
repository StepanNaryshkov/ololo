import React, { useCallback } from 'react';

const CustomFieldHeader = ({ field, handleSort, getSortIcon }) => {
  const onSort = useCallback(
    () => handleSort(field.name),
    [handleSort, field.name],
  );

  return (
    <th className="task-table__header" onClick={onSort}>
      {field.name} {getSortIcon(field.name)}
    </th>
  );
};

export default CustomFieldHeader;