import type { ColumnProps, TableProps } from "@yisa/webui/es/Table";
import React, { useMemo } from "react";

import TableAction, { TableActionProps } from "../TableAction";

interface CustomColumnProps<T> extends ColumnProps<T> {
  dataIndex?: Exclude<keyof T, number | symbol>;
}
function useTableColumns<T>(
  columns: CustomColumnProps<T>[],
  options: {
    withNumber?: boolean;
    actions?: TableActionProps<T>[];
    deps?: React.DependencyList;
  } = {}
): ColumnProps<T>[] {
  const { withNumber, actions, deps } = options;
  let newColumns = [...columns];
  if (withNumber) {
    newColumns = [
      {
        title: "序号",
        width: "84px",
        render(_, __, index) {
          return index + 1;
        },
      },
      ...columns,
    ];
  }
  if (actions) {
    newColumns = [
      ...newColumns,
      {
        title: "操作",
        render(col, item, index) {
          return actions.map((action) => (
            <TableAction key={action.children} {...action} item={item} />
          ));
        },
      },
    ];
  }
  return useMemo(() => newColumns, deps);
}
export default useTableColumns;
