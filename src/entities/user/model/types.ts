/**
 * 사용자 주소 정보
 */
export interface UserAddress {
  address: string
  city: string
  state: string
}

/**
 * 사용자 회사 정보
 */
export interface UserCompany {
  name: string
  title: string
}

/**
 * 사용자 타입
 */
export interface User {
  id: number
  username: string
  image: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address: UserAddress
  company: UserCompany
}
