import { useState } from "react"
import { updatePost as updatePostApi } from "../../../entities/post/api"
import { usePostStore } from "../../../entities/post/model"
import type { Post } from "../../../entities/post/model"
import type { UpdatePostRequest } from "../../../entities/post/api"

/**
 * 게시물 수정 기능 훅
 */
export const usePostEdit = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const { updatePost: updatePostInStore } = usePostStore()

  const isDialogOpen = isOpen !== undefined ? isOpen : internalIsOpen
  const setIsDialogOpen = onOpenChange || setInternalIsOpen

  const openDialog = (post: Post) => {
    setSelectedPost(post)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedPost(null)
  }

  const updatePostData = (updates: Partial<Post>) => {
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, ...updates })
    }
  }

  const editPost = async () => {
    if (!selectedPost) return

    setIsLoading(true)
    try {
      const updateData: UpdatePostRequest = {
        title: selectedPost.title,
        body: selectedPost.body,
      }
      const updatedPost = await updatePostApi(selectedPost.id, updateData)
      updatePostInStore(selectedPost.id, updatedPost)
      closeDialog()
    } catch (error) {
      console.error("게시물 수정 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen: isDialogOpen,
    isLoading,
    selectedPost,
    openDialog,
    closeDialog,
    updatePostData,
    editPost,
  }
}

