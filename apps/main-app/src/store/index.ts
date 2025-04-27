import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import user from './slices/user'
import comment from './slices/comment'
import breadcrumb from './slices/breadcrumb'
import feature from './slices/feature'
import groupFilter from './slices/groupFilter'
import editStatus from './slices/editStatus'
import vertical from './slices/vertical'
const store = configureStore({
  reducer: {
    user,
    breadcrumb,
    comment,
    feature,
    groupFilter,
    editStatus,
    vertical
  },
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppSelector = TypedUseSelectorHook<RootState>

export {
  useSelector,
  useDispatch
}
