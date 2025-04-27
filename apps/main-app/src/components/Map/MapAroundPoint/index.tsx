import React, { useEffect, useMemo, useState, useRef } from "react";
import MapAroundPointProps from "./interface";
import { BaseMap, TileLayer, Marker, ViewCenter, MassMarker, Popup, Draw, utils } from '@yisa/yisa-map'
import { Tabs, Message, Form, Input, Button, Modal, Checkbox, Tooltip,  } from '@yisa/webui'
import { ExclamationCircleOutlined } from '@yisa/webui/es/Icon'
import { isFunction, getMapProps } from '@/utils'
import { LocationItemType } from "@/config/CommonType";
import { Icon, CopyOutlined } from '@yisa/webui/es/Icon'
import markerIcon from "@/assets/images/map/br-marker.png"
import markerIconH from "@/assets/images/map/br-marker-h.png"
import markerHIcon from "@/assets/images/map/br-markerh.png"
import markerHIconH from "@/assets/images/map/br-markerh-h.png"
import L, { LeafletMouseEvent } from 'leaflet'
import ajax from '@/services'
import './index.scss'
import { DoubleMarker, CopyToClipboard } from "@/components";
import { DrawType } from "@/components/LocationMapList/interface";
import dictionary from "@/config/character.config"
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { LeafletEvent } from "leaflet";
import { RootState, useSelector } from "@/store";
import dayjs from 'dayjs'
import { logReport } from "@/utils/log";
import { useDebounceEffect } from 'ahooks';

export const rangeOptions = [
  { name: '500米', key: '500', defaultZoom: 16 },
  { name: '1公里', key: '1000', defaultZoom: 15 },
  { name: '3公里', key: '3000', defaultZoom: 13 },
]

