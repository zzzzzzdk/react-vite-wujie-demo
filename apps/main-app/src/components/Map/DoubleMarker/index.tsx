import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FootholdVectorProps } from './interface'
import { ViewCenter } from '@yisa/yisa-map'
// import { GDataType } from '../Map/Track/interface'
// import { Markers, VectorArr, VectorProps } from './interface'
// eslint-disable-next-line react-hooks/rules-of-hooks


function DoubleMarker(props: FootholdVectorProps) {

  const map = props['__map__'] as L.Map
  const {
    footholdarr,
    lat,
    lng
  } = props
  // 自定义popup弹框相关变量
  // const zoomStart = useRef<any>(null), zoomEnd = useRef<any>(null)
  const [vectorArr, setVectorArr] = useState<L.Circle[]>([])
  const vectorArrRef = useRef<any>(null)//存储圈
  vectorArrRef.current = vectorArr
  const [markerArr, setMarkerArr] = useState<L.Marker[]>([])
  const markerArrRef = useRef<any>(null)//存储标记
  markerArrRef.current = markerArr


  const renderVector = () => {
    let vectors: L.Circle[] = [], markers: L.Marker[] = []
    // let vector, marker
    let letter = ['A', 'B']
    footholdarr.data?.forEach((elem: any, index: number) => {
      if (elem.lat == 0 || elem.lng == 0) {
        return
      }
      let icon = L.divIcon()
      if (elem.lat === lat && elem.lng === lng) {
        icon = L.divIcon({ className: 'marker-usually selected', html: letter[index], iconSize: [24, 24], iconAnchor: [12, 12] })
      } else {
        icon = L.divIcon({ className: 'marker-usually', html: letter[index], iconSize: [24, 24], iconAnchor: [12, 12] })
      }

      let marker = L.marker([elem.lat, elem.lng], { icon: icon }).bindTooltip(elem.locationName)
      markers.push(marker)
    })
    if (footholdarr.data.length === 2 && footholdarr.type === 'foothold') {
      let center = L.latLng((Number(footholdarr.data[0].lat) + Number(footholdarr.data[1].lat)) / 2, (Number(footholdarr.data[0].lng) + Number(footholdarr.data[1].lng)) / 2)
      let r = L.latLng(Number(footholdarr.data[0].lat), Number(footholdarr.data[0].lng)).distanceTo(L.latLng(Number(footholdarr.data[1].lat), Number(footholdarr.data[1].lng))) / 2
      let vector = L.circle(center, { radius: r, color: '#3377FF', weight: 1.5 })
      vectors.push(vector)
    }
    vectors.forEach((elem: L.Circle) => {
      map.addLayer(elem)
    })
    markers.forEach((elem: L.Marker) => {
      map.addLayer(elem)
    })
    // }
    setVectorArr(vectors)
    vectorArrRef.current = vectors
    markerArrRef.current = markers
    setMarkerArr(markers)
    // if (lat && lng) {
    //   map.panTo([Number(lat), Number(lng)])
    // }
    // 
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
      }
    }
  }, [])

  useEffect(() => {
    vectorArrRef.current.forEach((elem: L.Circle) => {
      map.removeLayer(elem)
    })
    markerArrRef.current.forEach((elem: L.Marker) => {
      map.removeLayer(elem)
    })

    setTimeout(() => {
      renderVector()
    }, 100)
  }, [footholdarr])

  return (
    <></>
  )
}

export default DoubleMarker
