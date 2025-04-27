import { FormItemProps } from "@yisa/webui/es/Form"
import L, { LeafletEvent, Marker } from "leaflet"
import { OfflineTreeItem, ResultRowType as OfflineChildrenItem } from "@/pages/Analysis/Offline/interface";

export type LocationListType = 'region' | 'locationGroup' | 'offline'

// 回调参数类型
export type LocationMapListCallBack = {
  locationIds: string[];
  locationGroupIds: string[];
  offlineIds: (string | number)[];
  parentIds?: string[];
}

export default interface LocationMapListProps {
  className?: string;
  /**
    * @description modal的title
    */
  title?: string
  /**
    * @description 禁用
    */
  disabled?: boolean
  /**
    * @description 按钮显示文本（一般和title保持一致）
    */
  buttonTitle?: string
  /**
   * Form.Item配置
   */
  formItemProps?: FormItemProps;
  /**
   * 提示文字， 默认“点位”
   */
  locationListTips?: string;
  /**
   * 控制选中点位id数组
   */
  locationIds?: string[];
  /**
   * 控制选中点位组id数组
   */
  locationGroupIds?: string[];
  /**
  * 控制选中离线id数组
  */
  offlineIds?: (string | number)[];
  /**
   * 	选中项发生变化时的回调
   */
  onChange?: (value: LocationMapListCallBack) => void;
  /**
   * 点位接口地址
   */
  locationUrl?: string;
  /**
   * 离线任务接口地址
   */
  offlineUrl?: string;
  /**
   * 默认列表类型，默认region
   */
  defaultListType?: LocationListType;
  /**
   * @description tab栏数据
   */
  tagTypes?: {
    key: string;
    name: string;
  }[];
  /**
   * @description 只有点位数据标志位 ,用于控制选中时，右边列表上方的文字显示
   */
  onlyLocationFlag?: boolean;
  /**
   * @description 是否展示框选工具
   */
  showDrawTools?: boolean
  /**
 * @description 是否展示地图
 */
  showMap?: boolean
  /**
   * @description 框选工具默认值
   */
  defaultDrawType?: DrawType
  /**
  * @description 框选工具改变回调
  */
  onChangeDrawTools?: (drawType: DrawType) => void,
  /**
  * @description true允许弹出列表选择弹窗,false不允许，默认true
  */
  isPermitModal?: boolean
  /**
  * @description 主题设置
  */
  themeType?: "default" | "technology"
  /**
  * @description 是否显示执机人
  */
  showOperator?: boolean;
}

export interface LocationData {
  id: string;
  text: string;
  scale?: number;
  lng?: string;
  lat?: string;
  locationType?: number;
  children?: LocationData[];
  listType?: LocationListType;
  parent?: LocationData;
}

export type CityData = Pick<LocationData, "id" | "lat" | "lng" | "text"> & { count: number }

export interface markerType extends Marker {
  [key: string]: any;
}

export type DrawType = 'default' | 'circle' | 'rectangle' | 'polygon' | 'clear'


export interface OfflineData extends OfflineTreeItem {
  id: string;
  text: string;
  listType?: LocationListType;
  parent?: OfflineData;
  fileId?: string;
  fileName?: string;
  scale?: number;
  children?: OfflineData[];
}
