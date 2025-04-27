import * as React from 'react'

interface DataItem {
  /**
 * 菜单名称
 */
  title: string;
  /**
  * 字体图标，只有第一层菜单有效
  */
  icon?: React.ReactNode | string;
  /**
  * 下一级菜单，最多支持三级
  */
  children?: DataItem[];
  /**
  * 菜单路径也是唯一值  如果以http或者https开头会发开外部链接
  */
  path: string;
  /**
  * 同a标签的target
  */
  target?: string;
}


export interface MenuProps {
  /**
  * type为vertical是否收起  hover:true时此属性无效
  * @default false
  */
  inlineCollapsed?: boolean;
  /**
  * 选中的菜单
  */
  activeKey?: string;
  /**
  *  菜单需要的数组数据
  */
  data: DataItem[];
  /**
  *  选中菜单发生变化
  */
  onChange?: (e: any) => void;
  /**
  *  展开收起发生变化
  */
  onOpen?: (e: any) => void;
  /**
   *  整体导航展开收起发生变化
   */
  onCollapsed?: (e: any) => void;
  /**
  *  类名
  */
  className?: string;
  /**
  *  展开的值
  */
  openKeys?: string[];
  /**
  *  连接方式 可传入react-router的Link
  */
  link?: React.ComponentType;
  /**
  * 菜单的方向是横着还是竖着
  * @default vertical
  */
  type?: string;
  /**
  * 竖着展开模式是否为hover
  * @default false
  */
  hover?: boolean;

  /**
  * 是否固定 hover:true时起效
  * @default false
  */
  fixed?: boolean;
  /**
  * 固定发生变化 hover:true时起效
  */
  onFixed?: (e: any) => void;
  /**
   * @description 是否hover状态,在hover为true时生效
   */
  hovering?: boolean;
  /**
  * 进入或者离开 hover:true时起效
  */
  onHoverChange?: (e: boolean) => void;

  /**
  *  收起延迟时间  hover:true时起效
  */
  mouseLeaveTime?: number
  width?: string;
}
