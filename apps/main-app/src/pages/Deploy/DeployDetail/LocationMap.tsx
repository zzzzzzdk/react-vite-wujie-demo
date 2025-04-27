import React, { useState, useCallback, useEffect, useMemo } from "react";
import { getMapProps } from "@/utils";
import {
  BaseMap,
  TileLayer,
} from "@yisa/yisa-map";


import { CityMassMarker } from "@/components";
import "./index.scss";

type LocationMapProps = {
  locationIds?: string[];
};
function LocationMap(props: LocationMapProps) {
  const { locationIds } = props;
  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps("locationMap");
  }, []);
  return (
    <BaseMap {...mapProps}>
      <TileLayer {...tileLayerProps} />
      <CityMassMarker
        showCityMarker={false}
        showMassMarker
        locationIds={locationIds || []}
        showChecked={false}
        onlyShowCheckedMarker={true}
      />
    </BaseMap>
  );
}

export default LocationMap;
