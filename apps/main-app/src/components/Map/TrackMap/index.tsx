import React, { useEffect, useMemo, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { getMapProps, isArray, isFunction } from '@/utils'
import { LeafletEvent } from "leaflet"
import { CityMassMarker, Track } from '@/components'
import { TrackMapProps, RefTrackMap } from './interface'
import { useDeepCompareEffect } from 'ahooks'
import { CloseOutlined, Icon, LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import { Image, Button } from '@yisa/webui'
import { RefTrack } from '@/components/Map/Track/interface'
import classNames from 'classnames'
import './index.scss'

export default forwardRef(function TrackMap(props: TrackMapProps, ref: React.ForwardedRef<RefTrackMap>) {
  const {
    selectedIndex = null,
    trackData = [],
    onSelectedChange,
    trackContentCb,
  } = props

  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps('TrackMap')
  }, [])

  const [trackParams, setTrackParams] = useState({
    data: trackData,
    startTime: '',
    endTime: ''
  })
  const trackRef = useRef<RefTrack>(null)

  useEffect(() => {
    // console.log('trackData', trackData)
    if (trackData && isArray(trackData)) {
      let start = '', end = ''
      trackData.forEach((item, index) => {
        if (index === 0) {
          start = item.minCaptureTime
        }
        if (index === trackData.length - 1) {
          end = item.maxCaptureTime
        }
        item['captureTime'] = item.minCaptureTime
      })
      setTrackParams({
        data: trackData,
        startTime: start,
        endTime: end
      })
    }
  }, [JSON.stringify(trackData)])

  const handleSelectedChange = (index: number | null) => {
    // console.log(index)
    onSelectedChange?.(index)
  }

  useImperativeHandle(ref, () => ({
    trackRef: trackRef.current
  }))

  return (
    <BaseMap {...mapProps} className="track-map">
      <TileLayer {...tileLayerProps} />
      <Track
        ref={trackRef}
        {...trackParams}
        contentCb={trackContentCb}
        clickIndex={selectedIndex}
        markerClickCb={handleSelectedChange}
      />
    </BaseMap>
  )
})
