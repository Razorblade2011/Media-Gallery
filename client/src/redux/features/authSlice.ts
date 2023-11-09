import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import AuthService from '../../services/AuthService'
import { UserData, UserI } from '../types'

interface InitialState {
  isAuth: boolean
  user: UserI
  loading: boolean
  error: string
  showRegistraion: boolean
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
  user: { email: '', id: '' },
  loading: false,
  error: '',
  showRegistraion: false,
  showAvatarMenu: false,
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: UserData, { rejectWithValue }) => {
    try {
      const response = await AuthService.registration(email, password)
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
      return rejectWithValue((e as ErrorAxios).response.data.message)
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

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.logout()
    } catch (e) {
      return rejectWithValue(e as ErrorAxios)
    }
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
    setShowAvatarMenu: (state, { payload }) => {
      state.showAvatarMenu = payload
    },
    setShowRegisration: (state, { payload }) => {
      state.showRegistraion = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })
      .addCase(registerUser.fulfilled, (state, { payload }: any) => {
        state.loading = false
        state.user = payload.data
        state.error = ''
        state.isAuth = true
      })
      .addCase(
        registerUser.rejected,
        (state, { payload }: { payload: any }) => {
          state.loading = false
          state.user = { email: '', id: '' }
          state.error = payload
        }
      )
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, { payload }: { payload: any }) => {
        state.loading = false
        state.isAuth = true
        state.user = payload.data
        state.error = ''
      })
      .addCase(loginUser.rejected, (state, { payload }: { payload: any }) => {
        state.loading = false
        state.user = { email: '', id: '' }
        state.error = payload.response.data.message
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, { payload }: any) => {
        state.isAuth = true
        state.user = payload.data.user
        state.loading = false
      })
      .addCase(checkAuth.rejected, (state, { payload }: any) => {
        state.isAuth = false
        state.error = payload.response.data.message
      })
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.isAuth = false
        state.user = { email: '', id: '' }
      })
      .addCase(logout.rejected, (state, { payload }: any) => {
        state.loading = false
        state.error = payload.response.data.message
      })
  },
})

export const {
  setUser,
  setLoading,
  setAuth,
  setAuthError,
  setShowRegisration,
  setShowAvatarMenu,
} = auth.actions
export default auth.reducer
