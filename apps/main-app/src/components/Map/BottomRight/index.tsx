import React, { useEffect, useMemo } from 'react'
import { BaseMap, TileLayer, Marker, ViewCenter } from '@yisa/yisa-map'
import { isFunction, getMapProps } from '@/utils'
import { CloseOutlined } from '@yisa/webui/es/Icon'
import Area from '../Area'
import BottomRightMapProps from './interface'
import markerIcon from "@/assets/images/map/br-marker.png"
import L from 'leaflet'
import './index.scss'

function BottomRight(props: BottomRightMapProps) {
  const {
    name = '',
    lat,
    lng,
    areaData,
    onClose
  } = props

  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps('bottomRightMap')
  }, [])

  const handleClose = () => {
    if (onClose && isFunction(onClose)) {
      onClose()
    }
  }

  useEffect(() => {
    const targetElement = document.querySelector('.page-top');
    let previousScrollY = targetElement?.scrollTop || 0
    function scrollOffset() {
      // 获取当前滚动的垂直位置
      const currentScrollY = targetElement?.scrollTop || 0;
      const scrollDifference = Math.abs(currentScrollY - previousScrollY);
      console.log(scrollDifference)
      // 更新之前的滚动位置
      previousScrollY = currentScrollY;
      if (scrollDifference > 50) {
        handleClose()
      } else {
      }
    }

    // 添加滚动事件监听器
    targetElement?.addEventListener('scroll', scrollOffset);

    return () => {
      targetElement?.removeEventListener('scroll', scrollOffset)
    }
  }, [])

  return (
    <div className="map-bottom-right">
      <div className="map-bottom-right-header">
        <div className="map-bottom-right-title" title={name}>{name || '未知'}</div>
        <div className="map-bottom-right-close" onClick={handleClose}><CloseOutlined /></div>
      </div>
      <div className="map-bottom-right-body">
        <BaseMap {...mapProps}>
          <TileLayer {...tileLayerProps} />
          {
            lat && lng &&
            <Marker
              lat={lat}
              lng={lng}
              tooltipText={name || ''}
              markerOptions={{
                icon: L.icon({
                  iconUrl: markerIcon,
                  iconSize: [45, 50],
                  iconAnchor: [22, 50],
                  tooltipAnchor: [10, -22]
                })
              }}
            />
          }
          <ViewCenter latLngs={[[lat, lng]]} zoom={16} />
          <Area data={areaData} />
          {
            !lng || !lat ?
              <div className='error-message'>经纬度缺失！</div>
              : ''
          }
        </BaseMap>
      </div>
    </div>
  )
}

export default BottomRight
