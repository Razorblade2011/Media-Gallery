export interface Author {
  _id: string
  title: string
  description: string
  files: string[]
  createdAt: string
  updatedAt: string
}

export interface Tag {
  _id: string
  title: string
  files: string[]
  createdAt: string
  updatedAt: string
}

// ============================
// USER
// ============================
export interface User {
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface UserData {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserI
}

export interface UserI {
  email: string
  id: string
}
