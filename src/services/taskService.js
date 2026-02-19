import api from "./api";

const TASK_ENDPOINT = "/api/tasks";

const taskService = {

    getAllTasks: async () => {
        try {
            return await api.get(TASK_ENDPOINT);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            throw error;
        }
    },

    getTaskById: async (id) => {
        try {
            return await api.get(`${TASK_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error fetching task ${id}:`, error);
            throw error;
        }
    },

    createTask: async (taskData) => {
        try {
            return await api.post(TASK_ENDPOINT, taskData);
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    },

    updateTaskStage: async (id, stage) => {
        try {
            return await api.patch(`${TASK_ENDPOINT}/${id}/stage`, { stage });
        } catch (error) {
            console.error(`Error updating task stage ${id}:`, error);
            throw error;
        }
    },



    assignTask: async (id, userEmail) => {
        try {
            return await api.patch(`${TASK_ENDPOINT}/${id}/assign`, {
                assignedTo: userEmail
            });
        } catch (error) {
            console.error(`Error assigning task ${id}:`, error);
            throw error;
        }
    },

    deleteTask: async (id) => {
        try {
            return await api.delete(`${TASK_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error deleting task ${id}:`, error);
            throw error;
        }
    }

};

export default taskService;
