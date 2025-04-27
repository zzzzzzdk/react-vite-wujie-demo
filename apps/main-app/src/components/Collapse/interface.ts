import React, { ReactNode } from 'react'

export default interface CollapseProps {
  /**
   * @description 头部插槽
   * @default ReactNode
   */
  headerSlot?: ReactNode
  /**
  * @description 头部标题 ,复用默认头部时使用
  * @default title
  */
  title?: ReactNode
  /**
  * @description 头部icon ,复用默认头部时使用
  * @default true
  */
  showTitleIcon?: boolean
  /**
  * @description 右侧展开收起按钮 ,复用默认头部时使用 ,如果不显示，则collapse需要设置为false ，不然看不见内容
  * @default true
  */
   showButton?: boolean
  /**
   * @description 是否收起
   * @default false
   */
  collapse?: boolean

  /**
   * @description 头部插槽
   * @default ReactNode
   */
  children?: ReactNode

}

export interface CollapseRef {
  collapse: () => void
  expand: () => void
}
