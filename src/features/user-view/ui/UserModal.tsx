import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { UserInfo } from "../../../entities/user/ui"
import { useUserView } from "../model/useUserView"

interface UserModalProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * 사용자 정보 모달 컴포넌트
 */
export const UserModal = ({ isOpen, onOpenChange }: UserModalProps) => {
  const { isOpen: modalOpen, isLoading, selectedUser, closeModal } = useUserView(isOpen, onOpenChange)

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : selectedUser ? (
          <UserInfo user={selectedUser} />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

