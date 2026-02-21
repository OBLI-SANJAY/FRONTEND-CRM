import api from "./api";

const authService = {
    login: async (email, password) => {
        return api.post("/auth/login", { email, password });
    }
};

export default authService;
