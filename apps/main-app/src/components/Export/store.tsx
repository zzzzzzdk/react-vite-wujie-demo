import React, { createContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { ExportProps } from "./interface";
import { useData } from "./hooks";
import useMergeProps from "@/hooks/useMergeProps"

type SettingContext = PropsWithChildren<ExportProps>;

const defaultProps = {
  sizeWithImage: 1000,
  size: 1000,
  total: 0,
  showTotal: true,
  hasImage: true,
  hasProgress: true,
  progressInterval: 3000,
  formData: {}
}

export const SettingContext = createContext<SettingContext>(defaultProps);
export const DataContext = createContext<PropsWithChildren<
  ReturnType<typeof useData>
> | null>(null);



export default function Provider(baseProps: SettingContext) {
  const props = useMergeProps<SettingContext>(baseProps, defaultProps, {})
  const exportData = useData();

  return (
    <SettingContext.Provider value={props}>
      <DataContext.Provider value={exportData}>
        {props.children}
      </DataContext.Provider>
    </SettingContext.Provider>
  );
}
