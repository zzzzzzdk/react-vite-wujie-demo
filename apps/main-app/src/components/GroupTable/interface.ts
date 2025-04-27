import React from "react";

export type TableConfigType = {
  name?: string;
  countTitle?: string;
}

export default interface GroupTableProps<T = any> {
  className?: string;
  style?: React.CSSProperties;
  pageSize?: number;
  data?: T[];
  tableConfig?: TableConfigType;
  onSelect?: (id: string, text: string) => void;
}