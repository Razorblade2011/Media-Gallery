import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AuthService from '../../services/AuthService'
import {
  UserData,
  UserDataRegister,
  UserDataUpdatePassword,
  UserI,
} from '../types'

interface InitialState {
  isAuth: boolean
  user: UserI
  loading: boolean
  message: string
  error: string
  showAvatarMenu: boolean
}

interface ErrorAxios {
  response: {
    data: {
      message: string
    }
  }
}

const initialState: InitialState = {
  isAuth: false,
  user: { name: '', avatar: '', email: '', id: '' },
  loading: false,
  message: '',
  error: '',
  showAvatarMenu: false,
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    { name, avatar, email, password }: UserDataRegister,
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.registration(
        name,
        avatar,
        email,
        password
      )
      localStorage.setItem('token', response.data.accessToken)
      return response
    } catch (e) {
      return rejectWithValue((e as ErrorAxios).response.data.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: UserData, { dispatch, rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.data.accessToken)
      dispatch(setAuth(true))
      return response
    } catch (e) {
      return rejectWithValue(e as ErrorAxios)
    }
  }
)

export const updateAvatar = createAsyncThunk(
  'auth/updateAvatar',
  async () => {}
)

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (
    { email, oldPassword, newPassword }: UserDataUpdatePassword,
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.updatePassword(
        email,
        oldPassword,
        newPassword
      )
      localStorage.setItem('token', response.data.accessToken)
      return response
    } catch (e) {
      return rejectWithValue(e as ErrorAxios)
    }
  }
)

export const logoutUser = createAsyncThunk<void>(
  'auth/logoutUser',
  async () => {
    await AuthService.logout()
    localStorage.removeItem('token')
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.checkAuthOnStart()
      localStorage.setItem('token', response.data.accessToken)
      return response
    } catch (e) {
      return rejectWithValue(e as ErrorAxios)
    }
  }
)

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, { payload }) => {
      state.isAuth = payload
    },
    setUser: (state, { payload }) => {
      state.user = payload
    },
    setAuthError: (state, { payload }) => {
      state.error = payload
    },
    setLoading: (state, { payload }) => {
      state.loading = payload
    },
    setMessage: (state, { payload }) => {
      state.message = payload
    },
    setShowAvatarMenu: (state, { payload }) => {
      state.showAvatarMenu = payload
    },
  },
  extraReducers: (builder) => {
    builder

      //registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })
      .addCase(registerUser.fulfilled, (state, { payload }: any) => {
        state.loading = false
        state.user = payload.data.user
        state.error = ''
        state.isAuth = true
      })
      .addCase(
        registerUser.rejected,
        (state, { payload }: { payload: any }) => {
          state.loading = false
          state.user = { name: '', avatar: '', email: '', id: '' }
          state.error = payload
        }
      )

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, { payload }: { payload: any }) => {
        state.loading = false
        state.isAuth = true
        state.user = payload.data.user
        state.error = ''
      })
      .addCase(loginUser.rejected, (state, { payload }: { payload: any }) => {
        state.loading = false
        state.user = { name: '', avatar: '', email: '', id: '' }
        state.error = payload.response.data.message
      })

      //logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.isAuth = false
        state.user = { name: '', avatar: '', email: '', id: '' }
      })
      .addCase(logoutUser.rejected, (state, { payload }: any) => {
        state.loading = false
        state.error = payload.response.data.message
      })

      // updatePassword
      .addCase(updatePassword.pending, (state) => {
        state.loading = true
      })
      .addCase(updatePassword.fulfilled, (state, { payload }: any) => {
        state.loading = false
        state.message = payload.data.message
        state.error = ''
      })
      .addCase(updatePassword.rejected, (state, { payload }: any) => {
        state.loading = false
        state.error = payload.response.data.message
      })

      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, { payload }: any) => {
        state.isAuth = true
        state.user = payload.data.user
        state.loading = false
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuth = false
      })
  },
})

export const {
  setUser,
  setLoading,
  setMessage,
  setAuth,
  setAuthError,
  setShowAvatarMenu,
} = auth.actions
export default auth.reducer
