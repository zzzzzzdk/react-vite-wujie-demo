import { ReactNode } from 'react'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TargetType, TargetFeatureItem } from "@/config/CommonType";
import { GroupFilterItem } from '@/config/CommonType';

const initialState: { selectedGroup: string[], selectedFilter: string[], filterTags: GroupFilterItem[] } = {
  selectedGroup: [],
  selectedFilter: [],
  filterTags: []
}

export const groupFilterSlice = createSlice({
  name: 'groupFilter',
  initialState,
  reducers: {
    changeSelectedGroup: (state, action: PayloadAction<string[]>) => {
      state.selectedGroup = action.payload
    },
    changeSelectedFilter: (state, action: PayloadAction<string[]>) => {
      state.selectedFilter = action.payload
    },
    changeFilterTags: (state, action: PayloadAction<GroupFilterItem[]>) => {
      state.filterTags = action.payload
    },
    clearAll: (state) => {
      state.selectedGroup = []
      state.selectedFilter = []
      state.filterTags = []
    }
  },
})

export const { changeSelectedGroup, changeSelectedFilter, changeFilterTags, clearAll } = groupFilterSlice.actions
export default groupFilterSlice.reducer