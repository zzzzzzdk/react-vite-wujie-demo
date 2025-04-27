import React, { useState, useEffect, useRef } from "react"
import L from 'leaflet'
import { Point, toPoint } from 'leaflet/src/geometry/Point';
import "./index.scss"

function CustomPopupBox(props) {
  const {
    popupData, // 经纬度
    map, // 必须，map实例
    visible, // 外部开关控制变量
    onCancel, // 关闭方法
    piany = 24,//弹窗上下偏移
  } = props

  // 自定义popup相关
  const [latLng, setLatLng] = useState([])
  const latLngRef = useRef()
  latLngRef.current = latLng
  const [style, setStyle] = useState({  // 自定义popup弹框的相对地图定位样式
    top: 0,
    left: 0
  })
  const autoPanRef = useRef(false) // 是否自动平移

  useEffect(() => {
    handlePopupLeave()
    if (popupData && popupData.lng && popupData.lat) {
      let position = map.latLngToContainerPoint(L.latLng(popupData.lat, popupData.lng))
      // console.log(position)
      setStyle({
        // top: position.y - 24,
        top: position.y - piany,
        left: position.x
      })
      setLatLng([popupData.lat, popupData.lng])
      autoPanRef.current = true
      // map.flyTo(L.latLng([parseFloat(popupData.lat), parseFloat(popupData.lng)]))
      // adjustPan()
    }
  }, [popupData])

  // 地图点击事件
  const clickCb = (e) => {
    // 点击区域
    let elem = e.originalEvent.target
    let clickArea = document.getElementById('custom-popup-box') // 结果区域

    // 判断点击区域
    let areas = [clickArea]
    let isInPopupArea = false
    areas.forEach((item) => {
      if (item && item.contains(elem)) {
        isInPopupArea = true
      }
    })

    if (!isInPopupArea && onCancel) {
      onCancel()
    }
  }

  // 进入popup弹框禁止地图拖拽、缩放和双击
  const handlePopupEnter = (e) => {
    map.dragging.disable();
    map.scrollWheelZoom.disable()
    map.doubleClickZoom.disable()
  }

  // 离开popup弹框放开地图拖拽、缩放和双击
  const handlePopupLeave = (e) => {
    map.dragging.enable();
    map.scrollWheelZoom.enable()
    map.doubleClickZoom.enable()
  }

  // 地图缩放回调
  const zoomCb = (event) => {
    if (latLngRef.current.length) {
      let position = map.latLngToContainerPoint(L.latLng(latLngRef.current))
      setStyle({
        // top: position.y - 24,
        top: position.y - piany,
        left: position.x
      })
    }
  }

  // 根据popup是否被遮挡，自动平移到不被遮挡的位置
  const adjustPan = function () {
    if (!visible) { return; }
    if (!autoPanRef.current) { return; }
    if (!latLngRef.current) { return; }
    if (map._panAnim) { map._panAnim.stop(); }
    const container = L.DomUtil.get("custom-popup-box")
    if (!container) {
      return;
    }
    let containerHeight = container?.offsetHeight,
      containerWidth = container?.offsetWidth,
      containerLeft = container?.offsetLeft,
      containerTop = container?.offsetTop,
      containerBottom = container?.offsetTop + containerHeight,
      layerPos = new Point(containerLeft - (containerLeft / 2), containerTop - containerHeight - 10); // 这里因为transform: translate(-50%, -100%);属性影响，需要减去一般的宽度和整个的高度作为x，y

    layerPos._add(L.DomUtil.getPosition(container));

    // let containerPos = map.layerPointToContainerPoint(layerPos),
    let containerPos = layerPos, // 直接用layerPos，不用转换containerPos
      padding = toPoint([5, 5]),
      paddingTL = toPoint(padding),
      paddingBR = toPoint(padding),
      size = map.getSize(),
      dx = 0,
      dy = 0;


    if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
      dx = containerPos.x + containerWidth - size.x + paddingBR.x;
    }
    if (containerPos.x - dx - paddingTL.x < 0) { // left
      dx = containerPos.x - paddingTL.x;
    }
    if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
      dy = containerPos.y + containerHeight - size.y + paddingBR.y;
    }
    if (containerPos.y - dy - paddingTL.y < 0) { // top
      dy = containerPos.y - paddingTL.y;
    }


    if (dx && dy) {
      map.fire('autopanstart').panBy([dx, dy]);
    }
    autoPanRef.current = false
  }

  useEffect(() => {
    if (!visible) {
      handlePopupLeave()
    }
  }, [visible])

  useEffect(() => {
    return () => {
      map.off('click', clickCb)
      map.off('zoom', zoomCb)
      map.off('move', zoomCb)
      map.off('moveend', adjustPan)
    }
  }, [])

  useEffect(() => {
    if (map) {
      map.on('click', clickCb)
      map.on('zoom', zoomCb)
      map.on('move', zoomCb)
      map.on('moveend', adjustPan)
    }
  }, [map])

  return (
    visible ?
      <div
        id="custom-popup-box"
        className="custom-popup-box"
        style={style}
        onMouseEnter={handlePopupEnter}
        onMouseLeave={handlePopupLeave}
      >
        {props.children}
        <div className="popup-arrow"></div>
      </div>
      : null
  )
}

export default CustomPopupBox