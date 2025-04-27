import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReactNode } from 'react'

const initialState: { status: boolean } = {
  status: false
}

export const editStatusSlice = createSlice({
  name: 'editStatus',
  initialState,
  reducers: {
    changeEditSattus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload
    }
  },
})

export const { changeEditSattus } = editStatusSlice.actions
export default editStatusSlice.reducer