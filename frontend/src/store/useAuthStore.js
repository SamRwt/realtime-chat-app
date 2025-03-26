import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,

    onlineUsers: [],
    
    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
            get().connectSocket();
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
            get().connectSocket();
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
            get().connectSocket();
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
            get().disconnectSocket();
        }
        catch (error) {
            console.log("Error in logout:", error);
            toast.error(error.response.data);
        }
    },

    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put("/auth/update-profile", formData);
            set({ authUser: response.data });
            toast.success("Profile updated successfully");
        }
        catch (error) {
            console.log("Error in updateProfile:", error);
            toast.error(error.response.data);
        }
        finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        set( { socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    }
}));