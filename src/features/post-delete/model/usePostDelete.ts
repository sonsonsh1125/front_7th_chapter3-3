import { useState } from "react"
import { useDeletePostMutation } from "../../../entities/post/model/queries"

/**
 * 게시물 삭제 기능 훅
 */
export const usePostDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false)
  const deletePostMutation = useDeletePostMutation()

  const deletePost = async (id: number) => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await deletePostMutation.mutateAsync(id)
    } catch (error) {
      // onError에서 처리
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deletePost,
    isDeleting,
  }
}

