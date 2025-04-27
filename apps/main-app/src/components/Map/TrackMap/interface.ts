import { RefTrack } from "../Track/interface";

export interface TrackMapProps {
  selectedIndex?: number | null;
  onSelectedChange?: (index: number | null) => void;
  trackData?: any[];
  /**
   * @description popover内容回调
   */
  trackContentCb?: (data: any, index: number, childIndex: number) => void;
}

export interface RefTrackMap {
  trackRef: RefTrack | null
}