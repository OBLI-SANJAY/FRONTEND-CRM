import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function KanbanCard({ item, type, statusOptions, onStatusChange, canEdit }) {
  const isLead = type === "lead";
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });

      const closeMenu = () => setIsOpen(false);
      window.addEventListener("click", closeMenu);
      window.addEventListener("scroll", closeMenu, true);
      window.addEventListener("resize", closeMenu);

      return () => {
        window.removeEventListener("click", closeMenu);
        window.removeEventListener("scroll", closeMenu, true);
        window.removeEventListener("resize", closeMenu);
      };
    }
  }, [isOpen]);

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const getOwnerInitial = () => {
    const owner = isLead ? item.owner : item.assignedTo;
    return owner ? owner.charAt(0).toUpperCase() : "?";
  };

  const getOwnerName = () => {
    const owner = isLead ? item.owner : item.assignedTo;
    return owner ? owner.split("@")[0] : "Unassigned";
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
        <div className="kanban-card-avatar">{getOwnerInitial()}</div>
        <span>{getOwnerName()}</span>
      </div>

      <div className="kanban-card-actions">
        <button
          className="btn btn-sm btn-outline-primary w-100"
          onClick={() => (window.location.href = `/${type}s/${item.id}`)}
        >
          View Details
        </button>
      </div>

      {canEdit && (
        <div className="kanban-status-dropdown custom">
          <button
            ref={buttonRef}
            className="status-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <span>{item.status}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          {isOpen && createPortal(
            <div
              className="status-menu show"
              style={{
                position: "absolute",
                top: `${coords.top + 4}px`,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                zIndex: 9999, 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {statusOptions.map((status) => (
                <div
                  key={status}
                  className={`status-item ${status === item.status ? 'active' : ''}`}
                  onClick={() => {
                    onStatusChange(item.id, status);
                    setIsOpen(false);
                  }}
                >
                  {status}
                </div>
              ))}
            </div>,
            document.body
          )}
        </div>
      )}
    </div>
  );
}

export default KanbanCard;
