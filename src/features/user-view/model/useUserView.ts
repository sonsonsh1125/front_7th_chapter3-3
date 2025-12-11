import { useState } from "react"
import { useUserQuery } from "../../../entities/user/model/queries"
import type { User } from "../../../entities/user/model"

/**
 * 사용자 정보 조회 기능 훅
 */
export const useUserView = (isOpen?: boolean, onOpenChange?: (open: boolean) => void) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const userQuery = useUserQuery(userId ?? undefined, { enabled: !!userId })

  const isModalOpen = isOpen !== undefined ? isOpen : internalIsOpen
  const setIsModalOpen = onOpenChange || setInternalIsOpen

  const openModal = async (user: { id: number }) => {
    setIsModalOpen(true)
    setUserId(user.id)
    // selectedUser는 쿼리 데이터로 갱신
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  return {
    isOpen: isModalOpen,
    isLoading: userQuery.isFetching || userQuery.isLoading,
    selectedUser: userQuery.data || selectedUser,
    openModal,
    closeModal,
  }
}

