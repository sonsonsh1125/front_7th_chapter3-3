import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../../../shared/ui"
import { usePostEdit } from "../model/usePostEdit"

interface PostEditDialogProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * 게시물 수정 다이얼로그 컴포넌트
 */
export const PostEditDialog = ({ isOpen, onOpenChange }: PostEditDialogProps) => {
  const { isOpen: dialogOpen, isLoading, selectedPost, closeDialog, updatePostData, editPost } = usePostEdit(
    isOpen,
    onOpenChange
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => updatePostData({ title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => updatePostData({ body: e.target.value })}
          />
          <Button onClick={editPost} disabled={isLoading || !selectedPost}>
            {isLoading ? "수정 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

