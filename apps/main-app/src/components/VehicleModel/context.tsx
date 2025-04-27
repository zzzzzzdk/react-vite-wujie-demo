import { createContext, ReactNode } from 'react'
import { brandProps, modelProps, yearProps, value } from './interface'

export const VehicleModelContext = createContext<{
  maxHeight?: number,
  noData?: ReactNode,
  searchPlaceholder?: string | string[],
  brandData?: { [key: value]: brandProps },
  modelData?: { [key: value]: modelProps[] },
  yearData?: { [key: value]: yearProps[] },
  brandValue?: value | value[] | undefined,
  modelValue?: value[],
  yearValue?: value[],
  onChange?: (brandValue: value | value[] | undefined, modelValue: value[], yearValue: value[]) => void
}>({})
