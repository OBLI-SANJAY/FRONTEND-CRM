import api from "./api";

const USER_ENDPOINT = "/api/users";

const userService = {
    /**
     * Fetch users filtered by role
     * @param {string} role - The role to filter by (MANAGER, EMPLOYEE)
     * @returns {Promise<Array>} List of users
     */
    getUsersByRole: async (role) => {
        try {
            // Updated to match backend requirement: fetch from MySQL based on role
            const data = await api.get(`${USER_ENDPOINT}?role=${role}`);
            return data || [];
        } catch (error) {
            console.error(`Error fetching users with role ${role}:`, error);
            throw error;
        }
    },

    /**
     * Fetch all users
     */
    getAllUsers: async () => {
        try {
            return await api.get(USER_ENDPOINT);
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    }
};

export default userService;
