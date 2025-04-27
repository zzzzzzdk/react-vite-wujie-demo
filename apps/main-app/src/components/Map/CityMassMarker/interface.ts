import { DrawType } from "@/components/LocationMapList/interface";
import { Map } from "leaflet"
export interface CityMassMarkerType {
  __map__?: Map
  mapZoom?: number
  /**
   * @description 是否展示组件
   * @default true
   */
  showCityMassMarker?: boolean
  /**
   * @description 是否展示框选工具
   * @default true
   */
  // showDrawTools?:boolean
  /**
  * @description 框选类型
  */
  locationIds?: string[]
  /**
* @description 框选类型
*/
  onChangeLocationIds?: (data: string[]) => void
  /**
   * @description 框选类型
   */
  drawType?: DrawType
  /**
   * @description 框选类型
   */
  onChangeDrawType?: (drawType: DrawType) => void
  /**
 * @description 获取所画的图形
 */
  getVectorData?: (drawType: any) => void
  /**
   * @description 是否展示区县数据
   */
  showCityMarker?: boolean
  /**
  * @description 是否展示海量点
  */
  showMassMarker?: boolean
  /**
   * @description 是否显示多选框
   * @default true
   */
  showChecked?: boolean;
  /**
   * @description 是否只显示选中的点位
   * @default false
   */
  onlyShowCheckedMarker?: boolean;
}
