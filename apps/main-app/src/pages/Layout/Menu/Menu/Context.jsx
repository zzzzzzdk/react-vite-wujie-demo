import { createContext } from 'react'

const MenuContext = createContext({
  activeKey: '',
  inlineCollapsed: false,
  link: null,
  activePath: ['', '', '', ''],
  innerOpenKeys: [],
  data: [],
  prefixCls: ''
})

export default MenuContext
