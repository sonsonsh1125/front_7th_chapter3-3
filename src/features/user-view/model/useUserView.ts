import { useState } from "react"
import { fetchUserById } from "../../../entities/user/api"
import type { User } from "../../../entities/user/model"

/**
 * 사용자 정보 조회 기능 훅
 */
export const useUserView = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const isModalOpen = isOpen !== undefined ? isOpen : internalIsOpen
  const setIsModalOpen = onOpenChange || setInternalIsOpen

  const openModal = async (user: { id: number }) => {
    setIsLoading(true)
    setIsModalOpen(true)
    try {
      const userData = await fetchUserById(user.id)
      setSelectedUser(userData)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  return {
    isOpen: isModalOpen,
    isLoading,
    selectedUser,
    openModal,
    closeModal,
  }
}

