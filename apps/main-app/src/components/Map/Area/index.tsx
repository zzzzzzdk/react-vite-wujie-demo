import React, { useEffect, useState } from 'react'
import L, { circle, Marker, LatLng, Map } from 'leaflet'
import { isObject } from '@/utils'
import MapAreaProps from './interface'
import { GeoJsonObject } from 'geojson'

export const geoJSONColor = {
  '1': '#2dffe9',
  '2': '#ffdc2d',
  '3': '#ff512d',
  '4': '',
  '5': '#ffb300'
}

function Area(props: MapAreaProps) {
  const {
    __map__: map,
    data,
    fitBounds = false,
    areaType = '1',
    errorMessage,
    tooltipText = '',
    stroke = false,
    tooltipOptions
  } = props

  const [showError, setShowError] = useState(false)
  const [areas, setAreas] = useState<L.GeoJSON<any>>()
  const [circleMarker, setCircleMarker] = useState<Marker>()
  // const geoJSONColor = {
  //   '1': '#14CC70',
  //   '2': '#FF9933',
  //   '3': '#FF512D',
  //   '4': '',
  //   '5': ''
  // }


  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      handleRenderArea()
    } else {
      areas && map?.removeLayer(areas)
      circleMarker && circleMarker.remove()
    }

    return () => {
      setShowError(false)
    }
  }, [data])

  useEffect(() => {
    return () => {
      areas && map?.removeLayer(areas)
      circleMarker && circleMarker.remove()
    }
  }, [areas])

  function DrawCirMark(latlng: LatLng, r: number) {
    let icon = L.divIcon({
      className: 'circle-icon',
      html: `<div class="circle-marker">${(r).toFixed(2)}m</div>`,
      iconSize: [62, 24],
      iconAnchor: [31, 12]
    })
    let marker = L.marker(latlng, { icon: icon }).addTo(map as Map)
    setCircleMarker(marker)
  }
  const handleRenderArea = () => {
    areas && map?.removeLayer(areas)
    circleMarker && circleMarker.remove()
    // console.log(JSON.parse(JSON.stringify(data)))
    // let geojsonMarkerOptions = {
    //   radius: 8,
    //   fillColor: "#ff7800",
    //   color: "#000",
    //   weight: 1,
    //   opacity: 1,
    //   fillOpacity: 0.8
    // };
    try {
      const _areas = L.geoJSON(data, {
        // console.log()
        style: () => {
          return {
            color: geoJSONColor[areaType],
            opacity: areaType == '5' ? 0.6 : 1,
            stroke: true,
            fillColor: geoJSONColor[areaType],
            fillOpacity: areaType == '5' ? 0.06 : 0.4
          }
        },
        pointToLayer: function (feature: any, latlng) {
          DrawCirMark(latlng, (feature.radius || 0))
          return L.circle(latlng, {
            radius: feature.radius,
            weight: 1,
          });
        },
        // pointToLayer: function(feature, latlng) {
        //  let icon = L.divIcon({
        //     className: 'circle-icon',
        //     html: `<div class="circle-marker">中心点</div>`,
        //     iconSize: [62,24],
        //     iconAnchor: [31,12]
        //   })
        //   let marker = L.marker(latlng, {icon:icon})
        //   let circle = L.circle(latlng,{
        //     radius:feature.radius,
        //     weight: 1,
        //   });
        //   return L.layerGroup([marker, circle])
        // }

      })
        .bindTooltip(
          (item: any) => {
            if (tooltipText) {
              return tooltipText
            } else {
              const { feature } = item || {}
              const { name } = feature || {}
              return name || ''
            }
          },
          isObject(tooltipOptions) ? tooltipOptions : {}
        )
        .addTo(map as Map)
      setAreas(_areas)
      // if (fitBounds) {
      //   _areas.getBounds() && map?.fitBounds(_areas.getBounds())
      // }
    } catch (err) {
      setShowError(true)
      console.log(err)
    }
  }

  if (errorMessage && showError) {
    return <div className='map-area map-area-error-message'>{errorMessage}</div>
  }

  return null
}

export default Area
