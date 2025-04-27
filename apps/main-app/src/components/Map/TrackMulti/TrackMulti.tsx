/// <reference path="./js/leafletTrackplayback/trackplayback.d.ts" />
import { useState, useEffect, useRef, useImperativeHandle, forwardRef, useMemo } from 'react'
import L from 'leaflet'
import './js/control.playback.css'
import './js/control.playback.js'
import './js/leafletTrackplayback'

// import { TrackPlayBack } from './js/leafletTrackplayback/trackplayback.js'
// import data from './js/test.json'
import { TrackMultiProps, GDataType, LngLatItemType } from './interface'
import carImg from './images/car.png'
import { Message } from '@yisa/webui'
import { isArray } from '@/utils'
import { TrackDataItem, RefTrackMulti } from './interface'
import { CustomPopupBox } from '@/components'
import { Slider, Popover, Switch, Select } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import characterConfig from '@/config/character.config'
import dayjs from 'dayjs'

const TrackMulti = (props: TrackMultiProps, ref: React.ForwardedRef<RefTrackMulti>) => {
  // const data: TrackDataItem[][] = [
  //   [
  //     {
  //       index: 1,
  //       minCaptureTime: '2023-10-01 14:10:00',
  //       maxCaptureTime: '2023-11-01 14:10:00',
  //       locationId: '370211400047',
  //       locationName: '7楼澳柯玛摄像头04',
  //       lngLat: {
  //         lng: '134.87333333333333',
  //         lat: '34.57700166666667'
  //       },
  //       path: [
  //         {
  //           "lng": '134.87333333333333',
  //           "lat": '34.57700166666667',
  //           "time": 1502168424,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.26777833333333,
  //           "lat": 34.644596666666665,
  //           "time": 1502174991,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.24607333333333,
  //           "lat": 34.653655,
  //           "time": 1502175917,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.26325166666666,
  //           "lat": 34.64709166666667,
  //           "time": 1502191767,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.32421,
  //           "lat": 34.61122666666667,
  //           "time": 1502192674,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.36138333333332,
  //           "lat": 34.612215,
  //           "time": 1502193897,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.36040833333334,
  //           "lat": 34.61272666666667,
  //           "time": 1502200158,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.36009333333334,
  //           "lat": 34.61233,
  //           "time": 1502201598,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.35963833333332,
  //           "lat": 34.611505,
  //           "time": 1502206458,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.35962833333335,
  //           "lat": 34.61150166666667,
  //           "time": 1502206817,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.35994666666667,
  //           "lat": 34.611285,
  //           "time": 1502215818,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.359795,
  //           "lat": 34.61171,
  //           "time": 1502221397,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.35987166666666,
  //           "lat": 34.61168166666667,
  //           "time": 1502223558,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.35986333333332,
  //           "lat": 34.6119,
  //           "time": 1502229318,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.36015166666667,
  //           "lat": 34.61261,
  //           "time": 1502241737,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.36007666666666,
  //           "lat": 34.61262166666667,
  //           "time": 1502244258,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.363895,
  //           "lat": 34.61022,
  //           "time": 1502252629,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.376335,
  //           "lat": 34.62924666666667,
  //           "time": 1502253556,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.39856166666667,
  //           "lat": 34.645781666666664,
  //           "time": 1502254746,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.399135,
  //           "lat": 34.64816166666667,
  //           "time": 1502277661,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.39914333333334,
  //           "lat": 34.64814666666667,
  //           "time": 1502282081,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.40157833333333,
  //           "lat": 34.647551666666665,
  //           "time": 1502283001,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.35547333333332,
  //           "lat": 34.619258333333335,
  //           "time": 1502283905,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.27196833333332,
  //           "lat": 34.613548333333334,
  //           "time": 1502284920,
  //           "info": []
  //         },
  //         {
  //           "lng": 135.20049666666668,
  //           "lat": 34.60802666666667,
  //           "time": 1502285802,
  //           "info": []
  //         },
  //         {
  //           "lng": 134.985115,
  //           "lat": 34.624703333333336,
  //           "time": 1502288102,
  //           "info": []
  //         },
  //         {
  //           "lng": 132.95545666666666,
  //           "lat": 34.156863333333334,
  //           "time": 1502312672,
  //           "info": []
  //         },
  //         {
  //           "lng": 131.16894166666665,
  //           "lat": 33.87929,
  //           "time": 1502336462,
  //           "info": []
  //         }
  //       ]
  //     },
  //     {
  //       index: 2,
  //       minCaptureTime: '2023-10-01 14:10:00',
  //       maxCaptureTime: '2023-11-01 14:10:00',
  //       locationId: '370211400047',
  //       locationName: '7楼澳柯玛摄像头04',
  //       lngLat: {
  //         lng: '131.16894166666665',
  //         lat: '33.87929'
  //       },
  //       path: []
  //     }
  //   ],
  //   [
  //     {
  //       index: 1,
  //       minCaptureTime: '2023-09-01 14:10:00',
  //       maxCaptureTime: '2023-10-01 14:10:00',
  //       locationId: '370211400047',
  //       locationName: '7楼澳柯玛摄像头03',
  //       lngLat: {
  //         lng: '120.167748',
  //         lat: '35.943059'
  //       },
  //       path: [
  //         {
  //           "lng": '120.167748',
  //           "lat": '35.943059',
  //           "time": 1502259071,
  //           "info": []
  //         },
  //         {
  //           "lng": 132.61833333333334,
  //           "lat": 34.06666666666667,
  //           "time": 1502270475,
  //           "info": []
  //         },
  //         {
  //           "lng": 133.33666666666667,
  //           "lat": 34.005,
  //           "time": 1502285652,
  //           "info": []
  //         },
  //         {
  //           "lng": 133.33666666666667,
  //           "lat": 33.98,
  //           "time": 1502324567,
  //           "info": []
  //         },
  //         {
  //           "lng": 133.56835,
  //           "lat": 34.3177,
  //           "time": 1502354127,
  //           "info": []
  //         },
  //         {
  //           "lng": 133.67166666666665,
  //           "lat": 34.50666666666667,
  //           "time": 1502359749,
  //           "info": []
  //         },
  //         {
  //           "lng": 133.85586666666666,
  //           "lat": 34.41088333333333,
  //           "time": 1502373168,
  //           "info": []
  //         },
  //         {
  //           "lng": 133.33666666666667,
  //           "lat": 33.98,
  //           "time": 1502424666,
  //           "info": []
  //         }
  //       ]
  //     },
  //     {
  //       index: 2,
  //       minCaptureTime: '2023-09-01 14:10:00',
  //       maxCaptureTime: '2023-10-01 14:10:00',
  //       locationId: '370211400047',
  //       locationName: '7楼澳柯玛摄像头03',
  //       lngLat: {
  //         lng: '133.33666666666667',
  //         lat: '33.98'
  //       },
  //       path: []
  //     }
  //   ]
  // ]
  const map = props['__map__'] as L.Map
  const {
    data = [],
    baseColor = '#3377ff',
    passColor = '#28b7d9',
    clickIndexArr = [null, null],
    markerClickCb,
    contentCb,
    dtype = '1',
    adapt = true,
    showTracking = false
  } = props

  const gData = useRef<GDataType>({
    _data: [], //  data 过滤后有经纬度点位
    trackData: [], // 当前轨迹的数据
    roadPath: [], // 经纬度处理后的轨迹数据
    showImage: true,
    curIndex: 0,  // 当前是第几个点
    infoWindow: null,
    markers: [],  // 点位marker
    trackingMarker: [],
    // orderMarkers: [],   // 序号marker
    baseLine: [],  // 基础路径(多条)
    timer: null,
  })

  const newLatlngs = useRef<L.LatLngTuple[]>([])

  const [hasPath, setHasPath] = useState(true)
  const [type, setType] = useState(dtype)

  // 自定义popup弹框相关变量
  const [popupData, setPopupData] = useState({ lat: "", lng: "" })
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null)

  // marker选中（单个）
  const selectedMarker = useRef<L.Marker | null>(null)

  const popupIndexRef = useRef(0)

  // 轨迹播放控制
  const trackplaybackRef = useRef<Trackplayback>()
  const [speed, setSpeed] = useState(20)
  const [disable, setDisable] = useState(true)        // 禁用底部按钮
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)

  const [timeSlot, setTimeSlot] = useState({
    startTime: 0,
    endTime: 0
  })

  useEffect(() => {
    if (!showTracking) {
      if (gData.current.trackingMarker.length) {
        gData.current.trackingMarker.forEach(marker => {
          if (marker) {
            map.removeLayer(marker)
          }
        })
        gData.current.trackingMarker = []
      }
    }
  }, [showTracking])
  // console.log(dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'), dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'))
  // 清空地图数据
  const mapClear = () => {
    map.closePopup()
    // passedPolyline.setLatLngs([])
    // map.removeLayer(passedPolyline)

    if (gData.current.baseLine.length) {
      gData.current.baseLine.forEach((line) => {
        map.removeLayer(line)
      })
      gData.current.baseLine = []
    }

    // if (gData.current.arrowLine) {
    //   map.removeLayer(gData.current.arrowLine)
    //   gData.current.arrowLine = null
    // }

    gData.current.markers.forEach(elem => {
      if (elem && isArray(elem)) {
        elem.forEach((marker) => {
          map.removeLayer(marker)
        })
      }
    })
    gData.current.markers = []

    gData.current.trackingMarker.forEach(marker => {
      if (marker) {
        map.removeLayer(marker)
      }
    })
    gData.current.trackingMarker = []

    // gData.current.orderMarkers.forEach(elem => {
    //   if (elem) {
    //     map.removeLayer(elem)
    //   }
    // })
    // gData.current.orderMarkers = []


  }

  const beforeRender = () => {
    // gData.current.curIndex = 0
    // setPlay(false)
    mapClear()
  }

  const handleRoadData = () => {
    let dataArr = gData.current.trackData
    beforeRender()
    try {
      gData.current.markers = []
      gData.current.baseLine = []
      gData.current.trackingMarker = []
      // gData.current.orderMarkers = []
      let multiPath: LngLatItemType[][] = []

      dataArr.forEach((dataItemArr, parentIndex) => {
        let path: L.LatLngTuple[] = []
        let length = dataItemArr.length
        let trackColor

        multiPath[parentIndex] = []
        if (length == 1) {
          let lnglatArr: L.LatLngTuple = [Number(dataItemArr[0].lngLat?.lat || 0), Number(dataItemArr[0].lngLat?.lng || 0)]
          if (lnglatArr[0] && lnglatArr[1]) {
            lnglatArr['value'] = JSON.parse(JSON.stringify(dataItemArr[0]))
            path.push(lnglatArr)
            addMarker(dataItemArr[0], length, dataItemArr[0].indexArr)

            // 一个点画什么轨迹
            multiPath[parentIndex] = []
          }
        } else {
          dataItemArr.forEach((item, index) => {
            trackColor = item.trackColor
            // 合并到多轨迹数组
            multiPath[parentIndex] = multiPath[parentIndex].concat(item.path.map(o => ({
              ...o,
              lng: Number(o.lng),
              lat: Number(o.lat),
              // parent: elem, 
              parentIndex: index,
              grandparentIndex: parentIndex
            })))
            if (item.path && item.path.length && index < length - 1) {
              item.path.forEach((elem, index) => {
                let lnglat = [elem.lng, elem.lat]
                if (lnglat[1] && lnglat[0]) {
                  let lnglatArr: L.LatLngTuple = [Number(lnglat[1]), Number(lnglat[0])]
                  if (index === 0) {
                    lnglatArr['value'] = JSON.parse(JSON.stringify(item))
                  }
                  path.push(lnglatArr)
                }
              })
            }
            addMarker(item, length, item.indexArr)
          })
        }
        // console.log(path)
        addPath(path, trackColor)
        if (showTracking) {
          addShowTrackingMarker(dataItemArr)
        }
      })
      console.log('multiPath：----------', multiPath)

      // debugger
      if (multiPath.length) {
        trackPlayControl(multiPath)
      }
    } catch (e) {
      console.log(e)
      Message.error('生成轨迹失败')
    }
  }

  const handleLineData = () => {
    let dataArr = gData.current.trackData
    beforeRender()
    try {
      gData.current.markers = []
      gData.current.baseLine = []
      gData.current.trackingMarker = []
      let multiPath: LngLatItemType[][] = []
      // gData.current.orderMarkers = []
      dataArr.forEach((dataItemArr, parentIndex) => {
        let path: L.LatLngTuple[] = []
        let length = dataItemArr.length
        let trackColor

        multiPath[parentIndex] = []
        // debugger
        if (length == 1) {
          let lnglatArr: L.LatLngTuple = [Number(dataItemArr[0].lngLat?.lat || 0), Number(dataItemArr[0].lngLat?.lng || 0)]
          if (lnglatArr[0] && lnglatArr[1]) {
            lnglatArr['value'] = JSON.parse(JSON.stringify(dataItemArr[0]))
            path.push(lnglatArr)
            addMarker(dataItemArr[0], length, dataItemArr[0].indexArr)
            multiPath[parentIndex] = []
          }
        } else {
          dataItemArr.forEach((item, index) => {
            trackColor = item.trackColor
            // 合并到多轨迹数组
            multiPath[parentIndex].push({
              lng: Number(item.lngLat?.lng || 0),
              lat: Number(item.lngLat?.lat || 0),
              time: new Date(item.minCaptureTime).getTime(),
              grandparentIndex: parentIndex,
              parentIndex: index,
            })
            if (index < length - 1) {
              let lnglat: L.LatLngTuple = [Number(item.lngLat?.lat || 0), Number(item.lngLat?.lng || 0)]
              if (lnglat[1] && lnglat[0]) {
                lnglat['value'] = JSON.parse(JSON.stringify(item))
                path.push(lnglat)
                let lnglat1: L.LatLngTuple = [Number(dataItemArr[index + 1].lngLat?.lat || 0), Number(dataItemArr[index + 1].lngLat?.lng || 0)]
                path.push(lnglat1)
              }
            }
            addMarker(item, length, item.indexArr)
          })
        }
        addPath(path, trackColor)
        if (showTracking) {
          addShowTrackingMarker(dataItemArr)
        }
      })

      console.log('multiPath：----------', multiPath)

      if (multiPath.length) {
        trackPlayControl(multiPath)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const addMarker = (item: any, length: number, indexArr: number[] = [0, 0]) => {
    // console.log(indexArr)
    const {
      index,
      lat,
      lng,
      locationName = ''
    } = item


    let zIndex = 0
    let className = 'marker-usually  '
    if (index == 0) {
      className += 'marker-start'
      zIndex = 1000
    } else if (index == length - 1) {
      className += 'marker-end'
      zIndex = 1000
    }
    const iconSizeItem = `${item.htmlIndex}`.length >= 3 ? 30 : 24

    const markerColor = item.trackColor || baseColor
    let icon = L.divIcon({
      // className: className,
      // html: gData.current.range.start + index,
      html: `<div class="${className}" style="border-color: ${markerColor}; color: ${markerColor}">${item.htmlIndex}</div>`,
      iconSize: [iconSizeItem, iconSizeItem],
      iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
    })
    let _marker = L.marker([lat, lng], { icon: icon, zIndexOffset: zIndex })
    _marker['index'] = index
    _marker['htmlIndex'] = item.htmlIndex
    _marker['markerColor'] = markerColor
    _marker['value'] = item
    _marker.bindTooltip(`<div class="info-label">${locationName}</div>`, { offset: [7, 0], direction: 'right' })
    _marker.addTo(map)
    _marker.addEventListener('click', function () {
      if (markerClickCb) {
        markerClickCb(indexArr)
      }
    })


    // let icon2 = L.divIcon({ className: 'marker-index', html: gData.current.range.start + index, iconSize: [30, 36], iconAnchor: [15, 44] })
    // let _marker2 = L.marker([lat, lng], { icon: icon2, zIndexOffset: zIndex })
    // _marker2.bindTooltip(`<div class="info-label">${locationName}</div>`, { offset: [7, 0], direction: 'right' })
    // _marker2['index'] = index
    // _marker2['value'] = item

    // if (showOrder) {
    //   _marker2.addTo(map)
    // }
    // _marker2.addEventListener('click', function () {
    //   if (markerClickCb) {
    //     markerClickCb(index)
    //   }
    // })
    const parentIndex = item.indexArr[0]
    if (gData.current.markers[parentIndex]) {
      gData.current.markers[parentIndex].push(_marker)
    } else {
      gData.current.markers[parentIndex] = [_marker]
    }
    // console.log('gData.current.markers', gData.current.markers)
    // gData.current.orderMarkers.push(_marker2)
  }

  const addShowTrackingMarker = (dataArr: TrackDataItem[]) => {
    if (dataArr.length) {
      const trackingData = dataArr[dataArr.length - 1]
      const {
        index,
        lngLat,
        locationName = '',
        indexArr
      } = trackingData
      let zIndex = 1000
      let className = 'marker-usually  '

      const iconSizeItem = `${trackingData.index}`.length >= 3 ? 31 : 25
      const markerColor = "#FF5B4D"

      let icon = L.divIcon({
        // className: className,
        // html: gData.current.range.start + index,
        html: `<div class="tracking-marker">
            <div 
              class="${className}" 
              style="
                border-color: ${markerColor}; 
                color: ${markerColor}; 
                width: ${iconSizeItem}px; 
                height: ${iconSizeItem}px;
                margin-left: -${iconSizeItem / 2}px;
                margin-top: -${iconSizeItem / 2}px;
              "
              >
            ${trackingData.index}
            </div>
          </div>`,
        iconSize: [82, 82],
        iconAnchor: [82 / 2, 82 / 2]
      })
      let _marker = L.marker([Number(lngLat.lat), Number(lngLat.lng)], { icon: icon, zIndexOffset: zIndex })
      _marker['index'] = index
      _marker['htmlIndex'] = trackingData.index
      _marker['markerColor'] = markerColor
      _marker['value'] = trackingData
      _marker.bindTooltip(`<div class="info-label">${locationName}</div>`, { offset: [7, 0], direction: 'right' })
      _marker.addTo(map)
      _marker.addEventListener('click', function () {
        if (markerClickCb) {
          markerClickCb(indexArr)
        }
      })
      gData.current.trackingMarker.push(_marker)
    }
  }

  const addPath = (path: L.LatLngTuple[], trackColor?: string) => {
    if (!path.length || path.length <= 1) return;

    let _roadPath = path
    gData.current.roadPath = _roadPath

    let _baseLine = L.polyline(_roadPath, {
      color: trackColor || baseColor,
      weight: 3,
      // dashArray: [3, 4] 
    }).addTo(map)

    // passedPolyline.addTo(map)

    if (_roadPath.length && adapt) {
      if (_roadPath.length > 1) {
        map.fitBounds(_baseLine.getBounds())
      } else {
        map.setView(_roadPath[0], 17)
      }
    }

    gData.current.baseLine.push(_baseLine)


    // passedPolyline.setLatLngs([])
    newLatlngs.current = []

  }

  // 取消点位选中效果
  const cancelMarkerSelected = () => {
    // 关闭popup
    setPopupVisible(false)
    // 取消点位选中效果
    if (selectedMarker.current) {
      const iconSizeItem = `${selectedMarker.current['htmlIndex']}`.length >= 3 ? 30 : 24
      selectedMarker.current.setIcon(L.divIcon({
        // className: selectedMarker.current.options.icon?.options.className?.replace(" selected", ""),
        // html: gData.current.range.start + selectedMarker.current['index'],
        // html: selectedMarker.current['htmlIndex'],
        html: `<div class="marker-usually" style="border-color: ${selectedMarker.current['markerColor']}; color: ${selectedMarker.current['markerColor']}; background-color: #fff;">${selectedMarker.current['htmlIndex']}</div>`,
        iconSize: [iconSizeItem, iconSizeItem],
        iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
      }))
      selectedMarker.current = null
    }
  }

  const trackplaybackTickChange = (e: any) => {
    // console.log(e)
    // 更新时间轴
    setProgress(e.time)

    // const points = trackplaybackRef.current?.getTrackPointsBeforeTime(e.time)
    // console.log('points', points)

    // const rendered = e.target.tracks[0].getTrackPointsBeforeTime(e.time)

    // if (rendered.length > 1) {
    //   const lastRendered = rendered[rendered.length - 2]
    //   console.log('lastRendered', lastRendered)
    // }


    // 播放结束后改变播放按钮样式
    if (e.time >= (trackplaybackRef.current?.getEndTime() || 0)) {
      setPlaying(false)
      trackplaybackRef.current?.stop();
    }
  }

  // 生成轨迹播放控件
  const trackPlayControl = (multiPath: LngLatItemType[][]) => {
    console.log('初始化轨迹播放插件')
    // 初始化前如果有先消除
    if (trackplaybackRef.current) {
      try {
        trackplaybackRef.current.dispose()
        trackplaybackRef.current.off("tick", trackplaybackTickChange, this);
      } catch (err) {
        console.log(err)
      }
    }

    // 只控制轨迹播放路径
    trackplaybackRef.current = L['trackplayback'](multiPath, map, {
      // trackPointOptions: {
      //   // whether draw track point
      //   isDraw: false,
      //   // whether use canvas to draw it, if false, use leaflet api `L.circleMarker`
      //   useCanvas: false,
      //   stroke: true,
      //   width: 3,
      //   color: '#ffffff',
      //   fill: true,
      //   fillColor: '#5074EE',
      //   fillOpacity: 1,
      //   opacity: 1,
      //   radius: 9,
      //   fillText: true,
      //   textColor: '#fff',
      //   markerClickCb: (index: number) => {
      //     console.log(index)
      //   }
      // },
      trackLineOptions: {
        // whether draw track line
        isDraw: true,
        stroke: true,
        color: passColor,
        weight: 3,
        fill: false,
        // fillColor: '#000',
        opacity: 1
      },
      targetOptions: {
        // whether use image to display target, if false, the program provide a default
        useImg: true,
        // if useImg is true, provide the imgUrl
        imgUrl: carImg,
        // the width of target, unit: px
        width: 34,
        // the height of target, unit: px
        height: 42,
      }
    });

    // Optional  (only if you need plaback control)
    // const trackplaybackControl = L['trackplaybackcontrol'](trackplaybackRef.current);
    // trackplaybackControl.addTo(map);

    if (trackplaybackRef.current) {
      trackplaybackRef.current.on('tick', trackplaybackTickChange, this)

      let startTime = 0, endTime = 0
      try {
        startTime = trackplaybackRef.current?.getStartTime() || 0
        endTime = trackplaybackRef.current?.getEndTime() || 0
      } catch (error) {
        console.log(error)
      }
      // console.log(startTime, endTime)
      setTimeSlot({
        startTime,
        endTime
      })
    }
  }

  const showImageWindow = (indexArr: (number | null)[] = [null, null]) => {
    if (gData.current.infoWindow) {
      map.removeLayer(gData.current.infoWindow)
    }

    if (indexArr[0] === null || indexArr[1] === null) {
      return
    }

    let _markers = gData.current.markers[indexArr[0]]
    let _marker = _markers.find(item => item['value'].indexArr.every((val: number, i: number) => val === indexArr[i]))
    if (!_marker) {
      return
    }
    const iconSizeItem = `${_marker['htmlIndex']}`.length >= 3 ? 30 : 24
    _marker.setIcon(L.divIcon({
      // className: _marker.options.icon?.options.className + ' selected',
      // html: gData.current.range.start + _marker['index'],
      html: `<div 
        class="marker-usually selected" 
        style="
          border-color: ${_marker['markerColor']}; 
          color: #fff;
          background-color: ${_marker['markerColor']};
        "
        >${_marker['htmlIndex']}</div>`,
      iconSize: [iconSizeItem, iconSizeItem],
      iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
    }))
    selectedMarker.current = _marker
    if (_marker) {
      map.panTo(_marker['_latlng'])
    }

    setPopupContent(contentCb?.(_marker['value'], indexArr, 0) || null)
    setPopupData(_marker['_latlng'])
    if (gData.current.showImage) {
      setPopupVisible(true)
    }
  }

  useEffect(() => {
    console.log('clickIndexArr', clickIndexArr)
    popupIndexRef.current = 0
    cancelMarkerSelected()

    if (clickIndexArr[0] !== null && gData.current.markers.length) {
      showImageWindow(clickIndexArr)
    }
  }, [JSON.stringify(clickIndexArr)])

  useEffect(() => {
    // gData.current.ispause = false
    cancelMarkerSelected()
    stopCar()
    // 
    if (gData.current.trackingMarker.length) {
      gData.current.trackingMarker.forEach(marker => {
        if (marker) {
          map.removeLayer(marker)
        }
      })
      gData.current.trackingMarker = []
    }

    if (data.length) {
      let _data = data.map((item, i) => {
        return item.filter((elem) => elem.lngLat && elem.lngLat.lat && elem.lngLat.lng).map((elem, index: number) => {
          return {
            ...elem,
            lat: elem.lngLat.lat,
            lng: elem.lngLat.lng,
            htmlIndex: elem.index || index + 1,
            // index: index
          }
        })
      })
      gData.current._data = _data
      gData.current.trackData = _data

      if (type == '1') {
        setHasPath(true)
        handleRoadData()
      } else {
        setType('2')
        setHasPath(false)
        handleLineData()
      }


    } else {
      gData.current.trackData = []
      mapClear()
      if (trackplaybackRef.current) {
        try {
          trackplaybackRef.current.dispose()
          trackplaybackRef.current.off("tick", trackplaybackTickChange, this);
        } catch (err) {
          console.log(err)
        }
        trackplaybackRef.current = undefined
      }
    }

    if (data.length) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }, [JSON.stringify(data)])

  const speedContent = () => {
    return (
      <div className="cc-track-speed">
        <div className="tool-item">
          <label>播放倍速</label>
          <div className="track-speed-content">
            {
              characterConfig.multiSpeedType.map(item => {
                return <span key={item.value} className={speed == item.value ? "speed-item speed-item-checked" : "speed-item"} onClick={() => changeSpeed(item.value)}>{item.text}</span>
              })
            }
          </div>
        </div>
      </div>
    )
  }

  const moreContent = () => {
    return <div className="cc-track-more">
      <div className="tool-item">
        <label>抓拍照片</label>
        <Switch checkedChildren="on" unCheckedChildren="off" defaultChecked onChange={(checked) => { changeImageShow(checked) }} />
      </div>
      {/* <div className="tool-item">
        <label>点位序号</label>
        <Switch checkedChildren="on" unCheckedChildren="off" defaultChecked onChange={(checked) => { changeOrderShow(checked) }} />
      </div> */}
      <div className="tool-item">
        <label>导航设置</label>
        <Select
          // className="tool-item"
          getTriggerContainer={() => document.getElementsByClassName('cc-track-more')[0] as HTMLElement}
          disabled={!hasPath}
          options={hasPath ? characterConfig.trackType : [characterConfig.trackType[1]]}
          defaultValue={String(type)}
          onChange={changeType}
          showSearch={false}
        />
      </div>
    </div>
  }

  const changeSpeed = (num: number) => {
    if (disable) return
    setSpeed(num)
    trackplaybackRef.current?.setSpeed(num)
  }

  const changeType = (value: any) => {
    if (disable) return
    setProgress(0)
    setType(value)
    stopCar()
    if (value == '1') {
      handleRoadData()
    } else {
      handleLineData()
    }
  }

  const changeImageShow = (show: boolean) => {
    if (disable) return

    gData.current.showImage = show
    if (show) {
      setPopupVisible(true)
    } else {
      setPopupVisible(false)
    }
  }

  const playCar = () => {
    // debugger
    if (disable) return
    setPlaying(true)
    cancelMarkerSelected()
    console.log('trackplaybackRef.current', trackplaybackRef.current, trackplaybackRef.current?.start)
    // 判断是否是处于结束状态
    const curTime = trackplaybackRef.current?.getCurTime() || 0
    if (curTime === timeSlot.endTime) {
      trackplaybackRef.current?.rePlaying()
      return
    }
    trackplaybackRef.current?.start()



    // setPopupContent(contentCb?.(gData.current.trackData[gData.current.curIndex], gData.current.curIndex, 0) || null)
    // setPopupData({
    //   lng: gData.current.trackData[gData.current.curIndex].lngLat.lng,
    //   lat: gData.current.trackData[gData.current.curIndex].lngLat.lat
    // })

    // if (gData.current.showImage) {
    //   setPopupVisible(true)
    // }
  }

  const stopCar = () => {
    if (disable) return
    newLatlngs.current = []
    setPlaying(false)
    try {
      trackplaybackRef.current?.stop()
      trackplaybackRef.current?.setCursor(timeSlot.startTime)
    } catch (err) {
      console.log(err)
    }
    setProgress(timeSlot.startTime)
  }

  const pauseCar = () => {
    if (disable) return
    setPlaying(false)
    trackplaybackRef.current?.stop()
  }

  const rangeChange = (range: number[] | number) => {
    if (disable) return
    // console.log(range)
    setProgress(range as number)
    trackplaybackRef.current?.setCursor(range as number)
  }

  const formatterTime = (v: number) => {
    // console.log('formatterTime', v)
    return dayjs(v).format('YYYY-MM-DD HH:mm:ss')
    // if (v) {
    //   return data.length > v - 1 ? data[v - 1].captureTime : ''
    // }
  }

  // 上一条
  const prevAlarm = () => {
    if (popupIndexRef.current === 0) {
      Message.warning('已经是第一条了')
      return
    }
    popupIndexRef.current = popupIndexRef.current - 1
    updatePopupContent()
  }
  // 下一条
  const nextAlarm = (length: number) => {
    if (popupIndexRef.current >= length - 1) {
      Message.warning('已经是最后一条了')
      return
    }
    popupIndexRef.current = popupIndexRef.current + 1
    // console.log(popupIndexRef.current)
    updatePopupContent()
  }

  // 设置轨迹内数据
  const updatePopupContent = () => {
    const currentData = gData.current.markers[clickIndexArr[0] || 0]?.[clickIndexArr[1] || 0]?.['value'] || null
    setPopupContent(contentCb?.(currentData, clickIndexArr, popupIndexRef.current) || null)
  }

  useImperativeHandle(ref, () => {
    return {
      prevAlarm: prevAlarm,
      nextAlarm: nextAlarm,
    };
  });

  return (
    <>
      {
        data.length ?
          <div className="cc-track-tool track-multi">

            <div className="tool-item btn-normal btn-start" onClick={playing ? pauseCar : playCar} title={playing ? '暂停' : '播放'}>
              {
                playing ? <Icon type="zanting" /> : <Icon type="bofang" />
              }
            </div>

            <div className="tool-item btn-normal btn-stop" onClick={stopCar} title="停止">
              <Icon type="zanting1" />
            </div>

            <Popover content={speedContent}>
              <div className="tool-item btn-normal btn-speed" title="倍速">
                <Icon type="danxuankuang" />
                <span className='speed-value'>{characterConfig.multiSpeedType.filter(i => i.value == speed)[0]?.text}</span>
              </div>
            </Popover>

            <Popover content={moreContent}>
              <div className="tool-item btn-normal btn-more" title="更多">
                <Icon type="shezhi2" />
              </div>
            </Popover>

            <div className={!timeSlot.startTime ? "time-start time-disabled" : "time-start"}>{timeSlot.startTime ? dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:mm:ss') : '----/--/-- --:--:--'}</div>

            <div className="tool-item tool-progress">

              <Slider
                // disabled={playing}
                className="slider"
                min={timeSlot.startTime}
                max={timeSlot.endTime}
                value={progress}
                onChange={rangeChange}
                // onAfterChange={changeTrackData}
                tooltip={{
                  formatter: formatterTime
                }}
              />
            </div>

            <div className={!timeSlot.endTime ? "time-end time-disabled" : "time-end"}>{timeSlot.endTime ? dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:mm:ss') : '----/--/-- --:--:--'}</div>
          </div>
          : null
      }
      <CustomPopupBox
        visible={popupVisible}
        popupData={popupData}
        map={map}
        onCancel={() => {
          if (markerClickCb) {
            markerClickCb([null, null])
          }
          cancelMarkerSelected()
        }}
      >
        <div>{popupContent}</div>
      </CustomPopupBox>
    </>
  )
}

export default forwardRef(TrackMulti)