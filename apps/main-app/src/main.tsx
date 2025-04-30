import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import store from '@/store'
import APPRouter from './App';
// import '@yisa/yisa-map/dist/yisa-map.mini.css'
import './assets/css/index.scss'
import Update from './Update.js'


ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <Provider store={store}>
    <APPRouter />
    <Update />
  </Provider>
);
