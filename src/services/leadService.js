import api from "./api";

const LEAD_ENDPOINT = "/api/leads";

const leadService = {
    getAllLeads: async () => {
        try {
            const data = await api.get(LEAD_ENDPOINT);
            return data || [];
        } catch (error) {
            console.error("Error fetching leads:", error);
            throw error;
        }
    },

    getLeadById: async (id) => {
        try {
            return await api.get(`${LEAD_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error fetching lead ${id}:`, error);
            throw error;
        }
    },

    createLead: async (leadData) => {
        try {
            const data = await api.post(LEAD_ENDPOINT, leadData);
            return data;
        } catch (error) {
            console.error("Error creating lead:", error);
            throw error;
        }
    },

    updateLead: async (id, leadData) => {
        try {
            return await api.put(`${LEAD_ENDPOINT}/${id}`, leadData);
        } catch (error) {
            console.error(`Error updating lead ${id}:`, error);
            throw error;
        }
    },

    deleteLead: async (id) => {
        try {
            await api.delete(`${LEAD_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error deleting lead ${id}:`, error);
            throw error;
        }
    },

    updateLeadStage: async (id, stage) => {
        try {
            return await api.patch(`${LEAD_ENDPOINT}/${id}/stage`, { stage });
        } catch (error) {
            console.error(`Error updating stage for lead ${id}:`, error);
            throw error;
        }
    },

    searchLeads: async (keyword) => {
        try {
            const data = await api.get(`${LEAD_ENDPOINT}/search?keyword=${encodeURIComponent(keyword)}`);
            return data || [];
        } catch (error) {
            console.error("Error searching leads:", error);
            throw error;
        }
    }
};

export default leadService;