const MapAroundPoint = (props: MapAroundPointProps) => {
  const {
    lng,
    lat,
    locationId,
    id = "mapAroundPoint",
    footholdarr,
    showCheckTarget = false,
    showDrawTools = false,
    onChangecheckedLocationIds,
    onCheckTargetClick,
    viewCenterZoom = 13,
    onViewCenterZoomChange,
    data,
    showCheckBox = false,
    onRangeOptionChange
  } = props

  // const defualtViewCenterZoom = 13
  const checkIdsInProps = 'checkedLocationIds' in props
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig.target || {}
  });

  const [activeRange, setActiveRange] = useMergedState<string>(rangeOptions[0].key, {
    value: "rangeOption" in props ? props.rangeOption : undefined
  })

  // 点位
  const [markerData, setMarkerData] = useState<LocationItemType[]>([])
  const markerImg = useRef({})
  const [popupVisible, setPopupVisible] = useState(false)
  const [clickData, setClickData] = useState<{
    lng: string;
    lat: string;
    data: LocationItemType[]
  }>({
    lng: '',
    lat: '',
    data: []
  })
  const [latLngs, setLatLngs] = useState<Array<string[]>>([])
  const [drawType, setDrawType] = useState<DrawType>('default')
  const [vectorData, setVectorData] = useState(null)
  const [checkedLocationIds, setCheckedLocationIds] = useMergedState<string[]>([], {
    value: checkIdsInProps ? props.checkedLocationIds : undefined
  })
  const [formData, setFormData] = useState({
    // locationIds: [],
    expandTime: pageConfig?.expandTime?.default || 0
  })

  const { mapProps, tileLayerProps } = useMemo(() => {
    const { mapProps, tileLayerProps } = getMapProps(id);
    return {
      mapProps: {
        ...mapProps,
        // onZoomEnd: (e: LeafletEvent) => {
        //   onViewCenterZoomChange?.(e.target.getZoom())
        // },
      },
      tileLayerProps,
    };
    // return getMapProps(id)
  }, [id])

  const handleChangeVectorData = (type: DrawType, vector: any) => {
    console.log(type, vector)
    setVectorData(vector ? {
      type,
      ...vector
    } : null)
    setDrawType('default')
  }
  //切换框选工具
  const handleChangeDrawType = (v: DrawType) => {
    if (v === 'clear') {
      if (!checkIdsInProps) setCheckedLocationIds([])
      if (onChangecheckedLocationIds) onChangecheckedLocationIds?.([])
    }
    setDrawType(v)
  }
  //跳转
  const handleJumpTarget = () => {

    if (!checkedLocationIds.length) {
      Message.warning("请选择点位")
      return
    }
    const paramsData = {
      locationIds: checkedLocationIds,
      timeType: 'time',
      beginDate: dayjs(data?.captureTime || "").subtract(formData.expandTime, "minute").format('YYYY-MM-DD HH:mm:ss'),
      endDate: dayjs(data?.captureTime || "").add(formData.expandTime, "minute").format('YYYY-MM-DD HH:mm:ss'),
      targetType: data?.targetType || "face"
    }
    const desc = `【图片1-大图弹窗-属性检索:点位(${checkedLocationIds.length});拓展时长:${formData.expandTime}分钟】`
    logReport({
      type: 'none',
      data: {
        desc,
        data: undefined
      }
    })
    window.open(`#/target?mapAround=${encodeURIComponent(JSON.stringify(paramsData))}`)
  }

  const handleRangeChange = (value: string) => {
    setActiveRange(value)
    setMarkerData([])
    setLatLngs([])
    getLocation(value)
    onViewCenterZoomChange?.(rangeOptions.find(item => item.key === value)?.defaultZoom || 13)
    if (!("rangeOption" in props)) {
      setActiveRange(value)
    } else {
      onRangeOptionChange?.(value)
    }
  }

  const getLocation = (type: string) => {
    if (!checkIdsInProps) setCheckedLocationIds([])
    if (onChangecheckedLocationIds) onChangecheckedLocationIds?.([])
    ajax.location.getRangeLocationList<any, LocationItemType[]>({
      longitude: lng || '',
      latitude: lat || '',
      distance: type,
      typeId: '1,2,3,4',
      suAdmin: true, // 是否忽略权限，获取所有点位
    }).then(res => {
      const { data = [] } = res
      // console.log(data)
      setMarkerData(data)
    })
  }

  useDebounceEffect(() => {
    setMarkerData([])
    setLatLngs([])
    if (lng && lat) {
      // getLocation(activeRange)
      handleRangeChange(rangeOptions[0].key)
    }
  }, [lng, lat], {
    wait: 500,
  },)

  const markers = useMemo(() => {
    let newLatLngs: Array<string[]> = []
    function renderCustomIcon(id: string) {
      let iconUrl;
      if (checkedLocationIds.includes(id) && locationId === id) {
        iconUrl = markerHIconH
      } else if (checkedLocationIds.includes(id)) {
        iconUrl = markerIconH
      } else if (locationId === id) {
        iconUrl = markerHIcon
      } else {
        iconUrl = markerIcon
      }
      let icon = L.icon({
        // iconUrl: locationId === id ? markerHIcon : markerIcon,
        iconUrl,
        iconSize: [45, 50],
        iconAnchor: [22, 50],
        tooltipAnchor: [10, -22],
        // render: (marker, pointPos, context) => {
        //   const options = marker.options.icon.options;
        //   const { x, y } = pointPos;
        //   const { iconUrl, iconAnchor, iconSize, text } = options;
        //   const currentImgItem = markerImg.current[iconUrl]
        //   const { loaded, imgObj } = currentImgItem || {}

        //   if (loaded) {
        //     _drawImg(imgObj)
        //   } else {
        //     // 创建点位图片
        //     let img = new Image();
        //     img.onload = function () {
        //       markerImg.current[iconUrl] = {
        //         loaded: true,
        //         imgObj: img
        //       }
        //       _drawImg(img)
        //     }
        //     img.src = iconUrl
        //   }

        //   function _drawImg(img) {
        //     context.drawImage(img, x - iconAnchor[0], y - iconAnchor[1], iconSize[0], iconSize[1])
        //     // 标记序号文字
        //     context.fillStyle = '#fff'
        //     context.font = '10px normal'
        //     context.textAlign = 'center'
        //     context.textBaseline = 'middle'
        //     context.fillText(text, x, y - iconAnchor[1] + iconAnchor[0] + 2, iconAnchor[0] * 2)
        //   }
        // }
        // text: `${index + 1}`,
      })
      return icon
    }
    const customMarkers = markerData.map((elem, index) => {
      let marker = L.marker([Number(elem.lat), Number(elem.lng)], {
        icon: renderCustomIcon(elem.id)
      }).bindTooltip(elem.text)
      marker['data'] = elem
      newLatLngs.push([elem.lat, elem.lng])
      return marker
    })
    if (footholdarr && lat && lng) {
      setLatLngs(footholdarr.data?.map(elem => [elem.lat, elem.lng]))
    } else
      setLatLngs(newLatLngs)
    return customMarkers
  }, [JSON.stringify(markerData), checkedLocationIds])

  const massMarkerOptions = {
    data: markers,
    onChangeHoverData: (e: LeafletMouseEvent, data: any[]) => {
      // console.log(data)
    },
    onChangeClickData: (e: LeafletMouseEvent, data: any[]) => {
      // console.log(data)
      if (data.length) {
        const item = data[0]
        const latLng = item.getLatLng()
        setClickData({
          lat: latLng.lat,
          lng: latLng.lng,
          data: data.map(elem => elem.data)
        })
        setPopupVisible(true)
      } else {
        setPopupVisible(false)
        setClickData({
          lat: '',
          lng: '',
          data: []
        })
      }
    },
  }

  const handleChangeLocationItem = (id: string, isChecked: boolean) => {
    let _value = checkedLocationIds
    if (isChecked) {
      _value = checkedLocationIds.filter(elem => elem != id)
    } else {
      console.log(isChecked)
      _value = [..._value, id]
    }
    if (!checkIdsInProps) {
      setCheckedLocationIds(_value)
    }
    if (onChangecheckedLocationIds && isFunction(onChangecheckedLocationIds)) {
      onChangecheckedLocationIds(_value)
    }
  }
  useEffect(() => {
    if (vectorData) {
      const ids = markerData.filter(elem => {
        const { lat, lng, id } = elem
        return utils.contains(vectorData, lat, lng) && !checkedLocationIds.includes(id)
      }).map(elem => elem.id)
      if (ids.length) {
        const _value = [...checkedLocationIds, ...ids]
        if (!(checkIdsInProps)) {
          setCheckedLocationIds(_value)
        }
        if (onChangecheckedLocationIds) {
          onChangecheckedLocationIds?.(_value)
        }
      } else {
        Message.warning('未选中点位')
      }
    }
  }, [vectorData])

  return (
    <div className="map-around-point">
      {
        lng && lat ?
          <>
            <div className="map-around-point-range">
              <div className="label">周围点位范围：</div>
              <Tabs type='line' activeKey={activeRange} onChange={handleRangeChange} data={rangeOptions} />
            </div>
            {showCheckTarget && <div className="check-target" onClick={() => { onCheckTargetClick?.() }}>查找附近目标<Icon type="fangdajing" /></div>}
            {showDrawTools && <div className="tools-wrapper">
              <div className="title">查找附近目标</div>
              <Form layout="vertical">
                <Form.Item
                  label="框选范围"
                  className="tools-item"
                  colon={false}
                >
                  <div className="draw-tools">
                    {
                      dictionary.drawTools.map(elem => {
                        const { icon, type } = elem
                        return <span
                          key={type}
                          className={drawType === type ? "active" : ""}
                          onClick={() => handleChangeDrawType(type)}
                        >
                          <Icon
                            type={icon}
                          />
                        </span>
                      })
                    }
                  </div>
                </Form.Item>
                <Form.Item
                  label={<>
                    <span>拓展时长</span>
                    <Tooltip
                      light
                      title={
                        <div style={{ lineHeight: "24px" }}>
                          <p>
                            拓展时长为基于当前目标抓拍时间（大图抓拍时间）向前、向后设置的搜索时长。
                          </p>
                          <p>
                            若抓拍时间为2024-01-01 9:00:00，设置拓展时长为30分钟，
                          </p>
                          <p>
                            则此次设置的搜索时长为：2024-01-01 08:30:00~2024-01-01 09:30:00。
                          </p>
                        </div>
                      }
                      placement="right"
                      overlayInnerStyle={{
                        width: 530
                      }}
                    >
                      <span style={{ marginLeft: 5, cursor: "pointer" }}><ExclamationCircleOutlined /></span>
                    </Tooltip>
                  </>}
                  className="tools-item"
                  colon={false}
                >
                  <div>
                    <Input.InputNumber
                      style={{ width: 64, margin: '0 10px 0 0' }}
                      value={formData.expandTime}
                      onChange={(value) => { setFormData({ ...formData, expandTime: value || 0 }) }}
                    />{ }
                    <span>分钟</span>
                  </div>
                </Form.Item>
                <Form.Item
                  className="tools-item btn"
                  colon={false}
                >
                  <Button type="primary" onClick={handleJumpTarget}>属性检索</Button>
                </Form.Item>
              </Form>
            </div>}
          </>
          : ''
      }
      <div className="map-around-point-content">
        <BaseMap {...mapProps}>
          <TileLayer {...tileLayerProps} />
          <MassMarker {...massMarkerOptions} />
          <Draw
            type={drawType}
            saveVectorType="3"
            saveTime={500}
            onChange={handleChangeVectorData}
            vectorStyle={{
              color: '#ff8d1a',
              fillColor: 'rgba(255,141,26,0.13)',
              fillOpacity: 0.7
            }}
          />
          <Popup
            visible={popupVisible}
            lat={clickData.lat}
            lng={clickData.lng}
            xOffset={0}
            yOffset={28}
            onClose={() => setPopupVisible(false)}
            className="map-around-point-popup"
          >
            {
              clickData.data.map((elem, index) => {
                // console.log(checkedLocationIds)
                const isChecked = checkedLocationIds.includes(elem.id)
                return !showCheckBox ? <div key={index} className="location-item">
                  <Icon type="didian" />
                  <div className="location-name">{elem.text}</div>
                  <CopyToClipboard
                    text={elem.text}
                  />
                </div>
                  :
                  <div
                    key={index}
                    className="location-item"
                    onMouseDown={() => handleChangeLocationItem(elem.id, isChecked)}
                  >
                    <Checkbox checked={isChecked}>{elem.text}</Checkbox>
                  </div>
              })
            }
          </Popup>
          {
            footholdarr && lat && lng ?
              <DoubleMarker footholdarr={footholdarr} lat={lat} lng={lng}></DoubleMarker>
              : ''
          }
          {/* {
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
        */}
          <ViewCenter latLngs={latLngs} zoom={viewCenterZoom} fitBounds={true} />
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

export default MapAroundPoint
