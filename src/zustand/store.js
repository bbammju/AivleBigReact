import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      // gongo 관련 상태
      gongoSn: "",
      gongoName: "",
      setGongoInfo: (gongoSn, gongoName) => set({ gongoSn, gongoName }),

      // userSn 관련 상태
      userSn: null,
      userRole: null, // 권한 추가
      setUserAuth: (userSn, userRole) => set({ userSn, userRole }),

      // 프로필 이미지 관련 상태
      profileImage: null,
      setProfileImage: (image) => set({ profileImage: image }),

      inputPriority: null, // 선택한 순위 
      inputScore: null,    // 계산된 총점
      setInputResult: (priority, score) => 
        set({ inputPriority: priority, inputScore: score }),
    }),
    {
      name: "gongo-store", // localStorage에 저장될 key 이름
      partialize: (state) => ({
        gongoSn: state.gongoSn,
        gongoName: state.gongoName,
        userSn: state.userSn,
        userRole: state.userRole,
        profileImage: state.profileImage,
        inputPriority: state.inputPriority,
        inputScore: state.inputScore,
      }),
    }
  )
);
