
import { useRef, useMemo, useState } from 'react';
import L, { LatLng } from 'leaflet'
import 'leaflet-polylinedecorator'
import { Draw, MassMarker, Popup } from '@yisa/yisa-map'
import { useEffect } from 'react';
import mapIcon from '@/assets/images/map/br-marker.png'

function AreaMap(props: any) {
  const map = props['__map__'] as L.Map
  const {
    baseColor = '#3377ff',
    isShowArea,
    locationsData = {}
  } = props

  const circleType = {
    // 住宅区域
    "homeLocations": {
      id: "1",
      color: '#3377FF'
    },
    // 工作区域
    "workLocations": {
      id: "2",
      color: '#FF5B4D'
    },
    // 活动区域
    "activityLocations": {
      id: "3",
      color: '#00CC66'
    },
  }

  const [markers, setMarkers]: any = useState([])
  const showDataRef: any = useRef([])
  const circleRef: any = useRef({})

  useEffect(() => {
    // 活动区域\工作区域\住宅区域 点位展示
    let myIcon = L.divIcon({ className: 'map-icon', iconUrl: mapIcon, iconSize: [44, 50], iconAnchor: [20, 35] })
    let markers: any[] = []
    Object.keys(locationsData).forEach((key: string) => {
      // 轨迹
      if (key == 'track') {
        let trackData = locationsData[key] ? locationsData[key] : {}
        let lnglat: any = []
        trackData.path[0].split(';').forEach((i: string) => {
          lnglat.push({
            lat: i.split(',')[1],
            lng: i.split(',')[0],
          })
        })
        console.log(lnglat);
        let polyline = L.polyline(lnglat, { color: baseColor, weight: 8, }).addTo(map)
        let arrow = L['polylineDecorator'](polyline, {
          patterns: [
            { offset: 20, repeat: 20, html: '3', symbol: L['Symbol'].arrowHead({ pixelSize: 5, pathOptions: { fillOpacity: 1, weight: 0, color: '#fff', } }) }
          ]
        }).addTo(map);
        showDataRef.current.push(polyline)
        showDataRef.current.push(arrow)
        trackData.data.forEach((ele: any) => {
          let timeMarker = L.marker([ele.lnglat.lat, ele.lnglat.lng], {
            opacity: 0,
            riseOnHover: true,
            icon: L.divIcon({ html: '' }),
          }).addTo(map);
          timeMarker.bindTooltip(ele.time, {
            // sticky: false,
            permanent: true,
            direction: 'top'
          });
          showDataRef.current.push(timeMarker)
        })
        // locationsData[key] && locationsData[key].forEach((ele: any, index: number) => {
        //   let lnglat: any = []
        //   ele.path[0].split(';').forEach((i: string) => {
        //     lnglat.push({
        //       lat: i.split(',')[1],
        //       lng: i.split(',')[0],
        //     })
        //   })
        //   console.log(lnglat);
        //   let polyline = L.polyline(lnglat, { color: baseColor, weight: 8, }).addTo(map)
        //   // polyline.bindPopup(ele.moveTime).openPopup(lnglat[0]);
        //   let arrow = L['polylineDecorator'](polyline, {
        //     patterns: [
        //       { offset: 20, repeat: 20, html: '3', symbol: L['Symbol'].arrowHead({ pixelSize: 5, pathOptions: { fillOpacity: 1, weight: 0, color: '#fff', } }) }
        //     ]
        //   }).addTo(map);

        //   let timeMarker = L.marker([polyline.getCenter().lat, polyline.getCenter().lng], {
        //     opacity: 0,
        //     riseOnHover: true,
        //     icon: L.divIcon({ html: '' }),
        //   }).addTo(map);
        //   timeMarker.bindTooltip(ele.moveTime, {
        //     offset: L.point(0, index * 20),
        //     // sticky: false,
        //     permanent: true
        //   });
        //   // tooltipLayout.resetMarker(timeMarker);

        //   showDataRef.current.push(polyline)
        //   showDataRef.current.push(timeMarker)
        //   showDataRef.current.push(arrow)
        // })


      } else {
        let lnglatArr: { lat: '', lng: '' }[] = []
        locationsData[key] && locationsData[key].forEach((ele: any, index: number) => {
          const { lngLat, locationName, locationId } = ele
          let { lat, lng } = lngLat
          // 求圆心与半径
          lnglatArr.push(lngLat)
          if (index == locationsData[key].length - 1) {
            let circleInfo: { center: LatLng, type: string, r: number } = getCenter(lnglatArr)
            let circle = L.circle(circleInfo.center, {
              radius: circleInfo.r,
              color: circleType[key].color,
              fillOpacity: 0.3,
              opacity: 0.5
            }).addTo(map)
            map.panTo(lngLat)
            circle.setStyle({
            })
            showDataRef.current.push(circle);
            circleRef.current['area_' + circleType[key].id] = circle
          }
          let marker: any = L.marker([lat, lng], {
            icon: myIcon
          }).bindTooltip(locationName)
          marker.id = locationId;
          marker.lat = lat;
          marker.lng = lng;
          marker.data = {
            text: locationName,
          }
          markers.push(marker)
        })
      }
    })
    setMarkers(markers)
  }, [locationsData])

  // 获取经纬度中心点\半径
  const getCenter = (arr: any) => {
    let center, distance = 0
    let lnglats = arr.map((elem: any) => {
      return L.latLng(elem.lat, elem.lng)
    })
    let bounds = L.latLngBounds(lnglats)
    center = bounds.getCenter()
    distance = L.latLng(bounds.getSouthWest()).distanceTo(L.latLng(bounds.getNorthEast()))
    return {
      type: 'circle',
      center: center,
      r: distance / 2
    }
  }

  useEffect(() => {
    if (circleRef.current.area_1) {
      circleRef.current.area_1.setStyle({
        opacity: isShowArea.area_1 ? 0.5 : 0.1,
        fillOpacity: isShowArea.area_1 ? 0.3 : 0.1,
      })
      circleRef.current.area_2.setStyle({
        opacity: isShowArea.area_2 ? 0.5 : 0.1,
        fillOpacity: isShowArea.area_2 ? 0.3 : 0.1,
      })
      circleRef.current.area_3.setStyle({
        opacity: isShowArea.area_3 ? 0.5 : 0.1,
        fillOpacity: isShowArea.area_3 ? 0.3 : 0.1,
      })
    }
  }, [JSON.stringify(isShowArea)])

  const massMarkerOptions = useMemo(() => {
    return {
      __map__: map,
      data: markers,
      onChangeHoverData: (e: any, data: any) => {
      },
      onChangeClickData: (e: any, data: any[]) => {
      }
    }
  }, [markers])

  useEffect(() => {
    return () => {
      circleRef.current = {}
      showDataRef.current.forEach((ele: any) => {
        map.removeLayer(ele)
      })
    }
  }, [])
  return <MassMarker {...massMarkerOptions} />
}
export default AreaMap