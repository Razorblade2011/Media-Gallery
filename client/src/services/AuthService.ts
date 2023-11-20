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
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return await $api.post<AuthResponse>('/users/registration', {
      userName,
      email,
      password,
    })
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

  static async logout() {
    return await $api.post('/users/logout')
  }

  static async checkAuthOnStart() {
    return await axios.get<AuthResponse>(`${API_URL}/users/refresh`, {
      withCredentials: true,
    })
  }
}
