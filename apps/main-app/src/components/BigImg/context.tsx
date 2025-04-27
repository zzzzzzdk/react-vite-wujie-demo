import { createContext, ReactNode } from 'react'
import { ResultRowType } from '@/pages/Search/Target/interface';
import { FeatureInfo } from '@yisa/webui_business/es/ImgPreview'

export const BigImgContext = createContext<{
  selectedFeatureData?: FeatureInfo[];
  handleFeatureChange?: (data: FeatureInfo[]) => void;
}>({})
