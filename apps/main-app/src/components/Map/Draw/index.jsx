import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'

function Draw(props) {
  const {
    __map__: map,
    type = 'default',               // default、circle、rectangle、polyline、polygon、clear
    confirmType = '1',              // 1：下一点由processEventName事件确定；2：下一个点由startEventName事件确定
    startEventName = 'mousedown',   // 开始事件
    processEventName = 'mousemove', // 中间事件
    endEventName = 'mouseup',       // 结束事件
    vectorStyle = {                 // 图形属性，leaflet支持的
      color: '#16ad39',
      fillColor: '#99ddb4',
      fillOpacity: 0.7
    },
    saveVectorType = '1',     // 1：只保留上一次绘制的图形；2: 保留所有绘制的图形；3、不保留绘制的图形
    saveTime = 1000,          // saveVectorTyp为3，不保留绘制的图形时有效，图形删除延迟
    onChange = () => { }       // 绘制完图形回调事件
  } = props

  const drawing = useRef(false)                        // 是否绘制中
  const [drawData, setDrawData] = useState(null)       // 绘制图形数据
  const drawDataRef = useRef(drawData)
  drawDataRef.current = drawData
  const [vector, setVector] = useState(null)           // 绘制图形实例
  const [vectorArray, setVectorArray] = useState([])   // 绘制图形数组
  const intervalTimeRef = useRef()

  // 声明并绑定事件
  useEffect(() => {
    function onEventStart(e) {
      onDrawStart(e)
    }
    function onEventProcess(e) {
      onDrawProcess(e)
    }
    function onEventEnd(e) {
      onDrawEnd(e)
    }
    map.on(startEventName, onEventStart)
    map.on(processEventName, onEventProcess)
    map.on(endEventName, onEventEnd)

    return () => {
      handleClearDrawData()
      map.off(startEventName, onEventStart)
      map.off(processEventName, onEventProcess)
      map.off(endEventName, onEventEnd)
    }
  }, [map])

  // 监听绘制类型
  useEffect(() => {
    handleDrawType()
  }, [type])

  const handleDrawType = () => {
    setDrawData(null)
    drawing.current = false
    handleClearDrawData(true)
    if (type === 'default') {
      map.dragging.enable()
      map.doubleClickZoom.enable()
    } else if (type === 'circle') {
      handleDrawCircle()
    } else if (type === 'rectangle') {
      handleDrawRectangle()
    } else if (type === 'polyline') {
      handleDrawPolyline()
    } else if (type === 'polygon') {
      handleDrawPolygon()
    } else if (type === 'clear') {
      handleClear()
    }
  }

  // 清除处理，清除绘制图形数据，移除绘制图形实例，清空绘制图形数组
  const handleClear = () => {
    handleClearDrawData(true)
    drawing.current = false
    vector && vector.remove()
    vectorArray.forEach(elem => elem.remove())
    setVector(null)
    setVectorArray([])
    onChange(type)
    map.dragging.enable()
    map.doubleClickZoom.enable()
  }

  const handleClearDrawData = (reset = false) => {
    const { circle, rectangle, polyline, polygon } = drawData || {}
    circle && circle.remove()
    rectangle && rectangle.remove()
    polyline && polyline.remove()
    polygon && polygon.remove()
    reset && setDrawData(null)
  }

  // 绘制圆形
  const handleDrawCircle = () => {
    setDrawData({
      type: 'circle',
      center: null,
      radius: 0,
      circle: null
    })
    handleDrawCommon()
  }

  // 绘制矩形
  const handleDrawRectangle = () => {
    setDrawData({
      type: 'rectangle',
      latLngs: [],
      rectangle: null
    })
    handleDrawCommon()
  }

  // 绘制折线
  const handleDrawPolyline = () => {
    setDrawData({
      type: 'polyline',
      latLngs: [],
      polyline: null
    })
    handleDrawCommon()
  }

  // 绘制多边形
  const handleDrawPolygon = () => {
    setDrawData({
      type: 'polygon',
      latLngs: [],
      polyline: null,
      polygon: null
    })
    handleDrawCommon()
  }

  const handleDrawCommon = () => {
    saveVectorType !== '2' && vector && vector.remove()
    setVector(null)
    if (startEventName === 'mousedown' && endEventName === 'mouseup') map.dragging.disable()
    map.doubleClickZoom.disable()
  }

  const onDrawStart = (e) => {
    if (!drawDataRef.current) return
    drawing.current = true
    const data = drawDataRef.current
    const { type, center, latLngs, polyline } = data || {}
    if (type === 'circle') {
      !center && setDrawData({
        ...data,
        center: e.latlng
      })
    } else if (type === 'rectangle') {
      !latLngs.length && setDrawData({
        ...data,
        latLngs: [e.latlng]
      })
    } else if (type === 'polyline' || type === 'polygon') {
      if (!latLngs.length) {
        setDrawData({
          ...data,
          latLngs: [...latLngs, [e.latlng.lat, e.latlng.lng]]
        })
      } else {
        const latLng = [e.latlng.lat, e.latlng.lng]
        const _latLngs = latLngs[latLngs.length - 1].toString() === latLng.toString() ? [...latLngs] : [...latLngs, [e.latlng.lat, e.latlng.lng]]
        const _polyline = polyline ? polyline.setLatLngs(_latLngs) : L.polyline(_latLngs, vectorStyle).addTo(map)
        setDrawData({
          ...data,
          latLngs: _latLngs,
          polyline: _polyline
        })
      }
    }
  }

  const onDrawProcess = (e) => {
    if (intervalTimeRef.current && new Date().getTime - intervalTimeRef.current < 16) return
    if (!drawing.current) return
    const data = drawDataRef.current
    const { type, center, circle, latLngs, rectangle, polyline } = data || {}
    if (type === 'circle') {
      const _radius = L.latLng(e.latlng).distanceTo(center)
      let _circle = circle ?
        circle.setLatLng(center).setRadius(_radius).addTo(map)
        :
        L.circle(center, {
          radius: _radius,
          ...vectorStyle
        })
      setDrawData({
        ...data,
        circle: _circle,
        radius: _radius
      })
    } else if (type === 'rectangle') {
      const _latLngs = [latLngs[0], e.latlng]
      const bounds = L.latLngBounds(latLngs[0], e.latlng)
      const _rectangle = rectangle ? rectangle.setBounds(bounds).addTo(map) : L.rectangle(_latLngs, vectorStyle)
      setDrawData({
        ...data,
        latLngs: _latLngs,
        rectangle: _rectangle
      })
    } else if (type === 'polyline' || type === 'polygon') {
      const _latLngs = [...latLngs, [e.latlng.lat, e.latlng.lng]]
      const _polyline = polyline ? polyline.setLatLngs(_latLngs).addTo(map) : L.polyline(_latLngs, vectorStyle)
      setDrawData({
        ...data,
        latLngs: confirmType === '1' ? _latLngs : latLngs,
        polyline: _polyline
      })
    }
  }

  const onDrawEnd = (e) => {
    if (!drawing.current) return
    const data = drawDataRef.current
    const { type, center, radius, circle, latLngs, rectangle, polyline } = data || {}
    let callbackData = {}
    if (type === 'circle') {
      // 避免切换 default 类型时 handleClearDrawData 函数将其清除
      circle && circle.remove()
      setVector(L.circle(center, {
        radius,
        ...vectorStyle
      }).addTo(map))
      callbackData = {
        type,
        center,
        radius,
        geoJson: circle && circle.toGeoJSON()
      }
    } else if (type === 'rectangle') {
      const bounds = rectangle.getBounds()
      const northEast = bounds.getNorthEast()
      const southWest = bounds.getSouthWest()
      rectangle && rectangle.remove()
      setVector(L.rectangle(latLngs, vectorStyle).addTo(map))
      callbackData = {
        type,
        northEast,
        southWest,
        geoJson: rectangle && rectangle.toGeoJSON()
      }
    } else if (type === 'polyline') {
      polyline && polyline.remove()
      setVector(L.polyline(latLngs, vectorStyle).addTo(map))
      callbackData = {
        type,
        latLngs,
        geoJson: polyline && polyline.toGeoJSON()
      }
    } else if (type === 'polygon') {
      polyline && polyline.remove()
      const _polygon = L.polygon(latLngs, vectorStyle)
      setDrawData({
        ...data,
        latLngs,
        polygon: _polygon
      })
      setVector(L.polygon(latLngs, vectorStyle).addTo(map))
      callbackData = {
        type,
        latLngs,
        geoJson: _polygon && _polygon.toGeoJSON()
      }
    }
    map.dragging.enable()
    map.doubleClickZoom.enable()
    drawing.current = false
    onChange(type, callbackData)
  }

  useEffect(() => {
    if (vector) {
      if (saveVectorType === '2') {
        setVectorArray([...vectorArray, vector])
      } else if (saveVectorType === '3') {
        setTimeout(() => {
          vector.remove()
        }, saveTime)
        setVector(null)
      }
      setDrawData(null)
    }
  }, [vector])

  return null
}

export default Draw
