import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("app-theme") || "light",
    setTheme: (theme) => {
        set({ theme });
        localStorage.setItem("app-theme", theme);
    },
}));