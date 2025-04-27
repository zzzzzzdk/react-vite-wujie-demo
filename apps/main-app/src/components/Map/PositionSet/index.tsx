import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Message, Input, Form } from '@yisa/webui'
import { InfoCircleFilled } from '@yisa/webui/es/Icon'
import PositionSetModalProps, { lngLatType } from "./interface";
import { BaseMap, TileLayer, Marker, ViewCenter } from '@yisa/yisa-map'
import { isFunction, getMapProps, isObject } from '@/utils'
import { LeafletEvent } from "leaflet";
import markerIcon from "@/assets/images/map/br-marker.png"
import L from 'leaflet'
import "./index.scss"
import { useResetState, useDebounce } from "ahooks";

const PositionSetModal = (props: PositionSetModalProps) => {
  const {
    modalProps,
    onModalConfirm
  } = props
  const {
    center = [],
  } = window.YISACONF?.map || {}

  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps('positionSetMap')
  }, [])

  const [stateLatLng, setStateLatLng, resetLatlng] = useResetState<lngLatType>(props.data && isObject(props.data) && props.data.lng && props.data.lat ? props.data : {
    lat: center[1],
    lng: center[0]
  })
  const lngLatValue = useDebounce(stateLatLng, { wait: 300 })

  const [viewCenter, setViewCenter] = useState([[stateLatLng.lat, stateLatLng.lng]])

  useEffect(() => {
    let obj = props.data && isObject(props.data) && props.data.lng && props.data.lat ? props.data : {
      lat: center[1],
      lng: center[0]
    }
    setStateLatLng(obj)
    setViewCenter([[obj.lat, obj.lng]])
  }, [JSON.stringify(props.data)])

  const markerOptions = useMemo(() => {
    return {
      markerOptions: {
        // id: '37002',
        draggable: true,
        icon: L.icon({
          iconUrl: markerIcon,
          iconSize: [45, 50],
          iconAnchor: [22, 50],
          tooltipAnchor: [10, -22]
        })
      },
      onMove: (e: LeafletEvent) => {
        const newLatlng = {
          lng: (e.target?.getLatLng()?.lng || '').toFixed(6),
          lat: (e.target?.getLatLng()?.lat || '').toFixed(6),
        }
        setStateLatLng(newLatlng)
      },
      ...lngLatValue
    }
  }, [lngLatValue])

  const handleChange = (e: any, type: 'lng' | 'lat') => {
    if (type === 'lng') {
      setStateLatLng({
        lat: stateLatLng.lat || 0,
        lng: e.target.value
      })
    } else {
      setStateLatLng({
        lng: stateLatLng.lng || 0,
        lat: e.target.value
      })
    }
  }

  const handleChangeBlur = (e: any, type: 'lng' | 'lat') => {
    let _latLng = { lng: 0, lat: 0 }
    let value = e.target.value
    if (type === 'lng') {
      if (value && parseFloat(value) >= -180 && parseFloat(value) <= 180) {
        _latLng = {
          lat: stateLatLng.lat || 0,
          lng: parseFloat(value)
        }
        setStateLatLng(_latLng)

      } else {
        Message.warning('请填写有效的经度')
      }
    } else {
      if (value && parseFloat(value) >= -90 && parseFloat(value) <= 90) {
        _latLng = {
          lng: stateLatLng.lng || 0,
          lat: parseFloat(value)
        }
        setStateLatLng(_latLng)
      } else {
        Message.warning('请填写有效的纬度')
      }
    }
    setViewCenter([[_latLng.lat, _latLng.lng]])
  }

  const handleOk = () => {
    if (onModalConfirm && isFunction(onModalConfirm)) {
      onModalConfirm(stateLatLng)
    }
    // resetLatlng()
  }

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
    // resetLatlng()
  }

  useEffect(() => {
  }, [])

  return (
    <Modal
      title="请点击地图选择经纬度"
      {...(modalProps || {})}
      className="position-set-modal"
      footer={<>
        <div><InfoCircleFilled />在地图上拖拽点位标记经纬度</div>
        <div>
          <Button onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleOk} type="primary">
            确定
          </Button>
        </div>
      </>}
    >
      <div className="latlng-box">
        <Form colon={false}>
          <Form.Item label="经度">
            <Input value={stateLatLng.lng + ''} onChange={e => handleChange(e, 'lng')} onBlur={e => handleChangeBlur(e, 'lng')} />
          </Form.Item>
          <Form.Item label="维度">
            <Input value={stateLatLng.lat + ''} onChange={e => handleChange(e, 'lat')} onBlur={e => handleChangeBlur(e, 'lat')} />
          </Form.Item>
        </Form>
      </div>
      <BaseMap {...mapProps}>
        <TileLayer {...tileLayerProps} />
        <Marker {...markerOptions} />
        <ViewCenter latLngs={viewCenter} zoom={16} />
      </BaseMap>
    </Modal>
  )
}

export default PositionSetModal