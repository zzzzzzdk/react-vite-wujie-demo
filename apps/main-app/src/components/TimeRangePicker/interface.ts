import type { Dayjs } from 'dayjs'
import { FormItemProps } from "@yisa/webui/es/Form"
import React, { ReactNode } from 'react'

export type DatesParamsType = { [key: string]: string }

export default interface TimeRangePickerProps {
  allowClear?: boolean
  className?: string;
  /**
   * @description 是否有时间时段选择
   * @default time
   */
  showTimeType?: boolean
  /**
   * @description 是否展示昨日
   * @default time
   */
  showYesterday?: boolean
  /**
   * @description 是否展示快捷'一月'
   * @default true
   */
  showMonth?: boolean
  /**
    * @description 是否禁用
    * @default false
    */
  disabled?: boolean
  /**
    * @description 禁用日期
    * @default false
    */
  disabledDate?: any
  /**
    * @description 自定义label
    * @default time
    */
  timeCustomLabel?: ReactNode
  /**
   * @description 时间段
   */
  timeType?: string;
  /**
   * @description 开始日期
   * @default null
   */
  beginDate?: Dayjs | string | null;
  /**
   * @description 结束日期
   * @default null
   */
  endDate?: Dayjs | string | null;
  /**
   * @description 开始时间
   * @default null
   */
  beginTime?: Dayjs | string | null;
  /**
   * @description 结束时间
   * @default null
   */
  endTime?: Dayjs | string | null;
  /**
   * @description Form.Item配置
   * @default {}
   */
  formItemProps?: FormItemProps;
  /**
   * @description 时间变化回调
   * @default {}
   */
  onChange?: (dates: DatesParamsType) => void;
  /**
   * @description 时段组件布局方式，水平和垂直
   * @default horizontal
   */
  timeLayout?: 'horizontal' | 'vertical';
  /**
  * @description 时间类型下拉样式
  * @default
  */
  timeSelectTypeStyle?: React.CSSProperties;
  /**
   * @desription 当timeType为range, 是否支持多个时段
   * @default false
   */
  multiRange?: boolean;
  /**
   * @desription 和multiRange配合使用
   */
  spans?: TimeSpan[];
  /**
   * @description  多时间段回调(不处理日期)
   */
  onSpansChange?: (spans: TimeSpan[]) => void;
  showinnerTimeType?: boolean//是否显示常用时段
  /**
   * @description 三天 一周 一月是否指未来的时间
   * @defalut false 默认过去时间
   */
  futureFirst?: boolean,
  /**
   * @description 是否显示时分秒
   * @default true
   */
  showTime?: boolean,
  /**
   * @description 主题设置
   * @default true
   */
  themeType?: "technology" | "default",
  // 
  getPopupContainer?: (trigger: HTMLElement) =>  HTMLElement;
  popupStyle?: React.CSSProperties;
}

export type TimeSpan = [string | null, string | null]
