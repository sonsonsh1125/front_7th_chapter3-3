import { useState } from "react"
import { useAddPostMutation } from "../../../entities/post/model/queries"
import type { CreatePostRequest } from "../../../entities/post/api"

/**
 * 게시물 생성 기능 훅
 */
export const usePostCreate = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: "",
    body: "",
    userId: 1,
  })
  const addPostMutation = useAddPostMutation()

  const isDialogOpen = isOpen !== undefined ? isOpen : internalIsOpen
  const setIsDialogOpen = onOpenChange || setInternalIsOpen

  const openDialog = () => setIsDialogOpen(true)
  const closeDialog = () => {
    setIsDialogOpen(false)
    setFormData({ title: "", body: "", userId: 1 })
  }

  const updateFormData = (updates: Partial<CreatePostRequest>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const createPost = async () => {
    if (!formData.title.trim() || !formData.body.trim()) {
      return
    }

    try {
      await addPostMutation.mutateAsync(formData)
      closeDialog()
    } catch {
      // onError에서 처리
    }
  }

  return {
    isOpen: isDialogOpen,
    isLoading: addPostMutation.isPending,
    formData,
    openDialog,
    closeDialog,
    updateFormData,
    createPost,
  }
}

