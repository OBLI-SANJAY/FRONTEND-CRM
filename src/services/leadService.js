import api from "./api";

const LEAD_ENDPOINT = "/api/leads";

const leadService = {
    /**
     * Fetch all leads from the backend
     * @returns {Promise<Array>} List of leads
     */
    getAllLeads: async () => {
        try {
            const data = await api.get(LEAD_ENDPOINT);
            return data || [];
        } catch (error) {
            console.error("Error fetching leads:", error);
            throw error;
        }
    },

    /**
     * Get a single lead by ID
     */
    getLeadById: async (id) => {
        try {
            return await api.get(`${LEAD_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error fetching lead ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new lead
     * @param {Object} leadData 
     * @returns {Promise<Object>} The created lead object (important for Optimistic UI)
     */
    createLead: async (leadData) => {
        try {
            // Backend should return the created entity with its dynamic ID
            const data = await api.post(LEAD_ENDPOINT, leadData);
            return data;
        } catch (error) {
            console.error("Error creating lead:", error);
            throw error;
        }
    },

    /**
     * Update an existing lead
     */
    updateLead: async (id, leadData) => {
        try {
            return await api.put(`${LEAD_ENDPOINT}/${id}`, leadData);
        } catch (error) {
            console.error(`Error updating lead ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete a lead
     */
    deleteLead: async (id) => {
        try {
            await api.delete(`${LEAD_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error deleting lead ${id}:`, error);
            throw error;
        }
    },

    /**
     * Update lead stage
     * @param {string} id 
     * @param {string} stage 
     */
    updateLeadStage: async (id, stage) => {
        try {
            return await api.patch(`${LEAD_ENDPOINT}/${id}/stage`, { stage });
        } catch (error) {
            console.error(`Error updating stage for lead ${id}:`, error);
            throw error;
        }
    },

    /**
     * Search leads by keyword
     */
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
