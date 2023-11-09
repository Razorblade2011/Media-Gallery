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
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return await $api.post<AuthResponse>('/users/registration', {
      email,
      password,
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
