import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import AuthService from '../../services/AuthService'
import {
  UserData,
  UserDataRegister,
  UserDataUpdatePassword,
  UserI,
} from '../types'
import { RootState } from '../store'
import { AxiosError, isAxiosError } from 'axios'

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
  user: {
    name: '',
    avatar: '',
    email: '',
    id: '',
    settings: { videoVolume: 0, objectPerPage: 30 },
  },
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
  async (avatar: File, { rejectWithValue, getState }) => {
    try {
      const { user } = (getState() as RootState).authReducer
      const response = await AuthService.updateAvatar(user.id, avatar)
      return response
    } catch (e) {
      if (isAxiosError(e)) {
        return rejectWithValue(
          (e as AxiosError<{ message: string }>).response?.data?.message
        )
      }
    }
  }
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

export const setUserVideoVolume = createAsyncThunk(
  'auth/setUserVideoVolume',
  async (volumeValue: number, { rejectWithValue, getState, dispatch }) => {
    const { user } = (getState() as RootState).authReducer
    const volume = +volumeValue.toFixed(2)
    dispatch(setVolume(volume))
    const response = await AuthService.setUserVolume(user.id, volume)
    return response
  }
)

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFalse: (state) => {
      state.isAuth = false
      state.user = initialState.user
    },
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
    setVolume: (state, { payload }) => {
      state.user.settings.videoVolume = payload
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
          state.user = initialState.user
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
        state.user = initialState.user
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

      // updateAvatar
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true
      })
      .addCase(updateAvatar.fulfilled, (state, { payload }: any) => {
        state.loading = false
        state.message = payload.data.message
        state.error = ''
        state.user = payload.data.user
      })
      .addCase(updateAvatar.rejected, (state, { payload }: any) => {
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

      // setUserVideoVolume
      .addCase(setUserVideoVolume.fulfilled, (state, { payload }: any) => {
        state.user.settings.videoVolume = payload.data
      })
  },
})

export const {
  setUser,
  setLoading,
  setMessage,
  setAuthFalse,
  setAuth,
  setAuthError,
  setShowAvatarMenu,
  setVolume,
} = auth.actions
export default auth.reducer
