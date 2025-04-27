
export type ParamsType = {
  sorterField?: string;
  sorterOrder?: 'ascend' | 'descend';
  pn?: number;
  pageSize?: number | string;
}

export interface TableListProps {
  params?: ParamsType;
  onChangePath?: (formData: ParamsType) => void;
  isDestroy?: () => boolean;
}

/**列表数据项类型 */
export type ResultRowType = {
  sortT?: number | string;
  idT: string;
  id?: string | number;
  name?: string;
  tag?: string;
  account?: string;
  collect_time?: string;
  account1?: string;
  action?: string;
}

/** Header-Props */
export interface TableListHeaderProps {
  onChange?: (data: any, flag?: boolean | undefined) => void;
  ajaxLoading: boolean;
}
