import { useState } from "react"
import { useAddCommentMutation } from "../../../entities/comment/model/queries"
import type { CreateCommentRequest } from "../../../entities/comment/api"

/**
 * 댓글 생성 기능 훅
 */
export const useCommentCreate = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [formData, setFormData] = useState<CreateCommentRequest>({
    body: "",
    postId: 0,
    userId: 1,
  })
  const addCommentMutation = useAddCommentMutation()

  const isDialogOpen = isOpen !== undefined ? isOpen : internalIsOpen
  const setIsDialogOpen = onOpenChange || setInternalIsOpen

  const openDialog = (postId: number) => {
    setFormData({ body: "", postId, userId: 1 })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setFormData({ body: "", postId: 0, userId: 1 })
  }

  const updateFormData = (updates: Partial<CreateCommentRequest>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const createComment = async () => {
    if (!formData.body.trim() || !formData.postId) {
      return
    }

    try {
      await addCommentMutation.mutateAsync(formData)
      closeDialog()
    } catch {
      // onError에서 처리
    }
  }

  return {
    isOpen: isDialogOpen,
    isLoading: addCommentMutation.isPending,
    formData,
    openDialog,
    closeDialog,
    updateFormData,
    createComment,
  }
}
