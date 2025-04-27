import React, { useState, useEffect, useRef, useContext } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from "@/assets/images/map/br-marker.png"
import { CustomPopupBox } from '@/components'
import { MarkerProps, VehicleLocusAnalysisLocation } from './interface'
import { CurContext } from './context'

function Marker(props: MarkerProps) {
  const map = props['__map__'] as L.Map

  const {
    data = [],
    contentCb,
  } = props
  const {
    curIndex,
    onCurIndex
  } = useContext(CurContext)
  const [markerArr, setMarkerArr] = useState<L.Marker[]>([])
  const markerArrRef = useRef<any>(null)//存储标记
  markerArrRef.current = markerArr
  const [popupData, setPopupData] = useState({ lat: 0, lng: 0 })
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null)

  const addMarker = () => {
    let _marker: L.Marker[] = []
    data.forEach((elem: VehicleLocusAnalysisLocation, index: number) => {
      let icon = L.icon({
        iconUrl: markerIcon,
        iconSize: [45, 50],
        iconAnchor: [22, 50],
        tooltipAnchor: [10, -22],
      })
      if (parseFloat(elem.lngLat.lat) && parseFloat(elem.lngLat.lng)) {
        let marker = L.marker([parseFloat(elem.lngLat.lat), parseFloat(elem.lngLat.lng)], { icon: icon }).bindTooltip(elem.locationName)
        marker['value'] = elem
        marker.on('click', () => {
          map.setView(marker['_latlng'])
          onCurIndex?.(index)
        })
        _marker.push(marker)
      }

    })
    _marker.forEach((elem: L.Marker) => {
      map.addLayer(elem)
    })
    setMarkerArr(_marker)
    markerArrRef.current = _marker

    if (_marker.filter(i => !!i).length) {
      map.fitBounds(L.featureGroup(_marker.filter(i => !!i)).getBounds())
    }
  }

  useEffect(() => {
    markerArr.forEach(elem => {
      if (elem) {
        map.removeLayer(elem)
      }
    })
    if (data.length) {
      addMarker()
    }
  }, [data])

  useEffect(() => {
    setPopupVisible(false)
    if (curIndex > -1 && markerArr.length) {
      showImageWindow(curIndex)
      //点击的点位选中
    }
  }, [curIndex])


  //打开
  const showImageWindow = (i: number) => {
    let _marker
    if (data[i] && data[i].lngLat.lat && data[i].lngLat.lng) {
      _marker = markerArrRef.current.find((item:any) => item['value'].locationId === data[i].locationId)
    }
    // let _marker = markerArrRef.current[i]
    if (!_marker) {
      return
    }
    if (_marker) {
      map.setView(_marker['_latlng'])
    }
    setPopupContent(contentCb({ bigImage: _marker['value'].bigImage, text: _marker['value'].locationName, captureTime: _marker['value'].captureTime, count: _marker['value'].count }) || null)
    setPopupData(_marker['_latlng'])
    setPopupVisible(true)
  }

  return (
    <CustomPopupBox
      visible={popupVisible}
      popupData={popupData}
      piany={60}
      map={map}
      onCancel={() => {
        setPopupVisible(false)
        onCurIndex?.(-1)
      }}
    >
      <div>{popupContent}</div>
    </CustomPopupBox>
  )
}

export default Marker
