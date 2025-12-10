import { Plus } from "lucide-react"
import { Button } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/utils"
import { useCommentList } from "../../../entities/comment/model"
import { useCommentCreate } from "../../../features/comment-create"
import { useCommentEdit } from "../../../features/comment-edit"
import { useCommentDelete } from "../../../features/comment-delete"
import { useCommentLike } from "../../../features/comment-like"
import { Edit2, ThumbsUp, Trash2 } from "lucide-react"

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
      <div className="space-y-1">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => commentLike.likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => commentEdit.openDialog(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => commentDelete.deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
