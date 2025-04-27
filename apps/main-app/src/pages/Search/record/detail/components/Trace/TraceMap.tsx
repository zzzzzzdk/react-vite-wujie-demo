import React, { useEffect, useMemo, useState, useRef } from 'react'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { getMapProps, isArray, isFunction } from '@/utils'
import { Track } from '@/components'
import { CloseOutlined, Icon, LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import { Image } from '@yisa/webui'
import { RefTrack } from '@/components/Map/Track/interface'
import classNames from 'classnames'
import { TraceType } from '../../interface'

export default function TraceMap(props: any) {
  const {
    selectedIndex = null,
    trackData = [],
    onSelectedChange,
    onAddFilterate
  } = props

  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps('TraceMap')
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
      trackData.forEach((item: any, index: number) => {
        if (index == 0) start = item.captureTime
        if (index == trackData.length - 1) end = item.captureTime
        item.index = index + 1
      })
      setTrackParams({
        data: trackData,
        startTime: start,
        endTime: end
      })
    }
  }, [trackData])

  const handleSelectedChange = (index: number | null) => {
    console.log(index)
    onSelectedChange?.(index)
  }

  const trackContentCb = (elem: any, index: number, childIndex: number) => {
    const currentData: any = elem.info && isArray(elem.info) ? elem.info[childIndex] : {} as any
    console.log(elem, currentData)
    let infoLength = elem.info?.length || 0
    console.log(elem.trackType, TraceType.capture);

    switch (Number(elem.trackType)) {
      case TraceType.capture:
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
              <span className="card-serial">{(elem.htmlIndex || 0)}</span>
              {/* <span className="card-similar">{currentData.similarity || 0.0}%</span> */}
              <div className="left-img">
                <Image src={currentData.targetImage} />
              </div>
              <div className="right-info">
                <div>最近抓拍：</div>
                <div className="card-info"><Icon type="shijian" />{currentData.captureTime}</div>
                <div className="card-info" title={currentData.locationName}><Icon type="didian" />{currentData.locationName}</div>
                {/* <div className="card-btn">
                <Button type="primary" onClick={(e) => handleAddFilterate(e, currentData)}>加入过滤名单</Button>
              </div> */}
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
        );
      default:
        return (
          <div className="track-popver-content">
            <div className="track-popver-content-title">
              <div className="title-text">{elem.title}</div>
              <span className='close-btn' onClick={() => onSelectedChange?.(null)}><CloseOutlined /></span>
            </div>
            <div className="track-popver-content-info">
              <div className="info">
                <div className="info-label">入住时间：</div>
                <div className="info-text">{currentData.captureTime}</div>
              </div>
              <div className="info">
                <div className="info-label">宾馆名称：</div>
                <div className="info-text">{currentData.name}</div>
              </div>
              <div className="info">
                <div className="info-label">房 间 号 ：</div>
                <div className="info-text">{currentData.num}</div>
              </div>
              <div className="info">
                <div className="info-label">详细地址：</div>
                <div className="info-text">{currentData.locationName}</div>
              </div>
            </div>
          </div>
        );
    }
  }

  const handleAddFilterate = (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    if (onAddFilterate && isFunction(onAddFilterate)) {
      onAddFilterate(item)
    }
  }

  const handleNext = (e: React.MouseEvent, length: number) => {
    console.log('handleNext', length)
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
