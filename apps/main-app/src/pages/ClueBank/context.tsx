import { createContext, ReactNode } from "react";
export const ClueContext = createContext<{
  clueTreeData?: any[];
  onclueTreeDataChange?: (data: any[]) => void;
  group?: string;
  ongroupchange?: (data: string) => void;
  ontreestatus?: (data: boolean) => void;
}>({});
