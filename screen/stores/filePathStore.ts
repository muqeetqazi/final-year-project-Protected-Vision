import { create } from 'zustand'; // Change this line to import the default export

export interface IInputFile {
  mimeType: string;
  uri: string;
}

type State = {
  inputFile: IInputFile | null;
};

type Action = {
  setInputFile: (inputFile: State['inputFile']) => void;
};

// Create the store using the create function
export const useFilePathStore = create<State & Action>((set) => ({
  inputFile: null,
  setInputFile: (inputFile) => set(() => ({ inputFile: inputFile })),
}));
