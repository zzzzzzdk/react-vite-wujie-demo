import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Markers, VectorArr, VectorProps } from './interface'
import { CustomPopupBox } from '..'
import { Message } from '@yisa/webui'

// let data = {
//   type: "circle",            // circle、react、ploygon
//   // circle
//   center: L.latLng(),                // leaflet 经纬度对象
//   r: '',                     // 半径米

//   // react
//   ne: L.latLng(),                   // leftlet 经纬度对象
//   sw: L.latLng(),                    // leftlet 经纬度对象

//   // polygon
//   bounds: [L.latLng()],             // leftlet 经纬度对象 数组

//   // 共同
//   color: "",                        // 十六进制
//   innerHtml: "",                    // 用来创建 L.divIcon
// }
// marker选中（单个）
// eslint-disable-next-line react-hooks/rules-of-hooks


function Vector(props: VectorProps) {

  const map = props['__map__'] as L.Map
  const {
    // vectorData = [{clickindex:(-1)}],
    vectorData,
    scaleZoom = 3,
    // activeIndex = '',
    // clickIndex = 0,
    selected,
    contentCb
  } = props
  // 自定义popup弹框相关变量
  const [popupData, setPopupData] = useState({ lat: 0, lng: 0 })
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null)
  const [clickIndex, setClickIndex] = useState(0)
  const selectedMarker = useRef<L.Marker | null>(null)
  // const zoomStart = useRef<any>(null), zoomEnd = useRef<any>(null)
  const [vectorArr, setVectorArr] = useState<L.Circle[]>([])
  const vectorArrRef = useRef<any>(null)//存储圈
  vectorArrRef.current = vectorArr
  const [markerArr, setMarkerArr] = useState<L.Marker[]>([])
  const markerArrRef = useRef<any>(null)//存储标记
  markerArrRef.current = markerArr

  const renderVector = () => {
    // console.log('weism');
    setClickIndex(0)
    // gData.current.markers = []
    let vectors: L.Circle[] = [], markers: L.Marker[] = []
    vectorData.forEach((elem: VectorArr) => {
      let vector, marker
      if (elem.type == 'marker') {
        let letter = ['A', 'B']
        elem.markers.forEach((elem: Markers, index: number) => {
          if(elem.lat==0||elem.lng==0){
            Message.warning('点位缺失或点位不足，无法绘制落脚点')
            return
          }
          let icon = L.divIcon({ className: 'marker-usually', html: letter[index], iconSize: [24, 24], iconAnchor: [12, 12] })
          let marker = L.marker([elem.lat, elem.lng], { icon: icon }).bindTooltip(elem.text)
          markers.push(marker)
          marker['htmlIndex'] = letter[index]
          marker['value'] = elem
          marker.on('click', () => {
            // if (vectors.length > 0)
              // map.fitBounds(vectors[0].getBounds())
            // else {
            console.log(marker,'pp');
            
            map.setView(marker['_latlng'], 13)
            // }
            setClickIndex(index)
          })
        })
        if (elem.markers.length === 2) {
          let center = L.latLng((elem.markers[0].lat + elem.markers[1].lat) / 2, (elem.markers[0].lng + elem.markers[1].lng) / 2)
          let r = L.latLng(elem.markers[0].lat, elem.markers[0].lng).distanceTo(L.latLng(elem.markers[1].lat, elem.markers[1].lng)) / 2
          vector = L.circle(center, { radius: r, color: '#3377FF', weight: 1.5 })
        }
      } else {
        console.log('未知图形')
      }
      if (vector) {
        vectors.push(vector)
      }
      if (marker) {
        markers.push(marker)
        // console.log(marker,1);
      }
    })
    if (map.getZoom() >= scaleZoom) {
      vectors.forEach((elem: L.Circle) => {
        map.addLayer(elem)
      })
      markers.forEach((elem: L.Marker) => {
        map.addLayer(elem)
      })
      // if(vectors.length == 1)
      // map.fitBounds(vectors[0].getBounds())
      // }
    }
    setVectorArr(vectors)
    vectorArrRef.current = vectors
    // console.log(markers,'p');
    // gData.current.markers.push(marker)
    markerArrRef.current = markers
    setMarkerArr(markers)
    // console.log(vectors, markers, 'look');

  }

  useEffect(() => {
    return () => {
      if (map) {
        vectorArrRef.current.forEach((elem: L.Circle) => {
          map.removeLayer(elem)
        })
        markerArrRef.current.forEach((elem: L.Marker) => {
          map.removeLayer(elem)
        })
        // map.removeEventListener('zoomstart', mapZoomStart)
        // map.removeEventListener('zoomend', mapZoomEnd)
      }
    }
  }, [])
  // useEffect(()=>{
  //   vectorArrRef.current.forEach((elem: L.Circle) => {
  //     map.removeLayer(elem)
  //   })
  //   markerArrRef.current.forEach((elem:L.Marker) => {
  //     map.removeLayer(elem)
  //   })
  //   setPopupVisible(false)
  // },[selectindex])
  useEffect(() => {
    if (!selected) {
      vectorArrRef.current.forEach((elem: L.Circle) => {
        map.removeLayer(elem)
      })
      markerArrRef.current.forEach((elem: L.Marker) => {
        map.removeLayer(elem)
      })
      setPopupVisible(false)
    }
  },[selected])
  useEffect(() => {
    vectorArrRef.current.forEach((elem: L.Circle) => {
      map.removeLayer(elem)
    })
    markerArrRef.current.forEach((elem: L.Marker) => {
      map.removeLayer(elem)
    })
    renderVector()
  }, [vectorData, vectorData[0]?.clickindex])

  // useEffect(() => {
  //   if (activeIndex !== '' && vectorArrRef.current.length) {
  //     if (map.getZoom() < scaleZoom) {
  //       map.setZoom(scaleZoom)
  //     }
  //     setTimeout(() => {
  //       if (vectorArrRef.current.length > parseInt(activeIndex)) {
  //         map.fitBounds(vectorArrRef.current[activeIndex].getBounds())
  //       } else {
  //         if (vectorArrRef.current.length) {
  //           map.fitBounds(vectorArrRef.current[0].getBounds())
  //         }
  //       }
  //     }, 500)
  //   }
  // }, [activeIndex])

  // useEffect(() => {
  //   if (map) {
  //     map.addEventListener('zoomstart', mapZoomStart)

  //     map.addEventListener('zoomend', mapZoomEnd)
  //   }
  // }, [map])

  useEffect(() => {
    // console.log('clickIndex', clickIndex)
    cancelMarkerSelected()
    // console.log(clickIndex !== null && gData.current.markers.length);
    // if (clickIndex !== null && gData.current.markers.length) {
    //   showImageWindow(clickIndex)
    // }
    if (clickIndex >= 0) {
      showImageWindow(clickIndex)
    }
  }, [clickIndex, vectorArr])

  //打开
  const showImageWindow = (i: number) => {
    // if (gData.current.infoWindow) {
    //   map.removeLayer(gData.current.infoWindow)
    // }

    let _marker = markerArrRef.current[i]
    // let _vector=vectorArrRef.current[0]
    if (!_marker) {
      return
    }
    // const iconSizeItem = `${_marker['htmlIndex']}`.length >= 3 ? 30 : 24
    _marker.setIcon(L.divIcon({
      className: 'marker-usually selected',
      // html: gData.current.range.start + _marker['index'],
      html: _marker['htmlIndex'],
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    }))
    selectedMarker.current = _marker
    // console.log(_marker,12313);
    // _marker.on('click',()=>{
    //   console.log(123);
    //   // setPopupContent(contentCb?.() || null)
    //   // setPopupData(_marker['_latlng'])
    //   setClickIndex(1)
    // })
    // if(_vector){      
    //   map.fitBounds(_vector.getBounds())
    // }
    // else 
    if (_marker) {
      map.panTo(_marker['_latlng'])
    }
    setPopupContent(contentCb({targetImage:_marker['value'].targetImage,text:_marker['value'].text,captureTime:_marker['value'].captureTime,infoId:_marker['value'].infoId}) || null)
    setPopupData(_marker['_latlng'])
    // if (gData.current.showImage) {
    setPopupVisible(true)
    // }
  }

  // 取消点位选中效果
  const cancelMarkerSelected = () => {
    // 关闭popup
    setPopupVisible(false)
    // setClickIndex(-1)
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


  // const mapZoomStart = (e: any) => {
  //   zoomStart.current = map.getZoom()
  // }

  // const mapZoomEnd = (e: any) => {
  //   zoomEnd.current = map.getZoom()
  //   if (zoomStart.current >= parseInt(scaleZoom) && zoomEnd.current < parseInt(scaleZoom)) {   // 由可见到不可见，工具、图例隐藏，去掉点位
  //     vectorArrRef.current.forEach((elem: any) => {
  //       map.removeLayer(elem)
  //     })
  //     markerArrRef.current.forEach((elem: any) => {
  //       map.removeLayer(elem)
  //     })
  //   } else if (zoomStart.current < parseInt(scaleZoom) && zoomEnd.current >= parseInt(scaleZoom)) {   // 由不可见到可见，工具、图例显示，加载点位
  //     vectorArrRef.current.forEach((elem: any) => {
  //       map.addLayer(elem)
  //     })
  //     markerArrRef.current.forEach((elem: any) => {
  //       map.addLayer(elem)
  //     })
  //   }
  // }

  return (
    <CustomPopupBox
      visible={popupVisible}
      popupData={popupData}
      map={map}
      onCancel={() => {
        cancelMarkerSelected()
        // console.log(11);
        setClickIndex(-1)

      }}
    >
      <div>{popupContent}</div>
    </CustomPopupBox>
  )
}

export default Vector
