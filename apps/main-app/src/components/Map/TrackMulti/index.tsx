import React, { useEffect, useMemo, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { BaseMap, TileLayer, Polyline, Marker } from '@yisa/yisa-map'
import { getMapProps, isArray, isFunction } from '@/utils'
import { LeafletEvent } from "leaflet"
import { CityMassMarker } from '@/components'
import { useDeepCompareEffect } from 'ahooks'
import { CloseOutlined, Icon, LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import { Image, Button } from '@yisa/webui'
import classNames from 'classnames'
import TrackMulti from './TrackMulti'
import { TrackMultiMapProps, RefTrackMultiMap, RefTrackMulti } from './interface'
import L from 'leaflet'
import './index.scss'

// 多条轨迹
const TrackMultiMap = (props: TrackMultiMapProps, ref: React.ForwardedRef<RefTrackMultiMap>) => {
  const {
    selectedIndexArr = [null, null],
    trackData = [],
    onSelectedChange,
    trackContentCb,
    predictPath,
    adapt,
    showTracking
  } = props

  const trackRef = useRef<RefTrackMulti>(null)

  const [trackParams, setTrackParams] = useState({
    data: trackData,
    startTime: '',
    endTime: ''
  })
  // const trackRef = useRef<RefTrack>(null)

  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps('TrackMultiMap')
  }, [])

  const handleSelectedChange = (indexArr: (number | null)[]) => {
    // console.log(index)
    onSelectedChange?.(indexArr)
  }

  useEffect(() => {
    // console.log('trackData', trackData)
    if (trackData && isArray(trackData)) {
      setTrackParams({
        data: trackData,
        startTime: '',
        endTime: ''
      })
    }
  }, [JSON.stringify(trackData)])

  const polylineArr = useMemo(() => {
    if (predictPath && predictPath.length) {
      const polylines = predictPath.map(item => {
        const startLngLat = item.startLngLat ? item.startLngLat : { lng: 0, lat: 0 }
        const latLngs = [[startLngLat.lat, startLngLat.lng], [item.lngLat.lat, item.lngLat.lng]]
        return ({
          latLngs: latLngs,
          polylineOptions: {
            color: item.trackColor,
            dashArray: '10'
          },
          markerOptions: {
            id: item.locationId,
            tooltipText: item.locationName,
            lat: item.lngLat.lat,
            lng: item.lngLat.lng,
            markerOptions: {
              id: item.locationId,
              icon: L.divIcon({
                html: `<div class="marker-usually" style="border-color: ${item.trackColor}; color: ${item.trackColor}">${item.text}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })
            },
            // onClick: (e) => {
            //   const { id } = e.target.options
            //   // message.success(id)
            // }
          }
        })
      })
      return polylines
    }
    return []
  }, [predictPath])

  useImperativeHandle(ref, () => ({
    trackRef: trackRef.current
  }))

  return (
    <BaseMap {...mapProps} className="track-map">
      <TileLayer {...tileLayerProps} />
      <TrackMulti
        ref={trackRef}
        {...trackParams}
        contentCb={trackContentCb}
        clickIndexArr={selectedIndexArr}
        markerClickCb={handleSelectedChange}
        adapt={adapt}
        showTracking={showTracking}
      />
      {
        predictPath && predictPath.length ?
          polylineArr.map((options, index) => (<Polyline key={index} {...options} />))
          : ''
      }
      {
        predictPath && predictPath.length ?
          polylineArr.map((options, index) => (<Marker key={index} {...options.markerOptions} />))
          : ''
      }
    </BaseMap>
  )
}

export default forwardRef(TrackMultiMap)