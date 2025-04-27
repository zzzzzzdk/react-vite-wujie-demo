import { WarningItem } from "./interface";
import React from "react";

const MapContext = React.createContext<{
  showLngLat: (lnglat: Record<"lng" | "lat" | "name", string>) => void;
}>({
  showLngLat: () => {},
});

export default MapContext;
