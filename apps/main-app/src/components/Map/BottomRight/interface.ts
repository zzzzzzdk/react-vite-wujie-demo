import React from "react";
import { GeoJsonObject } from 'geojson'

export default interface BottomRightMapProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * @description 点位名称
   * @default ''
   */
  name?: string;
  /**
   * @description 经度
   */
  lat?: string | null;
  /**
   * @description 维度
   */
  lng?: string | null;
  /**
   * @description 关闭回调
   */
  onClose?: () => void;
  areaData?: GeoJsonObject[];
}