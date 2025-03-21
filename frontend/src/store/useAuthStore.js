import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data.user });
        }
        catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },
    signUp: async (formData) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post("/auth/signup", formData);
            set({ authUser: response.data });
            toast.success("Signed up successfully");
        }
        catch (error) {
            console.log("Error in signUp:", error);
            toast.error(error.response.data);
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    login: async (formData) => {
        set( { isLoggingIn: true });
        try {
            const response = await axiosInstance.post("/auth/login", formData);
            set({ authUser: response.data });
            toast.success("Logged in successfully");
        }
        catch (error) {
            console.log("Error in login:", error);
            toast.error(error.response.data);
        }
        finally {
            set({ isLoggingIn: false });
        }
    },
    
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        }
        catch (error) {
            console.log("Error in logout:", error);
            toast.error(error.response.data);
        }
    },
}));