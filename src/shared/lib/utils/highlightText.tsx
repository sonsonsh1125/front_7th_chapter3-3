import * as React from "react"

/**
 * 텍스트에서 하이라이트할 부분을 마킹하는 유틸리티 함수
 * @param text - 하이라이트할 텍스트
 * @param highlight - 하이라이트할 검색어
 * @returns JSX 요소 (검색어가 강조된 텍스트)
 */
export const highlightText = (text: string, highlight: string): React.ReactNode => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </span>
  )
}

