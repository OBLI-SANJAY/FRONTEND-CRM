import api from "./api";

const CUSTOMER_ENDPOINT = "/api/customers";

const customerService = {
    getAllCustomers: async () => {
        try {
            return await api.get(CUSTOMER_ENDPOINT);
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    },

    getCustomerById: async (id) => {
        try {
            return await api.get(`${CUSTOMER_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error fetching customer ${id}:`, error);
            throw error;
        }
    },

    createCustomer: async (customerData) => {
        try {
            return await api.post(CUSTOMER_ENDPOINT, customerData);
        } catch (error) {
            console.error("Error creating customer:", error);
            throw error;
        }
    },

    assignCustomer: async (id, assignedTo, assignedRole) => {
        try {
            return await api.patch(`${CUSTOMER_ENDPOINT}/${id}/assign`, {
                assignedTo,
                assignedRole
            });
        } catch (error) {
            console.error(`Error assigning customer ${id}:`, error);
            throw error;
        }
    },

    deleteCustomer: async (id) => {
        try {
            return await api.delete(`${CUSTOMER_ENDPOINT}/${id}`);
        } catch (error) {
            console.error(`Error deleting customer ${id}:`, error);
            throw error;
        }
    }
};

export default customerService;
