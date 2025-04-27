import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Checkbox, Message } from '@yisa/webui'
import { Icon } from "@yisa/webui/es/Icon"
import { BaseMap, TileLayer, Popup, utils, Marker } from '@yisa/yisa-map'
import L, { LeafletEvent } from "leaflet"
import lightCanvasMarkerLayer from '@yisa/LightCanvasMarkersLayer'
import { Draw, MassMarker } from '@/components'
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { LocationListType, LocationData, CityData, markerType, DrawType } from '@/components/LocationMapList/interface'
import ajax from '@/services'
import { CityMassMarkerType } from './interface'
import img1 from '@/assets/images/map/1.png'
import img1h from '@/assets/images/map/1h.png'
import { useDebounceEffect } from 'ahooks'
import './index.scss'

export default function CityMassMarker(props: CityMassMarkerType) {
  const {
    showCityMassMarker = true,
    __map__: map,
    mapZoom,
    showCityMarker = true, //区县
    showMassMarker = false,//海量
    onChangeLocationIds,
    onChangeDrawType,
    getVectorData,
    showChecked = true,
    onlyShowCheckedMarker = false
  } = props

  const { scaleZoom } = window.YISACONF.map
  //已经选择的点位
  //该hooks是让组件受控与非受控的关键
  const [checkedLocationIds, setCheckedLocationIds] = useMergedState([], {
    value: 'locationIds' in props && Array.isArray(props.locationIds) ? props.locationIds : undefined
  })

  //地图展示的全量点位
  const [locationData, setLocationData] = useState<LocationData[]>([])
  //地图展示的区域聚合点位
  const [cityData, setCityData] = useState<CityData[]>([])
  //当前点击的点位
  const [clickData, setClickData] = useState<any>([])
  //框选的数据
  const [vectorData, setVectorData] = useState(null)
  //框选类型
  const [innerDrawType, setInnerDrawType] = useMergedState<DrawType>("default", {
    value: 'drawType' in props && props.drawType ? props.drawType : "default"
  })
  const [massLayers, setMassLayers] = useState<any>(null)
  // console.log(innerDrawType,'innerDrawType')
  const [popupVisible, setPopupVisible] = useState(false)

  // 地图相关
  const _icons = [
    L.icon({
      iconUrl: img1,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    }),
    L.icon({
      iconUrl: img1h,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    })
  ]
  const unCheckedMarkers = useMemo(() => {
    return locationData.map(elem => {
      const { id, lat, lng, text } = elem
      if (!lat || !lng) {
        return false
      }
      let marker: markerType = L.marker([parseFloat(lat), parseFloat(lng)], {
        icon: _icons[0],
        // zIndexOffset: 1000 // canvas 中index无效
      }).bindTooltip(text)
      marker.data = elem
      marker.latlng = [lat, lng]
      return marker
    }).filter(Boolean)
  }, [locationData])

  const checkedMarkers = useMemo(() => {
    // console.time('checkedLocationIds')
    const ids = new Set(checkedLocationIds)
    const _markers = locationData.filter(elem => elem.lng && elem.lat && ids.has(elem.id))
    // console.timeEnd('checkedLocationIds')
    return _markers.map(elem => {
      const { id, lat, lng, text } = elem
      if (!lat || !lng) {
        return false
      }
      let marker: markerType = L.marker([parseFloat(lat), parseFloat(lng)], {
        icon: _icons[1],
        // zIndexOffset: 1000 // canvas 中index无效
      }).bindTooltip(text)
      marker.data = elem
      marker.latlng = [lat, lng]
      return marker
    })
  }, [checkedLocationIds, locationData])

  //区县数据
  const cityMarkers = useMemo(() => {
    return cityData.map((elem, index) => {
      const { id, lat, lng, text, count } = elem
      return {
        id,
        lat,
        lng,
        __map__: map,
        markerOptions: {
          ...elem,
          icon: L.divIcon({
            html: `<div class="city-label"><span>${text}</span><span>${count}</span></div>`,
            iconSize: [60, 60],
            iconAnchor: [30, 30]
          })
        },
        onClick: (e: any) => {
          //点击的时候，让他回恢复默认值
          map?.setView([Number(lat), Number(lng)], scaleZoom)
          onChangeDrawType?.("default")
        }
      }
    })
  }, [cityData])
  //地图交互
  const unCheckedMassMarkerProps = useMemo(() => {
    return {
      data: showCityMassMarker && showMassMarker ? unCheckedMarkers : [],
      __map__: map,
      zIndex: 101,
      onChangeClickData: (event: LeafletEvent, data: any) => {
        setClickData(data)
      }
    }
  }, [unCheckedMarkers, showMassMarker, showCityMassMarker])

  const checkedMassMarkerProps = useMemo(() => {
    return {
      data: showCityMassMarker && showMassMarker ? checkedMarkers : [],
      __map__: map,
      zIndex: 102,
    }
  }, [checkedMarkers, showMassMarker, showCityMassMarker])

  //切换框选工具
  const handleChangeDrawType = (v: DrawType) => {

    setInnerDrawType(v)
    if (v === 'clear') {
      setCheckedLocationIds([])
    }
  }
  //框选完成回调
  const handleChangeVectorData = (type: DrawType, vector: any) => {
    // console.log(type, vector, cityMarkers)
    setVectorData(vector ? {
      type,
      ...vector
    } : null)
    getVectorData && getVectorData(vector ? {
      type,
      ...vector
    } : null)
    //非受控
    if (!("drawType" in props)) {
      setInnerDrawType('default')
    }
    onChangeDrawType && onChangeDrawType?.("default")
  }
  //关闭弹出层
  const handleClosePopup = () => {
    setPopupVisible(false)
  }
  //多点位弹出层精确选择某点位
  const handleChangeLocationItem = (id: string, isChecked: boolean) => {
    let _value = checkedLocationIds
    if (isChecked) {
      _value = checkedLocationIds.filter(elem => elem !== id)
    } else {
      _value = [..._value, id]
    }
    if (!("locationIds" in props)) {
      setCheckedLocationIds(_value)
    }
    onChangeLocationIds && onChangeLocationIds?.(_value)
  }
  //渲染多点位弹出层
  const handleRenderMarkersPopup = () => {
    const { lat = '', lng = '' } = clickData.length > 1 ? clickData[0].data : {}
    return <Popup
      visible={popupVisible}
      lat={lat}
      lng={lng}
      width={300}
      xOffset={0}
      yOffset={10}
      onClose={handleClosePopup}
      __map__={map}
    >
      <div className="location-list">
        {
          clickData.map((elem: any) => {
            const { id, text } = elem.data || {}
            const isChecked = checkedLocationIds.includes(id)
            return <div
              key={id}
              className="location-item"
              onClick={() => handleChangeLocationItem(id, isChecked)}
            >
              {
                showChecked ?
                  <Checkbox checked={isChecked}>{text}</Checkbox>
                  :
                  text
              }
            </div>
          })
        }
      </div>
    </Popup>
  }
  //重新整理数据，拍平，加上，点位类型与父节点
  const handleLocationData = useCallback((data: LocationData[], type: LocationListType, parent?: LocationData) => {
    let _locationData: LocationData[] = []
    data.forEach(elem => {
      const { scale, children } = elem
      if (scale && Array.isArray(children)) {
        _locationData = [..._locationData, ...handleLocationData(children, type, elem)]
      }
      if (!scale) {
        _locationData.push({
          ...elem,
          listType: type,
          parent: parent
        })
      }
    })
    return _locationData
  }, [])
  //获取点位
  const getLocation = async () => {
    const { data } = await ajax.location.getLocationList<{ needType: string, typeId: string }, LocationData[]>({
      needType: "1",
      typeId: "1,2,3,4",
    })
    setLocationData((handleLocationData(Array.isArray(data) ? data : [], 'region')))
  }
  //获取区县数据
  const getCityLabel = async () => {
    try {
      const { data } = await ajax.location.getLocationVisual<{ typeId: string }, CityData[]>({
        // needType: "1",
        typeId: "1,2,3,4",
      })
      setCityData(Array.isArray(data) ? data : [])
    } catch (error) {
      // console.log(error.message)
    }
  }

  useEffect(() => {
    setPopupVisible(false)
    if (clickData.length === 1) {
      const { id } = clickData[0].data || {}
      let _value = checkedLocationIds
      if (checkedLocationIds.includes(id)) {
        _value = checkedLocationIds.filter(elem => elem !== id)
      } else {
        _value = [..._value, id]
      }
      if (!("locationIds" in props)) {
        setCheckedLocationIds(_value)
      }
      onChangeLocationIds && onChangeLocationIds?.(_value)
    } else if (clickData.length > 1) {
      setPopupVisible(true)
    }
  }, [clickData])

  useEffect(() => {
    if (vectorData) {
      if (showCityMarker) {
        Message.warning("未选中点位")
        return
      }
      const ids = locationData.filter(elem => {
        const { lat, lng, id } = elem
        return utils.contains(vectorData, lat, lng) && !checkedLocationIds.includes(id)
      }).map(elem => elem.id)
      if (ids.length) {
        const _value = [...checkedLocationIds, ...ids]
        if (!("locationIds" in props)) {
          setCheckedLocationIds(_value)
        }
        onChangeLocationIds && onChangeLocationIds?.(_value)
      } else {
        Message.warning('未选中点 位')
      }
    }
  }, [vectorData])

  useEffect(() => {
    setPopupVisible(false)
  }, [mapZoom])

  useEffect(() => {
    getCityLabel();
    getLocation();
  }, [])

  // useEffect(() => {
  //   !massLayers && setMassLayers(lightCanvasMarkerLayer?.({})?.addTo(map))
  //   // debugger
  // }, [showMassMarker,showCityMassMarker,massLayers])


  // useEffect(() => {
  //   console.log(markers,massLayers)
  //   massLayers?.addMarkers(markers)
  //   return () => {
  //     massLayers?.clearLayers()
  //   }
  // }, [markers])

  return (
    <div className="city-massmarker">
      {
        showCityMassMarker && showCityMarker && cityMarkers.length > 0 && cityMarkers.map(elem => <Marker key={elem.id} {...elem} />)
      }
      {/* {
        <div className="draw-tools">
          {
            drawTools.map(elem => {
              const { icon, type } = elem
              return <span
                key={type}
                className={innerDrawType === type ? "active" : ""}
                onClick={() => handleChangeDrawType(type)}
              >
                <Icon type={icon} />
              </span>
            })
          }
        </div>
      } */}
      <Draw
        type={innerDrawType}
        saveVectorType="3"
        saveTime={500}
        onChange={handleChangeVectorData}
        __map__={map}
      />
      <MassMarker {...checkedMassMarkerProps} />
      {
        !onlyShowCheckedMarker &&
        <MassMarker {...unCheckedMassMarkerProps} />
      }
      {handleRenderMarkersPopup()}
    </div>
  )
}
