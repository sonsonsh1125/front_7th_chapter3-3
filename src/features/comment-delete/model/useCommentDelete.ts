import { useState } from "react"
import { useDeleteCommentMutation } from "../../../entities/comment/model/queries"

/**
 * 댓글 삭제 기능 훅
 */
export const useCommentDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteCommentMutation = useDeleteCommentMutation()

  const deleteComment = async (id: number, postId: number) => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await deleteCommentMutation.mutateAsync({ id, postId })
    } catch (error) {
      // onError에서 처리
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteComment,
    isDeleting,
  }
}
