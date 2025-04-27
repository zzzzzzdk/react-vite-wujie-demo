import { ResultRowType } from "@/pages/Search/Target/interface";
// 大图右侧地图props
export default interface MapAroundPointProps {
  lng?: string | null;
  lat?: string | null;
  locationId?: string;
  id?: string;
  footholdarr?: {
    data: {
      lat: string;
      lng: string;
      locationName: string;
    }[];
    type: 'foothold' | 'doublecar';
  },
  showCheckTarget?: boolean
  onCheckTargetClick?: () => void
  showDrawTools?: boolean
  //选中的点位
  checkedLocationIds?: string[]
  onChangecheckedLocationIds?: (ids: string[]) => void
  viewCenterZoom?: number
  onViewCenterZoomChange?: (zoom: number) => void
  data?:ResultRowType
  showCheckBox?:boolean
  rangeOption?:string
  onRangeOptionChange?:(rangeOption:string) => void
}
