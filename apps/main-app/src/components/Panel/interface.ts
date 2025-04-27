import React, { ReactNode } from 'react'

export default interface CollapseProps {
  className?:string
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
   * @description 头部插槽
   * @default ReactNode
   */
  children?: ReactNode,

  // ref?:React.RefObject<HTMLDivElement>
}
