
export interface CreateTrackBtnProps<T = any> {
  /**
   * @description 禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
   * @description 选中数组
   * @default []
   */
  checkedList?: T[];
}