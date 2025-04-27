import { createSlice } from '@reduxjs/toolkit';
import character from "@/config/character.config"
import { flushSync } from 'react-dom';
import microApp from '@micro-zoe/micro-app'

const createRandom = () => {
  return new Date().getTime() + '_' + Math.random()
}

const changeTheme = (skin: string) => {
  document.body.className = 'theme-' + skin
  localStorage.setItem(window.systemSkinKey, skin)

  if (document.getElementById('theme-' + skin)) {
    (document.getElementById('theme-' + skin) as any).media = 'all'
  }
}

export const commonSlice = createSlice({
  name: 'comment',
  initialState: {
    skin: 'light',
    sidebarWidth: '',
    layout: 'vertical',
    routerData: {
      name: '',
      breadcrumb: []
    },
  },
  reducers: {
    setSkin: (state, action) => {
      let skin = action.payload
      if (state.skin !== skin) {

        changeTheme(skin)
        state.skin = skin
        microApp.setGlobalData({
          skin: skin
        })
      }
    },
    setLayout: (state, action) => {
      let layout = action.payload
      state.layout = layout
    },
    initSkinLayout: (state, action) => {
      let skin = action.payload.color || window.YISACONF.color
      // let skin = action.payload.color || "dark"
      if (state.skin !== skin) {
        changeTheme(skin)
        state.skin = skin
      }

      // state.layout = action.payload.layout || window.YISACONF.layout
      state.layout = action.payload.layout || "vertical"
    },
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = createRandom();
    },
    setRouterData: (state, action) => {
      state.routerData = {
        breadcrumb: action.payload.breadcrumb || [],
        name: action.payload.name || ''
      }
    },

  }
});

export const {
  setSkin,
  setLayout,
  initSkinLayout,
  setSidebarWidth,
  setRouterData
} = commonSlice.actions;


export default commonSlice.reducer;
