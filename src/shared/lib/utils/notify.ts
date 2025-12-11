/**
 * 단순 에러 알림 유틸리티
 * - 콘솔에 로그하고, 브라우저 환경이면 alert로 사용자에게 알림
 */
export const notifyError = (message: string, error?: unknown) => {
  // 개발 편의를 위해 콘솔 출력
  console.error(message, error)
  if (typeof window !== "undefined" && typeof window.alert === "function") {
    window.alert(message)
  }
}

