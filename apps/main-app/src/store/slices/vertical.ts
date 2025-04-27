import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReactNode } from 'react'




const initialState: { fixed: boolean } = {
  fixed: false
}

export const verticalSlice = createSlice({
  name: 'vertical',
  initialState,
  reducers: {
    setVerticalFixed: (state, action: PayloadAction<boolean>) => {
      state.fixed = action.payload
    },
  },
})

export const { setVerticalFixed } = verticalSlice.actions
export default verticalSlice.reducer