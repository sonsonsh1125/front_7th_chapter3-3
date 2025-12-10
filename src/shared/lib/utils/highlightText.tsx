import * as React from "react"

/**
 * 텍스트에서 하이라이트할 부분을 마킹하는 유틸리티 함수 (순수 함수)
 * @param text - 하이라이트할 텍스트
 * @param highlight - 하이라이트할 검색어
 * @returns JSX 요소 (검색어가 강조된 텍스트)
 */
export const highlightText = (text: string, highlight: string): React.ReactNode => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }

  // 정규식 이스케이프 처리
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(${escapedHighlight})`, "gi")
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, i) => {
        // split으로 나눈 부분 중에서 정규식과 일치하는 부분만 하이라이트
        // split은 캡처 그룹을 포함하므로, 홀수 인덱스가 매칭된 부분
        const isMatch = i % 2 === 1
        return isMatch ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      })}
    </span>
  )
}

