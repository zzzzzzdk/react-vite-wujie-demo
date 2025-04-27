import React, { useState, useEffect, useRef } from 'react'
import { Modal } from '@yisa/webui'
import MapAroundPointProps from '../MapAroundPoint/interface'
import MapAroundPoint from '../MapAroundPoint'
import { rangeOptions } from '../MapAroundPoint'
import './index.scss'

export default function DoubleMapAroundPoint(props: MapAroundPointProps) {

  const prefixCls = "double-map-around-point"
  const [visible, setVisible] = useState(false)
  const [locationIds, setLocationIds] = useState<string[]>([])
  const [viewCenterZoom, setViewCenterZoom] = useState(rangeOptions[0].defaultZoom)
  const [rangeOption, setRangeOption] = useState(rangeOptions[0].key)
  const handleModalCancel = () => {
    setVisible(false)
    setLocationIds([])
    setViewCenterZoom(rangeOptions[0].defaultZoom)
    setRangeOption(rangeOptions[0].key)
  }
  return (
    <div className={`${prefixCls}`}>
      <MapAroundPoint
        {...props}
        showCheckTarget={true}
        onCheckTargetClick={() => {
          setVisible(true)
        }}
        checkedLocationIds={locationIds}
        onChangecheckedLocationIds={(data) => { setLocationIds(data) }}
        viewCenterZoom={viewCenterZoom}
        onViewCenterZoomChange={(zoom) => {
          setViewCenterZoom(zoom)
        }}
        rangeOption={rangeOption}
        onRangeOptionChange={setRangeOption}
      />
      <Modal
        title="查找附近目标"
        footer={null}
        visible={visible}
        onCancel={handleModalCancel}
        maskStyle={{ zIndex: 2022 }}
        wrapClassName={`${prefixCls}-modal`}
        width={"95vw"}
        alignCenter
        unmountOnExit
      >
        <MapAroundPoint
          {...props}
          id={`modelMapAroundPoint-${props.locationId}`}
          showCheckBox
          showDrawTools
          checkedLocationIds={locationIds}
          onChangecheckedLocationIds={(data) => { setLocationIds(data) }}
          viewCenterZoom={viewCenterZoom}
          onViewCenterZoomChange={(zoom) => { setViewCenterZoom(zoom) }}
          rangeOption={rangeOption}
          onRangeOptionChange={setRangeOption}
        />
      </Modal>
    </div>
  )
}

