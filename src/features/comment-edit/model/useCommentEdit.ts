import { useState } from "react"
import { useUpdateCommentMutation } from "../../../entities/comment/model/queries"
import type { Comment } from "../../../entities/comment/model"

/**
 * 댓글 수정 기능 훅
 */
export const useCommentEdit = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const updateCommentMutation = useUpdateCommentMutation()

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

    try {
      await updateCommentMutation.mutateAsync({
        id: selectedComment.id,
        comment: { body: selectedComment.body },
      })
      closeDialog()
    } catch {
      // onError에서 처리
    }
  }

  return {
    isOpen: isDialogOpen,
    isLoading: updateCommentMutation.isPending,
    selectedComment,
    openDialog,
    closeDialog,
    updateCommentData,
    editComment,
  }
}
