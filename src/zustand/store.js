import { create } from "zustand";

export const useStore = create((set) => ({
  gongoName: '',
  setGongoname: (a) => set((state) => ({ gongoName: state.gongoName = a })),
}));