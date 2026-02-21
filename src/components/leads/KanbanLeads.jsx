import React, { useState, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import leadService from "../../services/leadService";
import { getRole, getEmail } from "../../utils/auth";
import { showWarning } from "../../utils/alert";
import "./KanbanLeads.css";

const STAGES = ["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "LOST"];
const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) return null;
    return <Droppable {...props}>{children}</Droppable>;
};
function KanbanLeads({ leads: propLeads = [], onRefresh }) {

    const [localLeads, setLocalLeads] = useState(propLeads);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState(null);

    const role = getRole();
    const currentUserEmail = getEmail();
    useEffect(() => {
        setLocalLeads(propLeads);
    }, [propLeads]);
    const columns = useMemo(() => {
        const map = {};
        STAGES.forEach((s) => (map[s] = []));
        localLeads.forEach((lead) => {
            const stage = (lead.stage || lead.status || "NEW").toUpperCase();
            if (map[stage]) map[stage].push(lead);
        });
        return map;
    }, [localLeads]);
    const canMoveLead = (lead) => {
        if (!lead) return false;
        if (role === "ADMIN") return true;
        const assignee = (lead.assignedTo || lead.owner || "").toLowerCase();
        return assignee === currentUserEmail.toLowerCase();
    };

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const leadId = draggableId;
        const targetStage = destination.droppableId;
        const leadToMove = localLeads.find((l) => String(l.id) === leadId);
        if (!canMoveLead(leadToMove)) {
            showWarning("Permission denied: You are not authorized to move this lead.");
            return;
        }
        const previousLeadsState = [...localLeads];
        setLocalLeads((prev) =>
            prev.map((lead) =>
                String(lead.id) === leadId ? { ...lead, stage: targetStage } : lead
            )
        );
        setSyncError(null);
        try {
            setIsSyncing(true);
            await leadService.updateLeadStage(leadId, targetStage);
            if (onRefresh) {
                await onRefresh();
            }
            console.log(`[Kanban] Lead ${leadId} successfully moved to ${targetStage}`);
        } catch (error) {
            console.error("[Kanban] Sync failed:", error);
            setLocalLeads(previousLeadsState);
            setSyncError("Failed to update status. Server connection lost.");
            setTimeout(() => setSyncError(null), 5000);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="kanban-wrapper">

            {isSyncing && (
                <div className="kanban-sync-indicator bg-primary">
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Syncing changes...
                </div>
            )}
            {syncError && (
                <div className="kanban-sync-indicator bg-danger">
                    {syncError}
                </div>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="kanban-board">
                    {STAGES.map((stageId) => (
                        <div key={stageId} className="kanban-column">
                            <div className="kanban-column-header">
                                <h3>{stageId.replace("_", " ")}</h3>
                                <span className="lead-count">{columns[stageId]?.length || 0}</span>
                            </div>

                            <StrictModeDroppable droppableId={stageId}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`kanban-drop-zone ${snapshot.isDraggingOver ? "is-dragging-over" : ""
                                            }`}
                                    >
                                        {columns[stageId].map((lead, index) => (
                                            <Draggable
                                                key={String(lead.id)}
                                                draggableId={String(lead.id)}
                                                index={index}
                                                isDragDisabled={!canMoveLead(lead)}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`kanban-card ${snapshot.isDragging ? "is-dragging" : ""
                                                            } ${!canMoveLead(lead) ? "move-locked" : ""}`}
                                                    >
                                                        <div className="card-top">
                                                            <h5 className="lead-name" title={lead.name}>
                                                                {lead.name}
                                                            </h5>
                                                            <span className="lead-company">{lead.company || "No Company"}</span>
                                                        </div>
                                                        <div className="card-footer">
                                                            <div
                                                                className="assignee-avatar"
                                                                title={`Assigned: ${lead.assignedTo || lead.owner}`}
                                                            >
                                                                {(lead.assignedTo || lead.owner || "?")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                            <span className="contact-status">{lead.contacted || "Recently"}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        {columns[stageId].length === 0 && !snapshot.isDraggingOver && (
                                            <div className="empty-state">No leads available</div>
                                        )}
                                    </div>
                                )}
                            </StrictModeDroppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}

export default KanbanLeads;
