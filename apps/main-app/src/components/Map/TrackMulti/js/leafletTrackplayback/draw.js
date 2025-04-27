import L from 'leaflet'

import {
  TrackLayer
} from './tracklayer'

/**
 * 绘制类
 * 完成轨迹线、轨迹点、目标物的绘制工作
 */
export const Draw = L.Class.extend({
  trackPointOptions: {
    isDraw: false,
    useCanvas: true,
    stroke: false,
    width: 1,
    color: '#ef0300',
    fill: true,
    fillColor: '#ef0300',
    fillOpacity: 1,
    opacity: 0.3,
    radius: 4,
    fillText: false,
    textColor: '#000000',
    markerClickCb: (index) => { },
  },
  trackLineOptions: {
    isDraw: false,
    stroke: true,
    color: '#1C54E2', // stroke color
    weight: 3,
    fill: false,
    fillColor: '#000',
    opacity: 0.3
  },
  targetOptions: {
    useImg: false,
    imgUrl: '../../static/images/ship.png',
    showText: false,
    width: 8,
    height: 18,
    color: '#00f', // stroke color
    fillColor: '#9FD12D'
  },
  toolTipOptions: {
    offset: [0, 0],
    direction: 'top',
    permanent: false
  },

  initialize: function (map, options) {
    L.extend(this.trackPointOptions, options.trackPointOptions)
    L.extend(this.trackLineOptions, options.trackLineOptions)
    L.extend(this.targetOptions, options.targetOptions)
    L.extend(this.toolTipOptions, options.toolTipOptions)

    this._showTrackPoint = this.trackPointOptions.isDraw
    this._showTrackLine = this.trackLineOptions.isDraw

    this._map = map
    this._map.on('mousemove', this._onmousemoveEvt, this)

    this._trackLayer = new TrackLayer().addTo(map)
    this._trackLayer.on('update', this._trackLayerUpdate, this)

    this._canvas = this._trackLayer.getContainer()
    this._ctx = this._canvas.getContext('2d')

    this._bufferTracks = []

    if (!this.trackPointOptions.useCanvas) {
      this._trackPointFeatureGroup = L.featureGroup([]).addTo(map)
    }

    // 目标如果使用图片，先加载图片
    if (this.targetOptions.useImg) {
      const img = new Image()
      img.onload = () => {
        this._targetImg = img
      }
      img.onerror = () => {
        throw new Error('img load error!')
      }
      img.src = this.targetOptions.imgUrl
    }

    // 点位选中索引数组，
    this.selectedMarker = null
    // 所有点位，二维数组
    this.markers = []
  },

  update: function () {
    this._trackLayerUpdate()
  },

  drawTrack: function (trackpoints, index = 0) {
    this._bufferTracks.push(trackpoints)
    this._drawTrack(trackpoints, index)
  },

  showTrackPoint: function () {
    this._showTrackPoint = true
    this.update()
  },

  hideTrackPoint: function () {
    this._showTrackPoint = false
    this.update()
  },

  showTrackLine: function () {
    this._showTrackLine = true
    this.update()
  },

  hideTrackLine: function () {
    this._showTrackLine = false
    this.update()
  },

  remove: function () {
    this._bufferTracks = []
    this._trackLayer.off('update', this._trackLayerUpdate, this)
    this._map.off('mousemove', this._onmousemoveEvt, this)
    if (this._map.hasLayer(this._trackLayer)) {
      this._map.removeLayer(this._trackLayer)
    }
    if (this._trackPointFeatureGroup && this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._map.removeLayer(this._trackPointFeatureGroup)
    }
  },

  clear: function () {
    this._clearLayer()
    this._bufferTracks = []
  },

  _trackLayerUpdate: function () {
    if (this._bufferTracks.length) {
      this._clearLayer()
      this._bufferTracks.forEach(function (element, index) {
        this._drawTrack(element, index)
      }.bind(this))


    }

  },

  _onmousemoveEvt: function (e) {
    if (!this._showTrackPoint) {
      return
    }
    let point = e.layerPoint
    if (this._bufferTracks.length) {
      for (let i = 0, leni = this._bufferTracks.length; i < leni; i++) {
        for (let j = 0, len = this._bufferTracks[i].length; j < len; j++) {
          let tpoint = this._getLayerPoint(this._bufferTracks[i][j])
          if (point.distanceTo(tpoint) <= this.trackPointOptions.radius) {
            this._opentoolTip(this._bufferTracks[i][j])
            return
          }
        }
      }
    }
    if (this._tooltip && this._map.hasLayer(this._tooltip)) {
      this._map.removeLayer(this._tooltip)
    }
    this._canvas.style.cursor = 'pointer'
  },

  _opentoolTip: function (trackpoint) {
    if (this._tooltip && this._map.hasLayer(this._tooltip)) {
      this._map.removeLayer(this._tooltip)
    }
    this._canvas.style.cursor = 'default'
    let latlng = L.latLng(Number(trackpoint.lat), Number(trackpoint.lng))
    let tooltip = this._tooltip = L.tooltip(this.toolTipOptions)
    tooltip.setLatLng(latlng)
    tooltip.addTo(this._map)
    tooltip.setContent(this._getTooltipText(trackpoint))
  },

  _drawTrack: function (trackpoints, index) {
    // 画轨迹线
    if (this._showTrackLine) {
      this._drawTrackLine(trackpoints)
    }
    // 画船
    let targetPoint = trackpoints[trackpoints.length - 1]
    if (this.targetOptions.useImg && this._targetImg) {
      this._drawShipImage(targetPoint)
    } else {
      this._drawShipCanvas(targetPoint)
    }
    // 画标注信息
    if (this.targetOptions.showText) {
      this._drawtxt(`航向：${parseInt(targetPoint.dir)}度`, targetPoint)
    }
    // 画经过的轨迹点
    if (this._showTrackPoint) {
      if (this.trackPointOptions.useCanvas) {
        this._drawTrackPointsCanvas(trackpoints)
      } else {
        this._drawTrackPointsSvg(trackpoints, index)
      }
    }
  },

  _drawTrackLine: function (trackpoints) {
    let options = this.trackLineOptions
    let tp0 = this._getLayerPoint(trackpoints[0])
    this._ctx.save()
    this._ctx.beginPath()
    // 画轨迹线
    this._ctx.moveTo(tp0.x, tp0.y)
    for (let i = 1, len = trackpoints.length; i < len; i++) {
      let tpi = this._getLayerPoint(trackpoints[i])
      this._ctx.lineTo(tpi.x, tpi.y)
    }
    this._ctx.globalAlpha = options.opacity
    if (options.stroke) {
      this._ctx.strokeStyle = options.color
      this._ctx.lineWidth = options.weight
      this._ctx.stroke()
    }
    if (options.fill) {
      this._ctx.fillStyle = options.fillColor
      this._ctx.fill()
    }
    this._ctx.restore()
  },

  _drawTrackPointsCanvas: function (trackpoints) {
    let options = this.trackPointOptions
    this._ctx.save()
    for (let i = 0, len = trackpoints.length; i < len; i++) {
      if (trackpoints[i].isOrigin) {
        let latLng = L.latLng(Number(trackpoints[i].lat), Number(trackpoints[i].lng))
        let radius = options.radius
        let point = this._map.latLngToLayerPoint(latLng)
        this._ctx.beginPath()
        this._ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false)
        this._ctx.globalAlpha = options.opacity
        if (options.stroke) {
          this._ctx.strokeStyle = options.color
          this._ctx.lineWidth = options.width
          this._ctx.stroke()
        }
        if (options.fill) {
          this._ctx.fillStyle = options.fillColor
          this._ctx.fill()
        }
        if (options.fillText) {
          console.log('options.fillText', options.fillText)
          this._ctx.font = "10px Arial";
          this._ctx.fillStyle = options.textColor
          this._ctx.textAlign = "center"
          // this._ctx.fillText('111', options.radius + options.width, options.radius + options.width)
          this._ctx.fillText(trackpoints[i].index || (i + 1), point.x, point.y + (options.width))
        }
      }
    }
    this._ctx.restore()
  },

  // 画点通过div
  _drawTrackPointsSvg: function (trackpoints, index) {
    let options = this.trackPointOptions
    const _this = this
    for (let i = 0, len = trackpoints.length; i < len; i++) {
      if (trackpoints[i].isOrigin) {
        let latLng = L.latLng(Number(trackpoints[i].lat), Number(trackpoints[i].lng))
        // let cricleMarker = L.circleMarker(latLng, this.trackPointOptions)
        // cricleMarker.bindTooltip(this._getTooltipText(trackpoints[i]), this.toolTipOptions)
        // this._trackPointFeatureGroup.addLayer(cricleMarker)

        let iconSizeItem = (options.radius + options.width) * 2
        let icon = L.divIcon({
          className: "marker-usually",
          html: trackpoints[i].htmlIndex || (i + 1),
          iconSize: [iconSizeItem, iconSizeItem],
          iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
        })

        // 重新生成选中点样式
        if (this.selectedMarker) {
          const selectedValuee = this.selectedMarker.value
          if (
            selectedValuee.lng === trackpoints[i].lng &&
            selectedValuee.lat === trackpoints[i].lat &&
            selectedValuee.time === trackpoints[i].time
          ) {
            icon = L.divIcon({
              className: "marker-usually selected",
              html: trackpoints[i].htmlIndex || (i + 1),
              iconSize: [iconSizeItem, iconSizeItem],
              iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
            })
          }
          console.log(this.selectedMarker)
        }
        let divMarker = L.marker(latLng, {
          icon: icon,
          // zIndexOffset: zIndex
        })
        divMarker['index'] = index
        divMarker['htmlIndex'] = trackpoints[i].htmlIndex || (i + 1)
        divMarker['value'] = trackpoints[i]
        divMarker.addEventListener('click', function () {
          if (options.markerClickCb) {
            options.markerClickCb(i)
          }
          _this.markerSelected(index, i)
        })
        this._trackPointFeatureGroup.addLayer(divMarker)
        if (this.markers[index]) {
          this.markers[index].push(divMarker)
        } else {
          this.markers[index] = [divMarker]
        }
        // console.log(this.markers)
      }
    }
  },

  // 选中点位
  markerSelected: function (i, j) {
    // console.log(this._trackPointFeatureGroup)
    let options = this.trackPointOptions
    const currentMarker = this.markers[i][j]
    if (currentMarker) {
      let iconSizeItem = (options.radius + options.width) * 2
      currentMarker.setIcon(L.divIcon({
        className: currentMarker.options.icon?.options.className + ' selected',
        // html: gData.current.range.start + _marker['index'],
        html: currentMarker['htmlIndex'] || (j + 1),
        iconSize: [iconSizeItem, iconSizeItem],
        iconAnchor: [iconSizeItem / 2, iconSizeItem / 2]
      }))

      this.selectedMarker = currentMarker
    }
  },

  // 取消点位选中
  cancelMarkerSelected: function () {

  },

  _drawtxt: function (text, trackpoint) {
    let point = this._getLayerPoint(trackpoint)
    this._ctx.save()
    this._ctx.font = '12px Verdana'
    this._ctx.fillStyle = '#000'
    this._ctx.textAlign = 'center'
    this._ctx.textBaseline = 'bottom'
    this._ctx.fillText(text, point.x, point.y - 12, 200)
    this._ctx.restore()
  },

  _drawShipCanvas: function (trackpoint) {
    let point = this._getLayerPoint(trackpoint)
    let rotate = trackpoint.dir || 0
    let w = this.targetOptions.width
    let h = this.targetOptions.height
    let dh = h / 3

    this._ctx.save()
    this._ctx.fillStyle = this.targetOptions.fillColor
    this._ctx.strokeStyle = this.targetOptions.color
    this._ctx.translate(point.x, point.y)
    this._ctx.rotate((Math.PI / 180) * rotate)
    this._ctx.beginPath()
    this._ctx.moveTo(0, 0 - h / 2)
    this._ctx.lineTo(0 - w / 2, 0 - h / 2 + dh)
    this._ctx.lineTo(0 - w / 2, 0 + h / 2)
    this._ctx.lineTo(0 + w / 2, 0 + h / 2)
    this._ctx.lineTo(0 + w / 2, 0 - h / 2 + dh)
    this._ctx.closePath()
    this._ctx.fill()
    this._ctx.stroke()
    this._ctx.restore()
  },

  _drawShipImage: function (trackpoint) {
    let point = this._getLayerPoint(trackpoint)
    let dir = trackpoint.dir || 0
    let width = this.targetOptions.width
    let height = this.targetOptions.height
    let offset = {
      x: width / 2,
      y: height / 2
    }
    this._ctx.save()
    this._ctx.translate(point.x, point.y)
    this._ctx.rotate((Math.PI / 180) * dir)
    this._ctx.drawImage(this._targetImg, 0 - offset.x, 0 - offset.y, width, height)
    this._ctx.restore()
  },

  _getTooltipText: function (targetobj) {
    let content = []
    content.push('<table>')
    if (targetobj.info && targetobj.info.length) {
      for (let i = 0, len = targetobj.info.length; i < len; i++) {
        content.push('<tr>')
        content.push('<td>' + targetobj.info[i].key + '</td>')
        content.push('<td>' + targetobj.info[i].value + '</td>')
        content.push('</tr>')
      }
    }
    content.push('</table>')
    content = content.join('')
    return content
  },

  _clearLayer: function () {
    let bounds = this._trackLayer.getBounds()
    if (bounds) {
      let size = bounds.getSize()
      this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y)
    } else {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    }
    if (this._trackPointFeatureGroup && this._map.hasLayer(this._trackPointFeatureGroup)) {
      this._trackPointFeatureGroup.clearLayers()
    }
    this.markers = []
  },

  _getLayerPoint(trackpoint) {
    return this._map.latLngToLayerPoint(L.latLng(Number(trackpoint.lat), Number(trackpoint.lng)))
  }
})

export const draw = function (map, options) {
  return new Draw(map, options)
}
