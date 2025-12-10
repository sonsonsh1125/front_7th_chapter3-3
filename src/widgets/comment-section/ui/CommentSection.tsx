import { Plus } from "lucide-react"
import { Button } from "../../../shared/ui"
import { useCommentList } from "../../../entities/comment/model"
import { CommentList } from "../../../entities/comment/ui"
import { useCommentCreate } from "../../../features/comment-create"
import { useCommentEdit } from "../../../features/comment-edit"
import { useCommentDelete } from "../../../features/comment-delete"
import { useCommentLike } from "../../../features/comment-like"

interface CommentSectionProps {
  postId: number
  searchQuery?: string
  showAddDialog?: boolean
  onAddDialogChange?: (open: boolean) => void
  showEditDialog?: boolean
  onEditDialogChange?: (open: boolean) => void
}

/**
 * 댓글 섹션 위젯 (목록 + 추가)
 */
export const CommentSection = ({
  postId,
  searchQuery = "",
  showAddDialog,
  onAddDialogChange,
  showEditDialog,
  onEditDialogChange,
}: CommentSectionProps) => {
  const { comments } = useCommentList(postId)
  const commentCreate = useCommentCreate(showAddDialog, onAddDialogChange)
  const commentEdit = useCommentEdit(showEditDialog, onEditDialogChange)
  const commentDelete = useCommentDelete()
  const commentLike = useCommentLike()

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => commentCreate.openDialog(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <CommentList
        comments={comments}
        postId={postId}
        searchQuery={searchQuery}
        onLikeClick={commentLike.likeComment}
        onEditClick={commentEdit.openDialog}
        onDeleteClick={commentDelete.deleteComment}
      />
    </div>
  )
}
