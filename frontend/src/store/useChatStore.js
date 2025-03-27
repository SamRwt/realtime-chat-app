import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get("/messages/users");
            set({ users: response.data });
        }
        catch (error) {
            console.log("Error in getUsers:", error);
            toast.error(error.response.data);
        }
        finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data });
        }
        catch (error) {
            console.log("Error in getMessages:", error);
            toast.error(error.response.data);
        }
        finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (newMessage) => {
        const { selectedUser, messages } = get();

        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, 
                newMessage,
            );
            set({ messages: [...messages, response.data] });
        }
        catch (error) {
            console.log("Error in sendMessage:", error);
            toast.error(error.response.data);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;

        socket.off("newMessage");
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },


}));