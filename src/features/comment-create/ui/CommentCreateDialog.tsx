import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../shared/ui"
import { useCommentCreate } from "../model/useCommentCreate"

interface CommentCreateDialogProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * 댓글 생성 다이얼로그 컴포넌트
 */
export const CommentCreateDialog = ({ isOpen, onOpenChange }: CommentCreateDialogProps) => {
  const { isOpen: dialogOpen, isLoading, formData, closeDialog, updateFormData, createComment } = useCommentCreate(
    isOpen,
    onOpenChange
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={formData.body}
            onChange={(e) => updateFormData({ body: e.target.value })}
          />
          <Button onClick={createComment} disabled={isLoading || !formData.postId}>
            {isLoading ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

