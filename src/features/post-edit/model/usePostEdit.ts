import { useState } from "react"
import { useUpdatePostMutation } from "../../../entities/post/model/queries"
import type { Post } from "../../../entities/post/model"

/**
 * 게시물 수정 기능 훅
 */
export const usePostEdit = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const updatePostMutation = useUpdatePostMutation()

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

    try {
      await updatePostMutation.mutateAsync({
        id: selectedPost.id,
        data: {
          title: selectedPost.title,
          body: selectedPost.body,
        },
      })
      closeDialog()
    } catch {
      // onError에서 처리
    }
  }

  return {
    isOpen: isDialogOpen,
    isLoading: updatePostMutation.isPending,
    selectedPost,
    openDialog,
    closeDialog,
    updatePostData,
    editPost,
  }
}

