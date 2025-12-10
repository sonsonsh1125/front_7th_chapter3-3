import { useState } from "react"
import { deletePost as deletePostApi } from "../../../entities/post/api"
import { usePostStore } from "../../../entities/post/model"

/**
 * 게시물 삭제 기능 훅
 */
export const usePostDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { removePost } = usePostStore()

  const deletePost = async (id: number) => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await deletePostApi(id)
      removePost(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deletePost,
    isDeleting,
  }
}

