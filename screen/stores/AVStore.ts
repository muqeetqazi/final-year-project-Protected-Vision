import { create } from "zustand";

type State = {
	AVDuration: number;
};

type Action = {
	setAVDuration: (AVDuration: State["AVDuration"]) => void;
};

export const useAVStore = create<State & Action>((set) => ({
	AVDuration: 0,
	setAVDuration: (AVDuration) => set(() => ({ AVDuration: AVDuration })),
}));
