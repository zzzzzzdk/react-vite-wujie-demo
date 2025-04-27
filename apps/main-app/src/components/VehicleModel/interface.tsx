import { CSSProperties, ReactNode } from 'react'

export interface brandProps {
  v: string;
  k: string;
  nodes?: brandProps[];
}

export interface modelProps {
  v: string;
  k: string | number;
}

export interface yearProps {
  v: string;
  k: string | number;
}

export type value = string | number;

export interface VehicleModelProps {
  /**
   * 节点样式
   */
  style?: CSSProperties;
  /**
   * 节点类名
   */
  className?: string | string[];
  /**
   * 类名
   */
  wrapperClassName?: string;
  /**
   * 样式
   */
  wrapperStyle?: CSSProperties;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 默认文字
   */
  placeholder?: string;
  searchPlaceholder?: string | string[];
  /**
   * 定制显示内容
   */
  renderFormat?: (brand: brandProps | brandProps[] | undefined, model: modelProps[] | undefined, year: yearProps[] | undefined) => ReactNode
  /**
   * 热门品牌
   */
  hotBrands?: (string | number)[];
  /**
   * 品牌数据
   */
  brandData?: { [key: string | number]: brandProps };
  /**
   * @description 描述
   * @default default
   */
  allBrandData?: Array<string[]>;
  /**
   * 品牌数据
   */
  modelData?: { [key: string | number]: modelProps[] };
  /**
   * 品牌数据
   */
  yearData?: { [key: string | number]: yearProps[] };
  /**
   * 品牌值
   */
  brandValue?: value | value[];
  /**
   * 型号值
   */
  modelValue?: value[];
  /**
   * 年款值
   */
  yearValue?: value[];
  /**
   * 无数据显示的内容
   */
  notFoundContent?: ReactNode;
  /**
   * 模式
   */
  mode?: 'single' | 'multiple';
  /**
   * 尺寸
   */
  size?: 'mini' | 'small' | 'default' | 'large'
  /**
   * 错误状态
   */
  error?: string | boolean;
  /**
   * 是否开启清除
   */
  allowClear?: boolean;
  /**
   * 自定义清除图标
   */
  clearIcon?: ReactNode;
  /**
   * 自定义箭头图标
   */
  arrowIcon?: ReactNode;
  /**
   * loading
   */
  loading?: Boolean;
  /**
   * loading 自定义图标
   */
  loadingIcon?: ReactNode;
  /**
   * 边框
   */
  bordered?: Boolean;
  /**
   * 分隔符号
   */
  separator?: String;
  /**
   * 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。
   */
  getTriggerContainer?: () => HTMLElement;
  getTargetContainer?: () => HTMLElement;
  targetPosition?: 'left' | 'right';
  maxHeight?: number;
  destroyPopupOnHide?: Boolean;
  /**
  * 获取焦点回调
  */
  onFocus?: (e: any) => void;
  /**
   * 失去焦点回调
   */
  onBlur?: (e: any) => void;
  onChange?: (
    brandValue: value | value[] | undefined,
    modelValue: value[],
    yearValue: value[],
    extra: {
      brandData: brandProps | brandProps[] | undefined,
      modelData: modelProps[],
      yearData: yearProps[]
    }
  ) => void;
}


export interface brandListProps {
  isMultiple?: Boolean;
  prefixCls?: String;
}
