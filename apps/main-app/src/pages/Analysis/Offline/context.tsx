import { createContext, ReactNode } from 'react'
import { OfflineTreeItem } from './interface'

export const OfflineContext = createContext<{
  offlineTreeData?: OfflineTreeItem[];
  onOfflineTreeDataChange?: (data: OfflineTreeItem[]) => void;
}>({})
