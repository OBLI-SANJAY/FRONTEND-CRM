import api from "./api";

const USER_ENDPOINT = "/api/users";

const userService = {
    getUsersByRole: async (role) => {
        try {
            const data = await api.get(`${USER_ENDPOINT}?role=${role}`);
            return data || [];
        } catch (error) {
            console.error(`Error fetching users with role ${role}:`, error);
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            return await api.get(USER_ENDPOINT);
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            return await api.get(`${USER_ENDPOINT}/me`);
        } catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
    },

    updateProfile: async (profileData) => {
        try {
            return await api.put(`${USER_ENDPOINT}/profile`, profileData);
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }
};

export default userService;
