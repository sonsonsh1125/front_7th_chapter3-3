import { useState } from "react"
import { updateComment as updateCommentApi } from "../../../entities/comment/api"
import { useCommentStore } from "../../../entities/comment/model"
import type { Comment } from "../../../entities/comment/model"

/**
 * 댓글 수정 기능 훅
 */
export const useCommentEdit = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const { updateComment: updateCommentInStore } = useCommentStore()

  const isDialogOpen = isOpen !== undefined ? isOpen : internalIsOpen
  const setIsDialogOpen = onOpenChange || setInternalIsOpen

  const openDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedComment(null)
  }

  const updateCommentData = (updates: Partial<Comment>) => {
    if (selectedComment) {
      setSelectedComment({ ...selectedComment, ...updates })
    }
  }

  const editComment = async () => {
    if (!selectedComment) return

    setIsLoading(true)
    try {
      const updatedComment = await updateCommentApi(selectedComment.id, {
        body: selectedComment.body,
      })
      updateCommentInStore(updatedComment.postId, updatedComment.id, updatedComment)
      closeDialog()
    } catch (error) {
      console.error("댓글 수정 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen: isDialogOpen,
    isLoading,
    selectedComment,
    openDialog,
    closeDialog,
    updateCommentData,
    editComment,
  }
}

