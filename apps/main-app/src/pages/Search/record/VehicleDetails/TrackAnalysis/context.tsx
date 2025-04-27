import { createContext } from 'react'
export const CurContext = createContext<{
  curIndex:number,
  onCurIndex: (data: any) => void;
}>({
  curIndex:-1,
  onCurIndex: () => {}
})
