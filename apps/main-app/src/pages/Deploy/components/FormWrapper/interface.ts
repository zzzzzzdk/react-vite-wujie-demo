export type FormItemConfig<T> = {
  className?: string;
  /**
   * @description 可与validate配合使用，控制校验时机
   */
  key?: React.Key;
  name?: keyof T;
  label?: React.ReactNode;
  /**
   * @description Input Select TimerRangePicker
   */
  element: React.ReactElement;
  /**
   * @description 用于，校验失败返回非空字符串，否则返回""
   **/
  validate?: (form: T) => string;
  /**
   * @description 是不是已经包裹了一层Form.Item, 比如TimerRangePicker
   * @default false
   */
  wrapped?: boolean;
  /**
   * @description
   * @default true
   */
  show?: boolean;
  /**
   * @description 是不是必选字段，前面加个*
   * @default false
   * */
  required?: boolean;
};
