import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
// import galleryReducer from "./features/gallerySlice"
// import uploadReducer from "./features/uploadSlice"

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
