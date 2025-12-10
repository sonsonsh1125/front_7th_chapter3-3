import type { User } from "../model"

interface UserAvatarProps {
  user?: User
  onClick?: (user: { id: number }) => void
}

/**
 * 사용자 아바타 컴포넌트
 */
export const UserAvatar = ({ user, onClick }: UserAvatarProps) => {
  if (!user) return null

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => onClick?.(user)}
    >
      <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
      <span>{user.username}</span>
    </div>
  )
}

