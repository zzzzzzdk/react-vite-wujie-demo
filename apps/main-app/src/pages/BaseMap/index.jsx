import { useMemo } from 'react'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import classNames from 'classnames'
import './index.scss'

function PageMap(props) {

  const {
    params = {},
    onChangePath = () => { }
  } = props



  const mapProps = useMemo(() => {
    return {
      domId: 'homeMap',
      mapOptions: {
        center: [35.965781, 120.205252],
        zoom: 14
      },
      showScale: true
    }
  }, [])

  const tileLayerProps = useMemo(() => {
    return {
      tileUrlTemplate: '{mapTileHost}/_alllayers/{z}/{y}/{x}.png',
      tileLayerOptions: {
        maxZoom: 18,
        minZoom: 5,
        mapTileHost: 'http://192.168.4.149'
      }
    }
  }, [])


  const classes = classNames(
    'page-map',
    "map-title-dark"
  )

  return (
    <div className={classes}>
      <BaseMap {...mapProps}>
        <TileLayer {...tileLayerProps} />
      </BaseMap>
    </div>
  )
}

export default PageMap
