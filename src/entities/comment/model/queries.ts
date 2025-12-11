import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addComment, updateComment, deleteComment, likeComment } from "../api"
import type { CreateCommentRequest, UpdateCommentRequest } from "../api"
import { notifyError } from "../../../shared/lib/utils"

export const commentQueryKeys = {
  list: (postId: number) => ["comments", postId] as const,
}

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCommentRequest) => addComment(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(data.postId) })
    },
    onError: (error) => notifyError("댓글 추가에 실패했습니다.", error),
  })
}

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: UpdateCommentRequest }) => updateComment(id, comment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(data.postId) })
    },
    onError: (error) => notifyError("댓글 수정에 실패했습니다.", error),
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => deleteComment(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(variables.postId) })
    },
    onError: (error) => notifyError("댓글 삭제에 실패했습니다.", error),
  })
}

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, likes, postId }: { id: number; likes: number; postId: number }) => {
      // postId는 onSuccess에서 무효화에 사용 (mutationFn에서 직접 사용하지 않더라도 변수 유지)
      void postId
      return likeComment(id, likes)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.list(variables.postId) })
    },
    onError: (error) => notifyError("댓글 좋아요에 실패했습니다.", error),
  })
}

