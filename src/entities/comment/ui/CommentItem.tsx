import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/utils"
import type { Comment } from "../model"

interface CommentItemProps {
  comment: Comment
  postId: number
  searchQuery?: string
  onLikeClick?: (commentId: number, postId: number) => void
  onEditClick?: (comment: Comment) => void
  onDeleteClick?: (commentId: number, postId: number) => void
}

/**
 * 댓글 아이템 컴포넌트
 */
export const CommentItem = ({
  comment,
  postId,
  searchQuery = "",
  onLikeClick,
  onEditClick,
  onDeleteClick,
}: CommentItemProps) => {
  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onLikeClick?.(comment.id, postId)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEditClick?.(comment)}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDeleteClick?.(comment.id, postId)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
