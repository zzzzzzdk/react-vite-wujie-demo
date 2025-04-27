import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReactNode } from 'react'




const initialState: { breadcrumb: ReactNode[] } = {
  breadcrumb: []
}

export const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumb: (state, action: PayloadAction<ReactNode[]>) => {
      state.breadcrumb = action.payload
    },
  },
})

export const { setBreadcrumb } = breadcrumbSlice.actions
export default breadcrumbSlice.reducer