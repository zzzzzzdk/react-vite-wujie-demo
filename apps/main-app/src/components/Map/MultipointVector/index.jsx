import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function MultipointVector(props) {
  const map = props.__map__
  const {
    vectorData = [],
    scaleZoom = YISACONF.map.scaleZoom,
    activeIndex = '',
    fitBounds = true
  } = props

  const zoomStart = useRef(), zoomEnd = useRef()
  const [vectorArr, setVectorArr] = useState([])
  const vectorArrRef = useRef()
  vectorArrRef.current = vectorArr
  const [markerArr, setMarkerArr] = useState([])
  const markerArrRef = useRef()
  markerArrRef.current = markerArr

  const getPolygonCenter = (data = []) => {
    if (data.length) {
      let area = 0, x = 0, y = 0
      for (let i = 1; i <= data.length; i++) {
        try {
          let lat = data[i % data.length][0]
          let lng = data[i % data.length][1]
          let lastLat = data[i - 1][0]
          let lastLng = data[i - 1][1]
          let temp = (lat * lastLng - lng * lastLat) / 2
          area += temp
          x += (temp * (lat + lastLat)) / 3
          y += (temp * (lng + lastLng)) / 3
        } catch (err) {
          console.log(i, data[i])
        }
      }
      x = x / area
      y = y / area
      return {
        lat: x,
        lng: y
      }
    } else {
      return {
        lat: 0,
        lng: 0
      }
    }
  }

  const renderVector = () => {
    let vectors = [], markers = []
    vectorData.forEach(elem => {
      let vector, marker, color = elem.color ? elem.color : '#65EAFF'
      if (elem.type == 'circle') {
        if (!elem.center || !elem.radius) {
          console.warn('缺少圆心或半径')
          return
        }
        vector = L.circle(elem.center, { radius: elem.radius, color: color, fillColor: color, fillOpacity: 0.3 })
        if (elem.innerHtml) {
          let icon = L.divIcon({ html: elem.innerHtml })
          marker = L.marker(elem.center, { icon: icon })
        }
      } else if (elem.type == 'rectangle') {
        if (!elem.northEast || !elem.southWest) {
          console.warn('缺少对角')
          return false
        }
        vector = L.rectangle([elem.northEast, elem.southWest], { color: color, fillColor: color, fillOpacity: 0.3 })
        if (elem.innerHtml) {
          let icon = L.divIcon({ html: elem.innerHtml })
          let center = L.latLng((parseFloat(elem.northEast.lat) + parseFloat(elem.southWest.lat)) / 2, (parseFloat(elem.northEast.lng) + parseFloat(elem.southWest.lng)) / 2)
          marker = L.marker(center, { icon: icon })
        }
      } else if (elem.type == 'polygon') {
        if (!elem.latLngs.length) {
          console.warn('多边形缺少点位')
          return false
        }
        if (elem.latLngs.length < 4) {
          console.warn('多边形点位太少')
          return false
        }
        vector = L.polygon(elem.latLngs, { color: color, fillColor: color, fillOpacity: 0.3 })
        if (elem.innerHtml) {
          let icon = L.divIcon({ html: elem.innerHtml }), center = getPolygonCenter(elem.latLngs)
          marker = L.marker(center, { icon: icon })
        }
      } else if (elem.type == 'marker') {
        let letter = ['A', 'B']
        elem.markers.forEach((elem, index) => {
          let icon = L.divIcon({ className: 'marker-index', html: letter[index], iconSize: [30, 36], iconAnchor: [15, 36] })
          let marker = L.marker([elem.lat, elem.lng], { icon: icon }).bindTooltip(elem.text)
          markers.push(marker)
        })
        if (elem.markers.length == '1') {
          let center = L.latLng(elem.markers[0].lat, elem.markers[0].lng)
          let r = 500
          vector = L.circle(center, { radius: r, color: '#32a6fb', fillColor: '#32a6fb', opacity: 0.3 })
        } else if (elem.markers.length == '2') {
          let center = L.latLng((parseFloat(elem.markers[0].lat) + parseFloat(elem.markers[1].lat)) / 2, (parseFloat(elem.markers[0].lng) + parseFloat(elem.markers[1].lng)) / 2)
          let r = L.latLng(elem.markers[0].lat, elem.markers[0].lng).distanceTo(L.latLng(elem.markers[1].lat, elem.markers[1].lng)) / 2 * 1.5
          vector = L.circle(center, { radius: r, color: '#32a6fb', fillColor: '#32a6fb', opacity: 0.3 })
        }
      } else {
        console.log('未知图形')
      }
      if (vector) {
        vectors.push(vector)
      }
      if (marker) {
        markers.push(marker)
      }
    })
    if (map.getZoom() >= scaleZoom) {
      vectors.forEach(elem => {
        map.addLayer(elem)
      })
      markers.forEach(elem => {
        map.addLayer(elem)
      })
      if (fitBounds && vectors.length == 1) {
        map.fitBounds(vectors[0].getBounds())
      }
    }
    setVectorArr(vectors)
    vectorArrRef.current = vectors
    setMarkerArr(markers)
  }

  useEffect(() => {
    return () => {
      if (map) {
        vectorArrRef.current.forEach(elem => {
          map.removeLayer(elem)
        })
        markerArrRef.current.forEach(elem => {
          map.removeLayer(elem)
        })
        map.removeEventListener('zoomstart', mapZoomStart)
        map.removeEventListener('zoomend', mapZoomEnd)
      }
    }
  }, [])

  useEffect(() => {
    vectorArrRef.current.forEach(elem => {
      map.removeLayer(elem)
    })
    markerArrRef.current.forEach(elem => {
      map.removeLayer(elem)
    })
    renderVector()
  }, [vectorData])

  useEffect(() => {
    if (activeIndex !== '' && vectorArrRef.current.length) {
      if (map.getZoom() < scaleZoom) {
        map.setZoom(scaleZoom)
      }
    }
    setTimeout(() => {
      if (vectorArrRef.current.length > parseInt(activeIndex)) {
        map.fitBounds(vectorArrRef.current[activeIndex].getBounds())
      } else {
        if (vectorArrRef.current.length) {
          map.fitBounds(vectorArrRef.current[0].getBounds())
        }
      }
    }, 500)
  }, [activeIndex])

  useEffect(() => {
    if (map) {
      map.addEventListener('zoomstart', mapZoomStart)

      map.addEventListener('zoomend', mapZoomEnd)
    }
  }, [map])

  const mapZoomStart = (e) => {
    zoomStart.current = map.getZoom()
  }

  const mapZoomEnd = (e) => {
    zoomEnd.current = map.getZoom()
    if (zoomStart.current >= parseInt(scaleZoom) && zoomEnd.current < parseInt(scaleZoom)) {   // 由可见到不可见，工具、图例隐藏，去掉点位
      vectorArrRef.current.forEach(elem => {
        map.removeLayer(elem)
      })
      markerArrRef.current.forEach(elem => {
        map.removeLayer(elem)
      })
    } else if (zoomStart.current < parseInt(scaleZoom) && zoomEnd.current >= parseInt(scaleZoom)) {   // 由不可见到可见，工具、图例显示，加载点位
      vectorArrRef.current.forEach(elem => {
        map.addLayer(elem)
      })
      markerArrRef.current.forEach(elem => {
        map.addLayer(elem)
      })
    }
  }

  return (
    null
  )
}

export default MultipointVector
