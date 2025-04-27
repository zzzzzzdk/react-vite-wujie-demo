import { createContext, ReactNode } from 'react'
import { HistoryTreeItem } from './interface'

export const HistoryContext = createContext<{
  HistoryTreeData?: HistoryTreeItem[];
  onHistoryTreeDataChange?: (data: HistoryTreeItem[]) => void;
}>({})
