import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      // gongo 관련 상태
      gongoSn: '',
      gongoName: '',
      setGongoInfo: (gongoSn, gongoName) => set({ gongoSn, gongoName }),

      // userSn 관련 상태 (persist 적용 안 함)
      userSn: null,
      userRole: null, // 권한 추가
      setUserAuth: (userSn, userRole) => set({ userSn, userRole }),
    }),
    {
      name: "gongo-store", // localstorage에 저장될 key 이름
      partialize: (state) => ({
        gongoSn: state.gongoSn,
        gongoName: state.gongoName,
        userSn: state.userSn,
        userRole: state.userRole        
       }),
    }
  )
);