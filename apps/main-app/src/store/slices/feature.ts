import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReactNode } from 'react'
import { TargetType, TargetFeatureItem } from "@/config/CommonType";

const initialState: { targetFeatureList: TargetFeatureItem[] } = {
  targetFeatureList: []
}

export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    addTargetFeatureList: (state, action: PayloadAction<TargetFeatureItem[]>) => {
      state.targetFeatureList = action.payload
    },
    delTargetFeatureList: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.targetFeatureList = state.targetFeatureList.filter(item => item.feature !== payload)
    },
    clearTargetFeatureList: (state, action: PayloadAction<TargetFeatureItem[]>) => {
      state.targetFeatureList = []
    }
  },
})

export const { addTargetFeatureList, delTargetFeatureList, clearTargetFeatureList } = featureSlice.actions
export default featureSlice.reducer