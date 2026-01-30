import React from "react";
import KanbanCard from "./KanbanCard";

function KanbanColumn({ title, items, type, statusOptions, onStatusChange, canEdit }) {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h4>{title}</h4>
        <span className="kanban-column-count">{items.length}</span>
      </div>
      <div className="kanban-column-body">
        {items.length === 0 ? (
          <div className="kanban-empty">No items</div>
        ) : (
          items.map((item) => (
            <KanbanCard
              key={item.id}
              item={item}
              type={type}
              statusOptions={statusOptions}
              onStatusChange={onStatusChange}
              canEdit={canEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;
