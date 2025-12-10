import { useState } from "react"
import { likeComment as likeCommentApi } from "../../../entities/comment/api"
import { useCommentStore } from "../../../entities/comment/model"

/**
 * 댓글 좋아요 기능 훅
 */
export const useCommentLike = () => {
  const [isLiking, setIsLiking] = useState(false)
  const { comments, updateComment: updateCommentInStore } = useCommentStore()

  const likeComment = async (id: number, postId: number) => {
    if (isLiking) return

    const currentComment = comments[postId]?.find((c) => c.id === id)
    if (!currentComment) return

    setIsLiking(true)
    try {
      const updatedComment = await likeCommentApi(id, currentComment.likes + 1)
      updateCommentInStore(postId, id, { ...updatedComment, likes: currentComment.likes + 1 })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    } finally {
      setIsLiking(false)
    }
  }

  return {
    likeComment,
    isLiking,
  }
}

