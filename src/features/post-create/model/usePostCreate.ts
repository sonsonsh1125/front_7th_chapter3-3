import { useState } from "react"
import { addPost as addPostApi } from "../../../entities/post/api"
import { usePostStore } from "../../../entities/post/model"
import type { CreatePostRequest } from "../../../entities/post/api"

/**
 * 게시물 생성 기능 훅
 */
export const usePostCreate = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: "",
    body: "",
    userId: 1,
  })
  const { addPost: addPostToStore } = usePostStore()

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

    setIsLoading(true)
    try {
      const newPost = await addPostApi(formData)
      addPostToStore(newPost)
      closeDialog()
    } catch (error) {
      console.error("게시물 생성 오류:", error)
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
    createPost,
  }
}

