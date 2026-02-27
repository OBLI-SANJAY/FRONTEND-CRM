import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import taskService from "../../services/taskService";
import { getRole, getEmail } from "../../utils/auth";
import { showWarning } from "../../utils/alert";
import "./KanbanTasks.css";

const STAGE_MAP = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed"
};

const STAGES = Object.keys(STAGE_MAP);
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

function KanbanTasks({ tasks: propTasks = [], onRefresh }) {
    const navigate = useNavigate();
    const [localTasks, setLocalTasks] = useState(propTasks);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState(null);

    const role = getRole();
    const currentUserEmail = getEmail();
    useEffect(() => {
        setLocalTasks((currentLocal) => {
            if (currentLocal.length === 0) return propTasks;

            const tasksMap = new Map(propTasks.map(t => [String(t.id), t]));
            const merged = [];

            currentLocal.forEach(localTask => {
                const updatedTask = tasksMap.get(String(localTask.id));
                if (updatedTask) {
                    merged.push(updatedTask);
                    tasksMap.delete(String(localTask.id));
                }
            });

            tasksMap.forEach(newTask => merged.push(newTask));
            return merged;
        });
    }, [propTasks]);

    const columns = useMemo(() => {
        const map = {};
        STAGES.forEach((s) => (map[s] = []));
        localTasks.forEach((task) => {
            const status = (task.status || task.stage || "TODO").toUpperCase();

            let mappedStage = status;
            if (status === "PENDING") mappedStage = "TODO";
            if (status === "IN PROGRESS") mappedStage = "IN_PROGRESS";
            if (status === "REVIEW") mappedStage = "TODO";

            if (map[mappedStage]) map[mappedStage].push(task);
            else if (map["TODO"]) map["TODO"].push(task);
        });
        return map;
    }, [localTasks]);
    const canMoveTask = (task) => {
        if (!task) return false;
        if (role === "ADMIN") return true;

        const assignee = (task.assignedTo || "").toLowerCase();
        return assignee === currentUserEmail.toLowerCase();
    };

    const getPriorityClass = (priority) => {
        if (!priority) return "bg-secondary";
        const p = priority.toUpperCase();
        if (p === "HIGH") return "bg-danger";
        if (p === "MEDIUM") return "bg-warning text-dark";
        if (p === "LOW") return "bg-success";
        return "bg-secondary";
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

        const taskId = draggableId;
        const targetStage = destination.droppableId;
        const taskToMove = localTasks.find((t) => String(t.id) === taskId);
        if (!canMoveTask(taskToMove)) {
            showWarning("Permission denied: You are not authorized to move this task.");
            return;
        }

        const previousTasksState = [...localTasks];
        setLocalTasks((prev) => {
            const newTasks = [...prev];
            const taskIndex = newTasks.findIndex((t) => String(t.id) === taskId);
            if (taskIndex === -1) return prev;

            const [movedTask] = newTasks.splice(taskIndex, 1);
            movedTask.status = targetStage;

            const destTasks = newTasks.filter((task) => {
                const status = (task.status || task.stage || "TODO").toUpperCase();
                let mappedStage = status;
                if (status === "PENDING") mappedStage = "TODO";
                if (status === "IN PROGRESS") mappedStage = "IN_PROGRESS";
                if (status === "REVIEW") mappedStage = "TODO";
                return mappedStage === targetStage;
            });

            if (destination.index < destTasks.length) {
                const targetTask = destTasks[destination.index];
                const insertIndex = newTasks.findIndex((t) => String(t.id) === String(targetTask.id));
                newTasks.splice(insertIndex, 0, movedTask);
            } else {
                newTasks.push(movedTask);
            }
            return newTasks;
        });
        setSyncError(null);
        try {
            setIsSyncing(true);
            await taskService.updateTaskStage(taskId, targetStage);
            if (onRefresh) {
                await onRefresh();
            }
            console.log(`[Kanban] Task ${taskId} successfully moved to ${targetStage}`);
        } catch (error) {
            console.error("[Kanban] Sync failed:", error);
            setLocalTasks(previousTasksState);
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
                                <h3>{STAGE_MAP[stageId] || stageId}</h3>
                                <span className="count">{columns[stageId]?.length || 0}</span>
                            </div>

                            <StrictModeDroppable droppableId={stageId}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`kanban-drop-zone ${snapshot.isDraggingOver ? "dragging-over" : ""
                                            }`}
                                    >
                                        {columns[stageId].map((task, index) => (
                                            <Draggable
                                                key={String(task.id)}
                                                draggableId={String(task.id)}
                                                index={index}
                                                isDragDisabled={!canMoveTask(task)}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`kanban-card ${snapshot.isDragging ? "dragging" : ""
                                                            } ${!canMoveTask(task) ? "disabled" : ""}`}
                                                    >
                                                        <div className="mb-2">
                                                            <h5 className="task-title" title={task.title}>
                                                                {task.title}
                                                            </h5>
                                                            <p className="task-subtitle mb-2">{task.description}</p>

                                                            <span className={`badge ${getPriorityClass(task.priority)}`}>
                                                                {task.priority || "MEDIUM"}
                                                            </span>
                                                        </div>

                                                        <div className="card-footer">
                                                            <div
                                                                className="assignee-avatar"
                                                                title={`Assigned: ${task.assignedTo}`}
                                                            >
                                                                {(task.assignedTo || "?")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                            <span className="due-date">
                                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        {columns[stageId].length === 0 && !snapshot.isDraggingOver && (
                                            <div className="empty-column-msg">No tasks</div>
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

export default KanbanTasks;
