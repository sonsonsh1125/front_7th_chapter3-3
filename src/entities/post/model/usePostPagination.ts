import { usePostStore } from "./store"

/**
 * 게시물 페이지네이션 로직 훅 (entities 레이어)
 */
export const usePostPagination = () => {
  const { skip, limit, setSkip, setLimit } = usePostStore()

  const goToPreviousPage = () => {
    setSkip(Math.max(0, skip - limit))
  }

  const goToNextPage = () => {
    setSkip(skip + limit)
  }

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit)
  }

  return {
    skip,
    limit,
    canGoPrevious: skip > 0,
    goToPreviousPage,
    goToNextPage,
    changeLimit,
  }
}
