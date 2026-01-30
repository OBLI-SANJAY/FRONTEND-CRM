import React from "react";

function KanbanCard({ item, type, statusOptions, onStatusChange, canEdit }) {
  const isLead = type === "lead";

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="kanban-card">
      <div className="kanban-card-title">
        {isLead ? item.name : item.title}
      </div>
      <div className="kanban-card-subtitle">
        {isLead ? item.company : item.subtitle}
      </div>
      <div className="kanban-card-meta">
        <span className={`kanban-card-badge ${getStatusClass(item.status)}`}>
          {item.status}
        </span>
        {!isLead && item.priority && (
          <span className={`kanban-card-badge ${item.priority.toLowerCase()}`}>
            {item.priority}
          </span>
        )}
      </div>
      <div className="kanban-card-owner">
        {isLead ? item.owner?.split("@")[0] : item.assignedTo?.split("@")[0]}
      </div>

      {canEdit && (
        <div className="kanban-status-dropdown">
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default KanbanCard;
