import axios, { AxiosResponse } from 'axios'
import $api from '../http/api'
import { AuthResponse } from '../redux/types'

const API_URL = import.meta.env.VITE_API_URL

export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return await $api.post<AuthResponse>('/users/login', {
      email,
      password,
    })
  }

  static async registration(
    userName: string,
    avatar: File,
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    const formData = new FormData()
    formData.append('userName', userName)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('avatar', avatar)

    return await $api.post<AuthResponse>('/users/registration', formData)
  }

  static async updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return await $api.post<AuthResponse>('/users/updatePassword', {
      email,
      oldPassword,
      newPassword,
    })
  }

  static async updateAvatar(
    id: string,
    avatar: File
  ): Promise<AxiosResponse<AuthResponse>> {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('avatar', avatar)
    return await $api.post<AuthResponse>('/users/updateAvatar', formData)
  }

  static async logout() {
    return await $api.post('/users/logout')
  }

  static async checkAuthOnStart() {
    return await axios.get<AuthResponse>(`${API_URL}/users/refresh`, {
      withCredentials: true,
    })
  }
}
