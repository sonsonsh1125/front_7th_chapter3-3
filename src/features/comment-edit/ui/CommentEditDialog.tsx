import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../../../shared/ui"
import { useCommentEdit } from "../model/useCommentEdit"

interface CommentEditDialogProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * 댓글 수정 다이얼로그 컴포넌트
 */
export const CommentEditDialog = ({ isOpen, onOpenChange }: CommentEditDialogProps) => {
  const { isOpen: dialogOpen, isLoading, selectedComment, closeDialog, updateCommentData, editComment } = useCommentEdit(
    isOpen,
    onOpenChange
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => updateCommentData({ body: e.target.value })}
          />
          <Button onClick={editComment} disabled={isLoading || !selectedComment}>
            {isLoading ? "수정 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

