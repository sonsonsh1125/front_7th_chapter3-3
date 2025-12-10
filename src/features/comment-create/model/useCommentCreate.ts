import { useState } from "react"
import { addComment as addCommentApi } from "../../../entities/comment/api"
import { useCommentStore } from "../../../entities/comment/model"
import type { CreateCommentRequest } from "../../../entities/comment/api"

/**
 * 댓글 생성 기능 훅
 */
export const useCommentCreate = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateCommentRequest>({
    body: "",
    postId: 0,
    userId: 1,
  })
  const { addComment: addCommentToStore } = useCommentStore()

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

    setIsLoading(true)
    try {
      const newComment = await addCommentApi(formData)
      addCommentToStore(formData.postId, newComment)
      closeDialog()
    } catch (error) {
      console.error("댓글 생성 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen: isDialogOpen,
    isLoading,
    formData,
    openDialog,
    closeDialog,
    updateFormData,
    createComment,
  }
}

