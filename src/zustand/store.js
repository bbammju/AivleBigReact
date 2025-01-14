import { create } from "zustand";


export const useStore = create((set) => ({
  keyword: '',
  check: 'user',
  setKeyword: (a) => set((state) => ({ keyword: state.keyword = a })),
  setCheck: (a) => set((state) => ({ check: state.check = a })),
}));