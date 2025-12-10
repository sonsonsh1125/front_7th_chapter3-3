import { CommentItem } from "./CommentItem"
import type { Comment } from "../model"

interface CommentListProps {
  comments: Comment[]
  postId: number
  searchQuery?: string
  onLikeClick?: (commentId: number, postId: number) => void
  onEditClick?: (comment: Comment) => void
  onDeleteClick?: (commentId: number, postId: number) => void
}

/**
 * 댓글 목록 컴포넌트
 */
export const CommentList = ({
  comments,
  postId,
  searchQuery = "",
  onLikeClick,
  onEditClick,
  onDeleteClick,
}: CommentListProps) => {
  return (
    <div className="space-y-1">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          searchQuery={searchQuery}
          onLikeClick={onLikeClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  )
}

