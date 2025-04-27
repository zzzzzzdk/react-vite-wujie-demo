import { geoJSONColor } from './index'
import { TooltipOptions, Map, GeoJSON } from 'leaflet';
import { GeoJsonObject } from 'geojson'

export default interface MapAreaProps {
  __map__?: Map;
  data?: GeoJsonObject[];
  fitBounds?: boolean;
  areaType?: keyof typeof geoJSONColor;
  errorMessage?: string;
  tooltipText?: string;
  stroke?: boolean;
  tooltipOptions?: TooltipOptions;
}