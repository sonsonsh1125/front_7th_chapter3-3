/**
 * 댓글 작성자 정보 (최소한의 구조)
 * 나중에 entities/user/model에서 정의할 User 타입으로 대체 가능
 */
export interface CommentUser {
  username: string
}

/**
 * 댓글 타입
 */
export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: CommentUser
}
