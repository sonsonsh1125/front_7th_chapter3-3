import { create } from "zustand"
import type { Comment } from "./types"

/**
 * 댓글 상태 관리 스토어
 * postId를 키로 사용하여 댓글을 관리
 */
interface CommentStore {
  // 상태: { [postId: number]: Comment[] }
  comments: Record<number, Comment[]>

  // 액션
  setComments: (postId: number, comments: Comment[]) => void
  addComment: (postId: number, comment: Comment) => void
  updateComment: (postId: number, commentId: number, comment: Comment) => void
  removeComment: (postId: number, commentId: number) => void
  clearComments: (postId?: number) => void
  reset: () => void
}

const initialState = {
  comments: {} as Record<number, Comment[]>,
}

export const useCommentStore = create<CommentStore>((set) => ({
  ...initialState,

  setComments: (postId, comments) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: comments,
      },
    })),

  addComment: (postId, comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] || []), comment],
      },
    })),

  updateComment: (postId, commentId, comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).map((c) => (c.id === commentId ? comment : c)),
      },
    })),

  removeComment: (postId, commentId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).filter((c) => c.id !== commentId),
      },
    })),

  clearComments: (postId) =>
    set((state) => {
      if (postId) {
        const { [postId]: _, ...rest } = state.comments
        return { comments: rest }
      }
      return initialState
    }),

  reset: () => set(initialState),
}))
