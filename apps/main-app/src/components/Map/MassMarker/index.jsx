import { isArray } from '@/utils'
import { useEffect, useState } from 'react'
import CanvasMarkersLayer from './js/leaflet.canvas-markers'

function MassMarker(props) {
  const {
    __map__: map,
    data = [],                       // 点位数据
    checkedIds,
    onChangeHoverData = () => { },    // 鼠标移入事件
    onChangeClickData = () => { },     // 鼠标点击事件
    zIndex
  } = props

  // 海量点图层
  const [layer, setLayer] = useState(null)

  // 初始化创建海量点图层，并添加事件
  useEffect(() => {
    let _layer = new CanvasMarkersLayer({
      zIndex: zIndex || 100
    })
    _layer.addTo(map)
    _layer.addOnHoverListener((e, data) => {
      onChangeHoverData(e, data.map(elem => elem.data))
    })
    _layer.addOnClickListener((e, data) => {
      onChangeClickData(e, data.map(elem => elem.data))
    })
    setLayer(_layer)
  }, [])

  // 监听移除海量点图层
  useEffect(() => {

    return () => {
      layer && layer.remove()
      try {
        layer && layer._tooltip && layer._tooltip.remove()
      } catch (e) {
        console.log(e)
      }
    }
  }, [layer])

  // 监听移除海量点图层和点位数据，更新点位数据
  useEffect(() => {
    if (layer) {
      layer.clearLayers()
      if (checkedIds && isArray(checkedIds)) {
        layer.setOptions({
          checkedIds: checkedIds
        })
      }
      try {
        Array.isArray(data) && data.length && layer.addMarkers(data, checkedIds)
      } catch (e) {
        console.error('<MassMarker />', e)
      }
    }
  }, [layer, data])

  return null
}

export default MassMarker
