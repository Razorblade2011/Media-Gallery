import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosProgressEvent, AxiosError, AxiosResponse } from 'axios'
import $api from '../../http/api'
import { RootState } from '../store'
import { Tag } from '../types'

type Args = {}

type Author = {
  _id: string
  title: string
  description: string
}

interface ErrorAxios {
  message: string
}

interface ResponseAxios {
  message: string
}

interface InitialState {
  files: { name: string; file: File }[]
  fileTags: Tag[]
  tags: Tag[]
  author: Author
  isComix: boolean
  cover: File | string
  isLoading: boolean
  message: string
  error: string
  uploadingProgress: number
  uploading: boolean
  uploadDone: boolean
}

export const uploadFiles = createAsyncThunk<
  AxiosResponse<ResponseAxios>,
  Args,
  {
    state: RootState
  }
>('upload/uploadFiles', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState()

    if (!state.uploadReducer.files.length) {
      console.log('Нет файлов!')
      dispatch(setError('Нет файлов!'))
      throw Error('Нет файлов!')
    }
    const formData = new FormData()
    state.uploadReducer.files.map((file) => {
      formData.append(file.file.type.split('/')[0], file.file, file.name)
    })

    const fileTagsIds = state.uploadReducer.fileTags.map((tag) => tag._id)

    formData.append('author', JSON.stringify(state.uploadReducer.author._id))
    formData.append('tags', JSON.stringify(fileTagsIds))
    formData.append('user', state.authReducer.user.id)

    const config = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          dispatch(setUploadingProgress(percentCompleted))
          if (percentCompleted === 100) {
            dispatch(setUploadingProgress(0))
          }
        }
      },
    }
    dispatch(setUploading(true))
    const res = await $api.post<ResponseAxios>('/media', formData, config)

    dispatch(setUploading(false))

    dispatch(setUploadFiles([]))
    dispatch(setAuthor(''))
    dispatch(setFileTags([]))
    return res
  } catch (error) {
    console.log((error as AxiosError<ErrorAxios>)?.response?.data.message)
    return rejectWithValue(
      (error as AxiosError<ErrorAxios>)?.response?.data.message
    )
  }
})

const initialState: InitialState = {
  files: [],
  fileTags: [],
  tags: [],
  author: {
    _id: '',
    title: '',
    description: '',
  },
  isComix: false,
  cover: '',
  isLoading: false,
  message: '',
  error: '',
  uploadingProgress: 0,
  uploading: false,
  uploadDone: false,
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadFiles: (state, { payload }) => {
      state.files = payload
    },
    setTags: (state, { payload }) => {
      state.tags = payload
    },
    setFileTags: (state, { payload }) => {
      state.fileTags = payload
    },
    setAuthor: (state, { payload }) => {
      state.author = payload
    },
    setIsComix: (state, { payload }) => {
      state.isComix = payload
    },
    setCover: (state, { payload }) => {
      state.cover = payload
    },
    setMessage: (state, { payload }) => {
      state.message = payload
    },
    setError: (state, { payload }) => {
      state.error = payload
    },
    setUploadingProgress: (state, { payload }) => {
      state.uploadingProgress = payload
    },
    setUploading: (state, { payload }) => {
      state.uploading = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadFiles.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.message = payload.data.message
        state.error = ''
      })
      .addCase(uploadFiles.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload as string
      })
  },
})

export const {
  setUploadFiles,
  setAuthor,
  setTags,
  setFileTags,
  setIsComix,
  setCover,
  setMessage,
  setError,
  setUploadingProgress,
  setUploading,
} = uploadSlice.actions
export default uploadSlice.reducer
