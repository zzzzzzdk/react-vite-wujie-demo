import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { Switch, Message, Slider, Popover, Select } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import L from 'leaflet'
import './js/Leaflet.AnimatedMarker'
import 'leaflet-polylinedecorator'
import './index.scss'
import carImg from './images/car.png'
import TrackProps, { GDataType, RefTrack } from './interface'
import { SelectCommonProps } from '@yisa/webui/es/Select/interface'
import { CustomPopupBox } from '@/components'
import characterConfig from '@/config/character.config'

const carIcon = L.icon({
  iconSize: [37, 26],
  iconAnchor: [19, 13],
  iconUrl: carImg
})

function Track(props: TrackProps, ref: React.ForwardedRef<RefTrack>) {

  const map = props['__map__'] as L.Map

  const {
    data = [],
    startTime = '',
    endTime = '',
    baseColor = '#3377ff',
    passColor = '#28b7d9',
    clickIndex = null,
    markerClickCb,
    contentCb,
    dtype = '1',
    position = {
      x: 0,
      y: 0
    }
    // getRenderList = () => { }
  } = props


  const gData = useRef<GDataType>({
    _data: [], //  data 过滤后有经纬度点位
    trackData: [], // 当前轨迹的数据
    roadPath: [], // 经纬度处理后的轨迹数据
    showImage: true,
    curIndex: 0,  // 当前是第几个点
    infoWindow: null,
    markers: [],  // 点位marker
    orderMarkers: [],   // 序号marker
    baseLine: null,  // 基础路径
    arrowLine: null,  // 箭头
    moveMarker: null, // 移动marker
    range: {
      start: 1,
      end: 1
    },
    timer: null,
  })

  const newLatlngs = useRef<L.LatLngTuple[]>([])

  const [disable, setDisable] = useState(true)        // 禁用底部按钮

  const [play, setPlay] = useState(false)                              // 启动按钮状态

  const [showOrder, setShowOrder] = useState(true)     // 点位序号显示

  const [type, setType] = useState(dtype)

  const [hasPath, setHasPath] = useState(true)

  const [passedPolyline] = useState(L.polyline([], { color: passColor, weight: 4 })) // 小车轨迹路径

  const [speed, setSpeed] = useState(1)

  const [progress, setProgress] = useState(0)

  const [range, setRange] = useState(gData.current.range)
  // 自定义popup弹框相关变量
  const [popupData, setPopupData] = useState({ lat: "", lng: "" })
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null)

  // marker选中（单个）
  const selectedMarker = useRef<L.Marker | null>(null)

  const popupIndexRef = useRef(0)

  useImperativeHandle(ref, () => {
    return {
      prevAlarm: prevAlarm,
      nextAlarm: nextAlarm,
      pauseCar: pauseCar,
      closePopup: () => { setPopupVisible(false) }
    };
  });

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
    const marker = gData.current.markers.find(item => item['value'].htmlIndex === clickIndex) as L.Marker
    setPopupContent(contentCb?.(marker['value'], clickIndex || 0, popupIndexRef.current) || null)
    // if (windowType == 'click') {
    // } else if (windowType == 'move') {
    //   setPopupContent(contentCb(data[curIndexRef.current], popupIndexRef.current, curIndexRef.current))
    //   // let infoBody = contentCb ? contentCb(data[curIndexRef.current], popupIndexRef.current, curIndexRef.current) : ''
    //   // moveMarker._popup.setContent(infoBody)
    // } else {
    //   if (markers.length > 1) {
    //     let _length = markers.length - 1
    //     setPopupContent(contentCb(markers[_length].value, popupIndexRef.current, _length))
    //   }
    // }
  }

  useEffect(() => {
    return () => {
      try {
        newLatlngs.current = []
        if (gData.current.moveMarker) {
          gData.current.moveMarker.stop()
        }
        map && map.eachLayer(function (layer) {
          if (!layer['_container'] || !layer['_container'].classList.contains('leaflet-layer')) {
            layer.remove();
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }, [])

  useEffect(() => {
    // console.log('clickIndex', clickIndex)
    popupIndexRef.current = 0
    cancelMarkerSelected()

    if (clickIndex !== null && gData.current.markers.length) {
      showImageWindow(clickIndex)
    }
  }, [clickIndex])

  const showImageWindow = (itemIndex: number) => {
    if (gData.current.infoWindow) {
      map.removeLayer(gData.current.infoWindow)
    }

    let _marker = gData.current.markers.find(item => item['value'].htmlIndex === itemIndex)
    if (!_marker) {
      return
    }
    const iconSizeItem = `${_marker['htmlIndex']}`.length >= 3 ? 30 : 24
    _marker.setIcon(L.divIcon({
      className: _marker.options.icon?.options.className + ' selected',
      // html: gData.current.range.start + _marker['index'],
      html: _marker['htmlIndex'],
      iconSize: [iconSizeItem, iconSizeItem],
      iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
    }))
    selectedMarker.current = _marker
    if (_marker) {
      console.log(_marker['_latlng'])
      // map.panTo(_marker['_latlng'])
      const point = map.latLngToLayerPoint(_marker['_latlng'])
      map.panTo(map.layerPointToLatLng(L.point(point.x + position.x, point.y + position.y)))
    }

    setPopupContent(contentCb?.(_marker['value'], itemIndex, 0) || null)
    setPopupData(_marker['_latlng'])
    if (gData.current.showImage) {
      setPopupVisible(true)
    }
    // let infoBody = contentCb ? contentCb(_marker['value']) : ''

    // if (infoBody) {
    //   gData.current.infoWindow = L.popup({ offset: [0, -4], className: "img-info-box" }).setLatLng(_marker['_latlng']).setContent(infoBody)
    //   gData.current.infoWindow.openOn(map)
    // }

  }

  // 取消点位选中效果
  const cancelMarkerSelected = () => {
    // 关闭popup
    setPopupVisible(false)
    // 取消点位选中效果
    if (selectedMarker.current) {
      const iconSizeItem = `${selectedMarker.current['htmlIndex']}`.length >= 3 ? 30 : 24
      selectedMarker.current.setIcon(L.divIcon({
        className: selectedMarker.current.options.icon?.options.className?.replace(" selected", ""),
        // html: gData.current.range.start + selectedMarker.current['index'],
        html: selectedMarker.current['htmlIndex'],
        iconSize: [iconSizeItem, iconSizeItem],
        iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
      }))
      selectedMarker.current = null
    }
  }

  // 清空地图数据
  const mapClear = () => {
    map.closePopup()
    passedPolyline.setLatLngs([])
    map.removeLayer(passedPolyline)

    if (gData.current.baseLine) {
      map.removeLayer(gData.current.baseLine)
      gData.current.baseLine = null
    }

    // if (gData.current.arrowLine) {
    //   map.removeLayer(gData.current.arrowLine)
    //   gData.current.arrowLine = null
    // }

    gData.current.markers.forEach(elem => {
      if (elem) {
        map.removeLayer(elem)
      }
    })
    gData.current.markers = []


    gData.current.orderMarkers.forEach(elem => {
      if (elem) {
        map.removeLayer(elem)
      }
    })
    gData.current.orderMarkers = []


    if (gData.current.moveMarker) {
      gData.current.moveMarker.closePopup()
      gData.current.moveMarker.stop()
      map.removeLayer(gData.current.moveMarker)
    }
    gData.current.moveMarker = null
  }

  const beforeRender = () => {
    gData.current.curIndex = 0
    setPlay(false)
    mapClear()
  }

  const handleRoadData = () => {
    let dataArr = gData.current.trackData
    beforeRender()
    try {
      let path: L.LatLngTuple[] = []
      gData.current.markers = []
      gData.current.orderMarkers = []
      let length = dataArr.length

      if (length == 1) {
        let lnglatArr: L.LatLngTuple = [dataArr[0].lngLat.lat, dataArr[0].lngLat.lng]
        if (lnglatArr[0] && lnglatArr[1]) {
          lnglatArr['value'] = JSON.parse(JSON.stringify(dataArr[0]))
          path.push(lnglatArr)
          addMarker(dataArr[0], length)
        }
      } else {
        dataArr.forEach((item, index) => {
          if (item.path && item.path.length) {
            let lnglatStr: string[] = []
            item.path.forEach((elem: string) => {
              lnglatStr = lnglatStr.concat(elem.split(';'))
            })
            lnglatStr.forEach((elem, index) => {
              let lnglat = elem.split(',').map((item) => {
                return parseFloat(item)
              })
              if (lnglat[1] && lnglat[0]) {
                let lnglatArr: L.LatLngTuple = [lnglat[1], lnglat[0]]
                if (index === 0) {
                  lnglatArr['value'] = JSON.parse(JSON.stringify(item))
                }
                path.push(lnglatArr)
              }
            })
          }
          addMarker(item, length)
        })

      }
      addPath(path)

      if (!path.length && length > 0) {
        // 往第一个点移动位置，以防没有path，点位不在范围显示
        if (dataArr[0].lngLat.lat && dataArr[0].lngLat.lng) {
          map.setView([Number(dataArr[0].lngLat.lat), Number(dataArr[0].lngLat.lng)], 17)
        }
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
      let path: L.LatLngTuple[] = []
      gData.current.markers = []
      gData.current.orderMarkers = []
      let length = dataArr.length
      // debugger
      if (length == 1) {
        let lnglatArr: L.LatLngTuple = [dataArr[0].lngLat.lat, dataArr[0].lngLat.lng]
        if (lnglatArr[0] && lnglatArr[1]) {
          lnglatArr['value'] = JSON.parse(JSON.stringify(dataArr[0]))
          path.push(lnglatArr)
          addMarker(dataArr[0], length)
        }
      } else {
        dataArr.forEach((item, index) => {
          if (index < length - 1) {
            let lnglat: L.LatLngTuple = [item.lngLat.lat, item.lngLat.lng]
            if (lnglat[1] && lnglat[0]) {
              lnglat['value'] = JSON.parse(JSON.stringify(item))
              path.push(lnglat)
              let lnglat1: L.LatLngTuple = [dataArr[index + 1].lngLat.lat, dataArr[index + 1].lngLat.lng]
              path.push(lnglat1)
            }
          }
          addMarker(item, length)
        })
      }

      addPath(path)
      if (!path.length && length > 0) {
        // 往第一个点移动位置，以防没有path，点位不在范围显示
        if (dataArr[0].lngLat.lat && dataArr[0].lngLat.lng) {
          map.setView([Number(dataArr[0].lngLat.lat), Number(dataArr[0].lngLat.lng)], 17)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const addMarker = (item: any, length: number) => {

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
      //fix：Leaflet.AnimatedMarker文件中，小车图标的父元素设置zIndex无效，导致小车图标会在索引图标下面，去掉 zIndex = 1000
      // zIndex = 1000
    } else if (index == length - 1) {
      className += 'marker-end'
      // zIndex = 1000
    }
    const iconSizeItem = `${item.htmlIndex}`.length >= 3 ? 30 : 24
    let icon = L.divIcon({
      className: className,
      // html: gData.current.range.start + index,
      html: item.htmlIndex,
      iconSize: [iconSizeItem, iconSizeItem],
      iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
    })
    let _marker = L.marker([lat, lng], { icon: icon, zIndexOffset: zIndex })
    _marker['index'] = index
    _marker['htmlIndex'] = item.htmlIndex
    _marker['value'] = item
    _marker.bindTooltip(`<div class="info-label">${locationName}</div>`, { offset: [7, 0], direction: 'right' })
    _marker.addTo(map)
    _marker.addEventListener('click', function () {
      if (markerClickCb) {
        markerClickCb(item.htmlIndex)
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

    gData.current.markers.push(_marker)
    // gData.current.orderMarkers.push(_marker2)
  }


  const addPath = (path: L.LatLngTuple[]) => {
    if (!path.length || path.length <= 1) return;

    let _roadPath = path
    gData.current.roadPath = _roadPath

    let _baseLine = L.polyline(_roadPath, { color: baseColor, weight: 3, dashArray: [3, 4] }).addTo(map)

    passedPolyline.addTo(map)

    if (_roadPath.length) {
      if (_roadPath.length > 1) {
        map.fitBounds(_baseLine.getBounds())
      } else {

      }
    }

    gData.current.baseLine = _baseLine


    // const _arrowLine = L['polylineDecorator'](_baseLine, {
    //   patterns: [{
    //     repeat: 20,
    //     symbol: L['Symbol'].arrowHead({
    //       pixelSize: 5,
    //       headAngle: 75,
    //       polygon: false,
    //       pathOptions: {
    //         stroke: true,
    //         weight: 2,
    //         color: '#FFFFFF'
    //       }
    //     })
    //   }]
    // }).addTo(map)

    // gData.current.arrowLine = _arrowLine


    passedPolyline.setLatLngs([])
    newLatlngs.current = []

    addMoveMarker(gData.current.baseLine.getLatLngs())

  }

  const addMoveMarker = (path: L.LatLng[] | L.LatLng[][] | L.LatLng[][][]) => {


    if (gData.current.moveMarker) {
      map.removeLayer(gData.current.moveMarker)
    }

    // 动态marker
    const animatedMarker = L['animatedMarker'](path, {
      speetX: speed,
      interval: 200, // 默认为100mm
      icon: carIcon,
      playCall: updateRealLine
    }).addTo(map)

    animatedMarker.setSpeetX(speed)

    var totaldis2 = getDistance(path as L.LatLng[])

    // 绘制已行走轨迹线
    function updateRealLine(latlng: {
      lat: number;
      lng: number;
      i: number;
      isStop: boolean;
    }) {
      if (latlng.lat && latlng.lng) {
        let value = gData.current.roadPath[latlng.i] ? gData.current.roadPath[latlng.i]['value'] : {}
        if (value && value.index !== gData.current.curIndex) {
          gData.current.curIndex = value.index
          console.log(value.index, 'value.index')
          setPopupContent(contentCb?.(gData.current.trackData[value.index], value.htmlIndex, 0) || null)
          setPopupData({
            lng: gData.current.trackData[value.index].lngLat.lng,
            lat: gData.current.trackData[value.index].lngLat.lat
          })
          if (gData.current.showImage) {
            setPopupVisible(true)
          }
          // gData.current.moveMarker?.bindPopup(contentCb?.(gData.current.trackData[gData.current.curIndex]), { className: "img-info-box", offset: [0, -4] })

          // if (gData.current.showImage) {
          //   gData.current.moveMarker?.openPopup()
          // } else {
          //   gData.current.moveMarker?.closePopup()
          // }
        }

        newLatlngs.current.push(latlng as unknown as L.LatLngTuple)
        passedPolyline.setLatLngs(newLatlngs.current)


        let lnglatssss = passedPolyline.getLatLngs()
        let totaldis = getDistance(lnglatssss as L.LatLng[])
        let p = parseFloat((100 * totaldis / totaldis2).toFixed(2))
        // console.log(p)
        setProgress(p)
      }

      if (latlng.isStop) {
        gData.current.curIndex = gData.current.trackData.length - 1
        newLatlngs.current = []
        setPlay(false)
        showImageWindow(gData.current.markers.length - 1)
      }
    }


    setProgress(0)

    gData.current.moveMarker = animatedMarker

    // setPopupContent(contentCb?.(gData.current.trackData[gData.current.curIndex], gData.current.trackData[gData.current.curIndex].htmlIndex, 0) || null)
    // setPopupData({
    //   lng: gData.current.trackData[gData.current.curIndex].lngLat.lng,
    //   lat: gData.current.trackData[gData.current.curIndex].lngLat.lat
    // })
    // if (gData.current.showImage) {
    //   setPopupVisible(true)
    // }

    popupIndexRef.current = 0
  }

  const getDistance = (arr: L.LatLng[]) => {
    let distance = 0
    if (arr.length > 1) {
      for (let i = 0; i < arr.length - 1; i++) {
        distance += arr[i].distanceTo(arr[i + 1])
      }
    }
    return parseFloat(`${distance}`)
  }

  useEffect(() => {
    mapClear()

    // gData.current.ispause = false
    cancelMarkerSelected()
    if (data.length) {

      let _data = data.filter(item => item.lngLat && item.lngLat.lat && item.lngLat.lng).map((item, index) => ({
        ...item,
        lat: item.lngLat.lat,
        lng: item.lngLat.lng,
        htmlIndex: item.index,
        index: index
      }))
      gData.current._data = _data
      gData.current.trackData = _data
      // getRenderList(_data)

      // debugger
      if (type == '1' && _data[0]?.path) {
        setHasPath(true)
        handleRoadData()
      } else {
        setType('2')
        setHasPath(false)
        handleLineData()
      }

      setProgress(0)

      gData.current.range = {
        start: 1,
        end: data.length
      }
      setRange(gData.current.range)

    } else {
      gData.current.trackData = []
      // getRenderList([])
      setProgress(0)
    }

    if (data.length && data.length > 1) {
      setDisable(false)


    } else {
      setDisable(true)
    }

  }, [JSON.stringify(data)])


  const changeOrder = (type: 'next' | 'prev') => {
    if (gData.current.timer) {
      clearTimeout(gData.current.timer)
    }
    gData.current.timer = setTimeout(() => {
      let trackData = gData.current.trackData
      if (type == 'next') {
        if (gData.current.curIndex < trackData.length - 2) {
          gData.current.curIndex += 1
          let index = 0
          for (let i = 0; i < gData.current.roadPath.length; i++) {
            if (gData.current.roadPath[i]['value'] && gData.current.roadPath[i]['value'].index == gData.current.curIndex) {
              index = i
              break
            }
          }
          newLatlngs.current = gData.current.roadPath.slice(0, index)
          passedPolyline.setLatLngs(newLatlngs.current)
          gData.current.moveMarker?.setI(index)


          // gData.current.moveMarker.bindPopup(contentCb?.(trackData[gData.current.curIndex]), { className: "img-info-box", offset: [0, -4] })
          // if (gData.current.showImage) {
          //   gData.current.moveMarker.openPopup()
          // } else {
          //   gData.current.moveMarker.closePopup()
          // }

        } else if (gData.current.curIndex == trackData.length - 2) {
          gData.current.curIndex += 1
          newLatlngs.current = gData.current.roadPath
          passedPolyline.setLatLngs(newLatlngs.current)
          // gData.current.moveMarker.bindPopup(contentCb?.(trackData[gData.current.curIndex]), { className: "img-info-box", offset: [0, -4] })
          gData.current.moveMarker?.setLatLng([trackData[gData.current.curIndex].lngLat.lat, trackData[gData.current.curIndex].lngLat.lng])
          // if (gData.current.showImage) {
          //   gData.current.moveMarker.openPopup()
          // } else {
          //   gData.current.moveMarker.closePopup()
          // }
          gData.current.moveMarker?.setI(-1)
        } else {
          Message.warning('已经是最后一个点位')
        }

      } else {
        if (gData.current.curIndex > 0) {
          gData.current.curIndex -= 1
          let index = 0
          for (let i = 0; i < gData.current.roadPath.length; i++) {
            if (gData.current.roadPath[i]['value'] && gData.current.roadPath[i]['value'].index == gData.current.curIndex) {
              index = i
              break
            }
          }
          newLatlngs.current = gData.current.roadPath.slice(0, index)
          passedPolyline.setLatLngs(newLatlngs.current)
          gData.current.moveMarker?.setI(index)

          // gData.current.moveMarker.bindPopup(contentCb?.(trackData[gData.current.curIndex]), { className: "img-info-box", offset: [0, -4] })
          // if (gData.current.showImage) {
          //   gData.current.moveMarker.openPopup()
          // } else {
          //   gData.current.moveMarker.closePopup()
          // }
        } else {
          Message.warning('已经是第一个点位')
        }
      }
    }, 200)
  }

  const playCar = () => {
    if (disable) return
    setPlay(true)
    cancelMarkerSelected()

    gData.current.moveMarker?.start();

    setPopupContent(contentCb?.(gData.current.trackData[gData.current.curIndex], gData.current.trackData[gData.current.curIndex].htmlIndex, 0) || null)
    setPopupData({
      lng: gData.current.trackData[gData.current.curIndex].lngLat.lng,
      lat: gData.current.trackData[gData.current.curIndex].lngLat.lat
    })

    if (gData.current.showImage) {
      setPopupVisible(true)
    }
  }

  const pauseCar = () => {
    if (disable) return
    setPlay(false)
    gData.current.moveMarker?.pause();
  }

  const stopCar = () => {
    if (disable) return
    newLatlngs.current = []
    gData.current.moveMarker?.stop();
    setPlay(false)
  }

  const changeNext = () => {
    if (disable) return
    changeOrder('next')
  }

  const changePre = () => {
    if (disable) return
    changeOrder('prev')
  }

  const changeSpeed = (num: number) => {
    if (disable) return
    gData.current.moveMarker?.setSpeetX(Number(num));
    setSpeed(num)
    setPlay(true)
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
    // if (show) {
    //   gData.current.moveMarker.openPopup()
    // } else {
    //   gData.current.moveMarker.closePopup()
    // }
  }

  // const changeOrderShow = (show: boolean) => {
  //   if (disable) return
  //   setShowOrder(show)
  //   if (show) {
  //     gData.current.orderMarkers.forEach(elem => {
  //       elem.addTo(map)
  //     })
  //   } else {
  //     gData.current.orderMarkers.forEach(elem => {
  //       map.removeLayer(elem)
  //     })
  //   }
  // }

  const rangeChange = (range: number[] | number) => {
    const [start, end] = range as number[]
    if (disable) return
    if (start + 1 > end) {
      return false
    }
    setProgress(0)
    gData.current.range = {
      start: start,
      end: end
    }
    setRange(gData.current.range)
  }

  const changeTrackData = (value: number[] | number) => {
    if (disable) return
    let _data = gData.current._data.slice(value[0] - 1, value[1]).map((item, index) => ({
      ...item,
      // htmlIndex: item.htmlIndex,
      index: index
    }))
    setProgress(0)
    gData.current.trackData = _data
    // getRenderList(_data)
    if (type == '1') {
      handleRoadData()
    } else {
      handleLineData()
    }
  }


  const speedContent = () => {
    return (
      <div className="cc-track-speed">
        <div className="tool-item">
          <label>播放倍速</label>
          <div className="track-speed-content">
            {
              characterConfig.speedType.map(item => {
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
          className="tool-item"
          // @ts-ignore
          getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
          disabled={!hasPath}
          options={hasPath ? characterConfig.trackType : [characterConfig.trackType[1]]}
          defaultValue={String(type)}
          onChange={changeType}
          showSearch={false} />
      </div>
    </div>
  }

  const formatterTime = (v: number) => {
    if (v) {
      return data.length > v - 1 ? data[v - 1].captureTime : ''
    }
  }

  const formatter = () => {
    return <span>{gData.current.trackData.length ? gData.current.trackData[gData.current.curIndex]?.captureTime : ''}</span>
  }

  return (
    <>
      {
        data.length ?
          <div className="cc-track-tool">

            <div className="tool-item btn-normal btn-start" onClick={play ? pauseCar : playCar} title={play ? '暂停' : '播放'}>
              {
                play ? <Icon type="zanting" /> : <Icon type="bofang" />
              }
            </div>

            <div className="tool-item btn-normal btn-stop" onClick={stopCar} title="停止">
              <Icon type="zanting1" />
            </div>

            <div className="tool-item btn-normal btn-order" onClick={changePre} title="上一个">
              <Icon type="houtui" />
            </div>

            <div className="tool-item btn-normal btn-order" onClick={changeNext} title="下一个">
              <Icon type="kuaijin" />
            </div>

            <Popover content={speedContent}>
              <div className="tool-item btn-normal btn-speed" title="倍速">
                <Icon type="danxuankuang" />
                <span className='speed-value'>{characterConfig.speedType.filter(i => i.value == speed)[0].text}</span>
              </div>
            </Popover>

            <Popover content={moreContent}>
              <div className="tool-item btn-normal btn-more" title="更多">
                <Icon type="shezhi2" />
              </div>
            </Popover>

            <div className={!startTime ? "time-start time-disabled" : "time-start"}>{startTime ? startTime : '----/--/-- --:--:--'}</div>

            <div className="tool-item tool-progress">

              <Slider
                disabled={play}
                className="slider-bottom"
                min={1}
                max={data.length}
                value={[range.start, range.end]}
                range={true}
                onChange={rangeChange}
                onAfterChange={changeTrackData}
                tooltip={{
                  formatter: formatterTime
                }}
              />

              <Slider
                // style 在slider组件内部使用restProps接收，没有暴露
                // @ts-ignore
                style={
                  {
                    left: `${(range.start - 1) / (data.length - 1) * 100}%`,
                    top: '0px',
                    width: `calc(100%  * ${((range.end - range.start)) / (data.length - 1 < 1 ? 1 : data.length - 1)})` // 防止分母为0
                  }
                }
                step={0.01}
                min={0}
                className="slider-on"
                disabled={!startTime || !endTime}
                value={progress}
                tooltip={{
                  formatter: formatter,
                  popupVisible: play
                }}
              />

            </div>

            <div className={!endTime ? "time-end time-disabled" : "time-end"}>{endTime ? endTime : '----/--/-- --:--:--'}</div>
          </div>
          : null
      }
      <CustomPopupBox
        visible={popupVisible}
        popupData={popupData}
        map={map}
        onCancel={() => {
          if (markerClickCb) {
            markerClickCb(null)
          }
          cancelMarkerSelected()
        }}
      >
        <div>{popupContent}</div>
      </CustomPopupBox>
    </>
  )
}

export default forwardRef(Track)


