import React from "react";
import KanbanColumn from "./KanbanColumn";
import "./Kanban.css";

function KanbanBoard({ items, columns, type, statusOptions, onStatusChange, canEdit }) {
  const getItemsByStatus = (status) => {
    return items.filter((item) => item.status === status);
  };

  return (
    <div className="kanban-container">
      {columns.map((column) => (
        <KanbanColumn
          key={column}
          title={column}
          items={getItemsByStatus(column)}
          type={type}
          statusOptions={statusOptions}
          onStatusChange={onStatusChange}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;
