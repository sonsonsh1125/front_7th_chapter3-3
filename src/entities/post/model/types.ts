/**
 * 게시물 반응 타입
 */
export interface PostReactions {
  likes: number
  dislikes: number
}

/**
 * 게시물 작성자 정보 (최소한의 구조)
 * 나중에 entities/user/model에서 정의할 User 타입으로 대체 가능
 */
export interface PostAuthor {
  id: number
  username: string
  image: string
}

/**
 * 게시물 타입
 */
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: PostReactions
  author?: PostAuthor
}
