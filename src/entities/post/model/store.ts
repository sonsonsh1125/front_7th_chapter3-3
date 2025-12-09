import { create } from "zustand"
import type { Post } from "./types"

/**
 * 게시물 상태 관리 스토어
 */
interface PostStore {
  // 상태
  posts: Post[]
  total: number
  loading: boolean
  skip: number
  limit: number

  // 액션
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setLoading: (loading: boolean) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  addPost: (post: Post) => void
  updatePost: (id: number, post: Post) => void
  removePost: (id: number) => void
  reset: () => void
}

const initialState = {
  posts: [],
  total: 0,
  loading: false,
  skip: 0,
  limit: 10,
}

export const usePostStore = create<PostStore>((set) => ({
  ...initialState,

  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setLoading: (loading) => set({ loading }),
  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
      total: state.total + 1,
    })),

  updatePost: (id, post) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === id ? post : p)),
    })),

  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
      total: state.total - 1,
    })),

  reset: () => set(initialState),
}))
