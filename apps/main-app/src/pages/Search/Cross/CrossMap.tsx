import React, { useEffect, useMemo, useState, useRef } from 'react'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { getMapProps, isArray, isFunction } from '@/utils'
import { LeafletEvent } from "leaflet"
import { CityMassMarker, Track } from '@/components'
import { CrossMapProps, DataItemType } from './interface'
import { useDeepCompareEffect } from 'ahooks'
import { CloseOutlined, Icon, LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import { Image, Button } from '@yisa/webui'
import { ResultRowType as TargetResultItemType } from "../Target/interface";
import { RefTrack } from '@/components/Map/Track/interface'
import classNames from 'classnames'

export default function CrossMap(props: CrossMapProps) {
  const {
    selectedIndex = null,
    trackData = [],
    onSelectedChange,
    onAddFilterate,
    onOpenBigImg
  } = props

  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps('CrossMap')
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
      // 在数组中寻找最大和最小时间，得依靠数组索引数据，父组件时间排序，子组件也得排
      let start = '', end = ''
      // 地图显示的轨迹数据顺序应该与父组件列表显示的顺序相反
      // const newTrackData = trackData.reverse()
      // console.log('newTrackData', newTrackData)
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
  }, [trackData])

  const handleSelectedChange = (index: number | null) => {
    // console.log(index)
    onSelectedChange?.(index)
  }

  const trackContentCb = (elem: DataItemType, index: number, childIndex: number) => {
    const currentData: TargetResultItemType = elem.infos && isArray(elem.infos) ? elem.infos[childIndex] : {} as TargetResultItemType
    // console.log(currentData)
    let infoLength = elem.infos?.length || 0

    return (
      <div className="track-popver-content">
        <div className="track-popver-content-header">
          <div className="header-text">抓拍信息（{infoLength}）</div>
          <span className='close-btn' onClick={() => {
            onSelectedChange?.(null)
            trackRef.current?.closePopup()
          }}><CloseOutlined /></span>
        </div>
        <div className="track-popver-content-card">
          <span className="card-serial">{(elem.index || 0) + 1}</span>
          <span className="card-similar">{currentData.similarity || 0.0}%</span>
          <div className="left-img" onClick={(e) => onOpenBigImg?.(e, currentData, childIndex, index, elem.infos)}>
            <Image src={currentData.targetImage} />
          </div>
          <div className="right-info">
            <div>最近抓拍：</div>
            <div className="card-info"><Icon type="shijian" />{currentData.captureTime || '--'}</div>
            <div className="card-info" title={currentData.locationName}><Icon type="didian" />{currentData.locationName || '--'}</div>
            <div className="card-btn">
              <Button type="primary" onClick={(e) => handleAddFilterate(e, currentData)}>加入过滤名单</Button>
            </div>
          </div>

          <span
            onClick={(e) => { handlePrev(e) }}
            className={classNames("btn-change btn-prev", {
              disabled: childIndex === 0
            })}
          >
            <LeftOutlined />
          </span>
          <span
            onClick={(e) => { handleNext(e, infoLength) }}
            className={classNames("btn-change btn-next", {
              disabled: childIndex === infoLength - 1
            })}
          >
            <RightOutlined />
          </span>
        </div>
      </div>
    )
  }

  const handleAddFilterate = (e: React.MouseEvent, item: TargetResultItemType) => {
    e.stopPropagation()
    if (onAddFilterate && isFunction(onAddFilterate)) {
      onAddFilterate(item)
    }
  }

  const handleNext = (e: React.MouseEvent, length: number) => {
    // console.log('handleNext', length)
    e.stopPropagation()
    trackRef.current?.nextAlarm(length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    trackRef.current?.prevAlarm()
  }

  return (
    <BaseMap {...mapProps}>
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
}
