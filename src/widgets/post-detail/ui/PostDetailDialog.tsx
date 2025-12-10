import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/utils"
import { CommentSection } from "../../comment-section"
import type { Post } from "../../../entities/post/model"

interface PostDetailDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
  searchQuery?: string
}

/**
 * 게시물 상세 다이얼로그 위젯
 * UI 조합만 담당하며, 모든 상태는 props로 받음
 */
export const PostDetailDialog = ({ isOpen, onOpenChange, post, searchQuery = "" }: PostDetailDialogProps) => {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body, searchQuery)}</p>
          <CommentSection postId={post.id} searchQuery={searchQuery} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
