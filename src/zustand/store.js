import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      // gongo 관련 상태
      gongoSn: '',
      gongoname: '',
      setGongoInfo: (gongoSn, gongoName) => set({ gongoSn, gongoName }),

      // userSn 관련 상태 (persist 적용 안 함)
      userSn: null,
      setUserSn: (userSn) => set({ userSn }),
    }),
    {
      name: "gongo-store", // localstorage에 저장될 key 이름
      partialize: (state) => ({
        gongoSn: state.gongoSn,
        gongoName: state.gongoName
       }),
    }
  )
);