import { create } from "https://esm.sh/zustand@4.5.1";

interface UIState {
  isLargeFont: boolean;
  isDarkMode: boolean;
  toggleLargeFont: () => void;
  toggleDarkMode: () => void;
}

// Store quản lý các cấu hình giao diện PWA (đặc biệt cỡ chữ lớn ngoài hiện trường)
export const useUIStore = create<UIState>((set) => ({
  isLargeFont: localStorage.getItem("ui_large_font") === "true",
  isDarkMode: localStorage.getItem("ui_dark_mode") === "true",
  toggleLargeFont: () => set((state) => {
    const next = !state.isLargeFont;
    localStorage.setItem("ui_large_font", String(next));
    return { isLargeFont: next };
  }),
  toggleDarkMode: () => set((state) => {
    const next = !state.isDarkMode;
    localStorage.setItem("ui_dark_mode", String(next));
    return { isDarkMode: next };
  })
}));
export default useUIStore;
