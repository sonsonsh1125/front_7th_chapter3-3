import { create } from "zustand"

/**
 * 게시물 상태 관리 스토어
 */
interface PostStore {
  skip: number
  limit: number

  // 액션
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  reset: () => void
}

const initialState = {
  skip: 0,
  limit: 10,
}

export const usePostStore = create<PostStore>((set) => ({
  ...initialState,

  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),

  reset: () => set(initialState),
}))
