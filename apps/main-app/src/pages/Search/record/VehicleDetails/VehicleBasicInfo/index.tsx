import React from 'react'
import { Panel } from '@/components'
import { ErrorImage } from '@yisa/webui_business'
import IllegalList from '../components/IllegalList'
import cn from 'classnames'
import recordVehicle from '@/config/record-vehicle.json'
import type { VehicleBasicInfoType } from '../interface'
import fanpng from '@/assets/images/record/record-vehicle/xingshi-fan.png'
import zhengpng from '@/assets/images/record/record-vehicle/xingshi-zheng.png'
import './index.scss'
import RecordDetailNoData from '../components/RecordDetailNoData'

export default function VehicleBasicInfo(props: { data?: VehicleBasicInfoType }) {
  const {
    data
  } = props
  const prefixCls = "vehicle-basic-info"
  const { registrationInfo: renderRegistrationInfo, physicalCar, physicalTable, drivingLicenseInfoZheng, drivingLicenseInfoFan } = recordVehicle
  const { registrationInfo = {}, physicalFeature = {}, drivingLicenseInfo = {}, trafficViolationInfo = [] } = data || {}
  return (
    <div className={`${prefixCls}`}>
      <Panel title="车辆登记信息">
        <div className="item-table">
          {
            renderRegistrationInfo.map((item, index) => <div className="cell" key={index}>
              <div className='cell-label'>{item.label}</div>
              <div className='cell-value'>{registrationInfo?.[item.value] || '--'}</div>
            </div>)
          }
        </div>
      </Panel>
      <Panel title="车辆物理特征">
        <div className='physics-car'>
          <ErrorImage src={`${window.YISACONF.staticUrl || `/${window.YISACONF.sys}`}/static/images/record-vehicle/${physicalFeature?.vehicleTypeId ?
            `record-vehicle_${physicalFeature?.vehicleTypeId}.png` :
            'record-vehicle_5.png'}`}
          />
          {
            physicalCar.map((item, index) => <span key={index} className={cn(item.className, { "hidden": !physicalFeature?.[item.value] })}>
              {physicalFeature?.[item.value]}
            </span>)
          }
        </div>
        <div className="item-table">
          {
            physicalTable.map((item, index) => <div className="cell" key={index}>
              <div className='cell-label'>{item.label} <span className='yuan'></span></div>
              <div className='cell-value'>{physicalFeature?.[item.value] || '--'}</div>
            </div>)
          }
        </div>
      </Panel>
      <Panel title="行驶证信息">
        <div className='driving-license'>
          <div className='zheng'>
            <div className='license-title'>行驶证正面</div>
            <div className='image zheng'>
              <ErrorImage src={zhengpng} />
              {
                drivingLicenseInfoZheng.map((item, index) => <i className={item.className} key={index}>{drivingLicenseInfo?.[item.value] || '--'}</i>)
              }
            </div>
          </div>
          <div className='fan'>
            <div className='license-title'>行驶证反面</div>
            <div className='image fan'>
              <ErrorImage src={fanpng} />
              {
                drivingLicenseInfoFan.map((item, index) => <i className={item.className} key={index}>{drivingLicenseInfo?.[item.value] || '--'}</i>)
              }
            </div>
          </div>
        </div>
      </Panel>
      <Panel title="车辆交通违法记录">
        {
          trafficViolationInfo?.length ?
            <IllegalList type="owner" data={trafficViolationInfo} />
            :
            <RecordDetailNoData />
        }
      </Panel>
    </div>)
}

