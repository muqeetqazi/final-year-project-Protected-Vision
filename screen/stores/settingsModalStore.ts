import { create } from "zustand";

type State = {
	isVisible: boolean;
	theme: string;
};

type Action = {
	setIsVisible: (isVisible: State["isVisible"]) => void;
	setTheme: (theme: State["theme"]) => void;
};

export const useSettingsModalStore = create<State & Action>((set) => ({
	isVisible: false,
	theme: "system",
	setIsVisible: (isVisible) => set(() => ({ isVisible: isVisible })),
	setTheme: (theme) => set(() => ({ theme: theme })),
}));
