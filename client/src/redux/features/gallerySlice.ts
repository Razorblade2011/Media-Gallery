import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import $api from '../../http/api'
import { Author, Tag } from '../types'

export interface FileI {
  _id: string
  title: string
  size: number
  type: 'image' | 'video'
  width: number
  height: number
  extention: string
  originalPath: string
  previewPath: string
  tags: Tag[]
  author: Author
  user: {
    id: number
    email: string
    profile: {
      username: string
    }
  }
  fragmentPreviewPath: string
  duration: number
}

interface InintialState {
  authors: Author[]
  tags: Tag[]
  files: FileI[]
  fileIndex: number
  page: number
  limit: number
  sort: 'createdAt' | 'title'
  way: 1 | -1
  search: string
  activePage: number
  pageCount: number
  isLoading: boolean
  isLoadingTags: boolean
  isModalShow: boolean
  modalObject?: FileI
  message: string
  error: string
}

const initialState: InintialState = {
  authors: [],
  tags: [],
  files: [],
  fileIndex: 0,
  page: 1,
  limit: 10,
  sort: 'createdAt',
  way: 1,
  search: '',
  activePage: 1,
  pageCount: 0,
  isLoading: false,
  isLoadingTags: false,
  isModalShow: false,
  modalObject: undefined,
  message: '',
  error: '',
}

export const fetchTags = createAsyncThunk(
  'gallery/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      return await $api.get('/media/tags')
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const uploadTags = createAsyncThunk<any, string[], { rejectValue: any }>(
  'gallery/uploadTags',
  async (tags, { rejectWithValue }) => {
    try {
      return await $api.post<string[]>('/media/tags', tags)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// функция удаления тегов
export const deleteTag = createAsyncThunk(
  'gallery/deleteTags',
  async (id: string, { rejectWithValue }) => {
    try {
      return await $api.delete(`/media/tags/${id}`)
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const fetchMedia = createAsyncThunk(
  'gallery/fetchMedia',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      return await $api.get(
        `/media?page=${state.galleryReducer.page}&limit=${state.galleryReducer.limit}&sort=${state.galleryReducer.sort}&way=${state.galleryReducer.way}&search=${state.galleryReducer.search}`
      )
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const updateMedia = createAsyncThunk(
  'gallery/updateMedia',
  async (
    {
      mediaId,
      newMediaTitle,
      newMediaAuthor,
      tagsIds,
    }: {
      mediaId: string
      newMediaTitle: string
      newMediaAuthor: string
      tagsIds: string[]
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData()
      if (newMediaTitle?.length) {
        formData.append('mediaTitle', newMediaTitle)
      }
      formData.append('mediaId', mediaId)
      formData.append('mediaAuthor', newMediaAuthor)
      formData.append('tagsIds', JSON.stringify(tagsIds))
      return await $api.put('/media', formData)
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const deleteMedia = createAsyncThunk(
  'gallery/deleteMedia',
  async (
    { id, title }: { id: string; title: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await $api.delete(`/media/${id}`)
      dispatch(setMessage(`Файл ${title} был удалён.`))
      return res
    } catch (error) {
      console.log(error)
      return rejectWithValue(error)
    }
  }
)

export const fetchAuthors = createAsyncThunk(
  'gallery/fetchAuthors',
  async (_, { rejectWithValue }) => {
    try {
      const res = await $api.get('/media/authors')
      return res
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const uploadAuthor = createAsyncThunk(
  'gallery/uploadAuthor',
  async (
    { title, description }: { title: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await $api.post('/media/authors', { title, description })
      return res
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

export const updateAuthor = createAsyncThunk(
  'gallery/updateAuthor',
  async (
    {
      _id,
      title,
      description,
    }: {
      _id: string
      title: string
      description: string
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData()
      formData.append('_id', _id)
      formData.append('title', title)
      formData.append('description', description)
      return await $api.put('/media/authors', formData)
    } catch (error) {
      rejectWithValue(error)
    }
  }
)

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setMessage: (state, { payload }: PayloadAction<string>) => {
      state.message = payload
    },
    setModalShow: (state, { payload }) => {
      state.isModalShow = payload
    },
    setModalObject: (state, { payload }) => {
      state.modalObject = payload
    },
    fileOnClickHandle: (state, { payload }) => {
      state.modalObject = payload.file
      state.fileIndex = payload.i
      state.isModalShow = true
    },
    previousModalFile: (state) => {
      state.fileIndex =
        state.fileIndex - 1 < 0 ? state.files.length - 1 : state.fileIndex - 1
      state.modalObject = state.files[state.fileIndex]
    },
    nextModalFile: (state) => {
      state.fileIndex =
        state.fileIndex + 1 > state.files.length - 1 ? 0 : state.fileIndex + 1
      state.modalObject = state.files[state.fileIndex]
    },
    setPage: (state, { payload }) => {
      state.page = payload
    },
    setSortAndWay: (state, { payload }) => {
      state.sort = payload.sort
      state.way = payload.way
    },
    setActivePage: (state, { payload }) => {
      state.activePage = payload
    },
    setSearch: (state, { payload }: PayloadAction<string>) => {
      state.search = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.isLoadingTags = true
      })
      .addCase(
        fetchTags.fulfilled,
        (state, { payload }: PayloadAction<any>) => {
          state.isLoadingTags = false
          state.tags = payload.data
        }
      )
      .addCase(fetchTags.rejected, (state, { payload }: any) => {
        state.isLoadingTags = false
        state.error = payload.response.data.message
      })
      .addCase(fetchAuthors.pending, (state) => {
        state.isLoading = false
      })
      .addCase(fetchAuthors.fulfilled, (state, { payload }: any) => {
        state.isLoading = false
        state.authors = payload.data
      })
      .addCase(fetchAuthors.rejected, (state, { payload }: any) => {
        state.isLoading = false
        state.error = payload.response.data.message
      })
      .addCase(fetchMedia.pending, (state) => {
        state.isLoading = true
      })
      .addCase(
        fetchMedia.fulfilled,
        (state, { payload }: PayloadAction<any>) => {
          state.files = payload.data.results
          state.pageCount = payload.data.pageCount
          state.isLoading = false
        }
      )
      .addCase(fetchMedia.rejected, (state, { payload }: any) => {
        state.isLoading = false
        state.error = payload.response.data.message
      })
      .addCase(deleteMedia.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMedia.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(deleteMedia.rejected, (state, { payload }: any) => {
        state.isLoading = false
        state.error = payload.response.data.message
      })
  },
})

export const {
  setSearch,
  setMessage,
  setModalShow,
  setSortAndWay,
  setModalObject,
  fileOnClickHandle,
  previousModalFile,
  nextModalFile,
  setPage,
  setActivePage,
} = gallerySlice.actions
export default gallerySlice.reducer
