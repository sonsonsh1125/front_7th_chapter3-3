import { useState } from "react"
import { deleteComment as deleteCommentApi } from "../../../entities/comment/api"
import { useCommentStore } from "../../../entities/comment/model"

/**
 * 댓글 삭제 기능 훅
 */
export const useCommentDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { removeComment } = useCommentStore()

  const deleteComment = async (id: number, postId: number) => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await deleteCommentApi(id)
      removeComment(postId, id)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteComment,
    isDeleting,
  }
}

