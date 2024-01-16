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
  name: string
  avatar: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface UserDataRegister {
  name: string
  avatar: File
  email: string
  password: string
}

export interface UserDataUpdatePassword {
  email: string
  oldPassword: string
  newPassword: string
}

export interface UserData {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: UserI
}

export interface UserI {
  id: string
  name: string
  avatar: string
  email: string
  settings: {
    videoVolume: number
    objectPerPage: number
  }
}

export type nameAvailableResponse = 'Имя свободно' | 'Имя занято' | 'Неизвестно'
