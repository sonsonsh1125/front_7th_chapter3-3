import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../../../shared/ui"
import { usePostCreate } from "../model/usePostCreate"

interface PostCreateDialogProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * 게시물 생성 다이얼로그 컴포넌트
 */
export const PostCreateDialog = ({ isOpen, onOpenChange }: PostCreateDialogProps) => {
  const { isOpen: dialogOpen, isLoading, formData, closeDialog, updateFormData, createPost } = usePostCreate(
    isOpen,
    onOpenChange
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={formData.body}
            onChange={(e) => updateFormData({ body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={formData.userId}
            onChange={(e) => updateFormData({ userId: Number(e.target.value) })}
          />
          <Button onClick={createPost} disabled={isLoading}>
            {isLoading ? "추가 중..." : "게시물 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

