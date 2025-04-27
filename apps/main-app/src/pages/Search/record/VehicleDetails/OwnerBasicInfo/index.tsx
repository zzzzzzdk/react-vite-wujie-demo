import React, { useState, useEffect } from 'react'
import { Popover } from '@yisa/webui'
import { ErrorImage } from '@yisa/webui_business'
import { Panel, Card } from '@/components'
import IllegalList from '../components/IllegalList'
import recordVehicle from '@/config/record-vehicle.json'
import fanpng from '@/assets/images/record/record-vehicle/jiazhao-fan.png'
import zhengpng from '@/assets/images/record/record-vehicle/jiazhao-zheng.png'
import type { OwnerBasicInfoType, VehicleInfoDataType } from '../interface'
import './index.scss'
import RecordDetailNoData from '../components/RecordDetailNoData'


export default function OwnerBasicInfo(props: { data?: OwnerBasicInfoType }) {
  const {
    data
  } = props
  const prefixCls = "owner-basic-info"
  // 动态展示每行数据
  const [listCount, setListCount] = useState(4)
  const { ownerBaseInfo, ownerDriverLicenseZheng, ownerDriverLicenseFan } = recordVehicle
  const { baseInfo = {}, driverLicense = {}, ownerOtherVehicles = [], trafficViolationInfo = [] } = data || {}

  // 渲染车辆卡片
  const handleRenderCard = () => {
    let template = []
    for (let i = 0; i < ownerOtherVehicles.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < ownerOtherVehicles.length) {
          const _cardData = {
            ...ownerOtherVehicles[j],
            plateColor: ownerOtherVehicles[j]?.plateColorTypeId,
            vehicleImage: ownerOtherVehicles[j]?.bigImage,
          }
          _template.push(
            <Card.CarInfo
              key={`${i}${j}`}
              type="recordVehicle"
              cardData={_cardData}
            />
          )
        } else {
          _template.push(<div className="card-item-flex" key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  const handleRenderTableItem = (value: string) => {
    if (value === "phoneNumber") {
      const _phoneNumber = baseInfo[value] as unknown as string[]
      return (<>
        {
          _phoneNumber?.length ? <>
            <span> {_phoneNumber?.slice(0, 2)?.join("；")}</span>
            {_phoneNumber?.length > 2 && <Popover
              getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement || document.body}
              content={<span >{_phoneNumber?.slice(2)?.join("；")}</span>}
            >
              <span className="more">；···</span>
            </Popover>
            }

          </>
            : "--"
        }
      </>)
    } else if (value === "labels") {
      const _labels = baseInfo[value] as unknown as VehicleInfoDataType["labels"]
      return (<ul className="label-item-container">
        {
          !_labels?.length && "--"
        }
        {
          _labels?.slice(0, 2)?.map(item => <li key={item.id} title={item.name} className={`label-item label-item-${item.color}`}>{item.name}</li>)
        }
        {
          _labels?.length > 2 && <Popover
            overlayClassName="label-item-wrapper"
            placement="topRight"
            getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement || document.body}
            content={
              <ul className="label-item-container">
                {
                  _labels?.map(item => <li key={item.id} title={item.name} className={`label-item label-item-${item.color}`}>{item.name}</li>)
                }
              </ul>
            }
          >
            <li className="label-item more">+{(_labels?.length || 3) - 2}</li>
          </Popover>
        }
      </ul>)
    } else {
      return baseInfo[value]
    }
  }

  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 380
      const width = (document.querySelector('.record-vehicle-card-list')?.clientWidth || 0) - 30
      const count = Math.floor(width / itemWidth)
      if (count >= 4 || count <= 2) {
        setListCount(count < 0 ? 1 : count)
      } else {
        const diff = width - itemWidth * count + 18 * (count - 1)
        if (diff >= itemWidth * (count / (count + 1))) {
          setListCount(count + 1)
        } else {
          setListCount(count)
        }
      }
    }
    calcListCount()
    window.addEventListener('resize', calcListCount)

    return () => {
      window.removeEventListener('resize', calcListCount)
    }
  }, [])

  return (
    <div className={`${prefixCls}`}>
      <Panel title="车主基本信息">
        <div className="owner-base-info-content">
          <div className="owner-driving-container">
            <ErrorImage src={baseInfo?.photo || '--'} />
            {/* <div className="owner-driving-text">车主头像</div> */}
          </div>
          <div className="item-table">
            {
              ownerBaseInfo.map(item => <div className="cell" key={item.value}>
                <div className='cell-label'>{item.label}</div>
                <div className='cell-value'>{handleRenderTableItem(item.value) || '--'}</div>
              </div>)
            }
          </div>
        </div>
      </Panel>
      <Panel title="驾驶证信息">
        <div className='driving-license'>
          <div className='zheng'>
            <div className='license-title'>驾驶证正面</div>
            <div className='image zheng'>
              <ErrorImage src={zhengpng} />
              {
                ownerDriverLicenseZheng.map((item, index) => <i className={item.className} key={index}>
                  {driverLicense?.[item.value] || '--'}</i>)
              }
            </div>
          </div>
          <div className='fan'>
            <div className='license-title'>驾驶证反面</div>
            <div className='image fan'>
              <ErrorImage src={fanpng} />
              {
                ownerDriverLicenseFan.map((item, index) => <i className={item.className} key={index}>{driverLicense?.[item.value] || '--'}</i>)
              }
            </div>
          </div>
        </div>
      </Panel>
      <Panel title={<span>车主其他车辆(共<span style={{ color: "var(--primary-color)", margin: "0 3px" }}>{ownerOtherVehicles?.length || 0}</span>辆车)</span>}>
        {
          ownerOtherVehicles?.length ?
            <div className="record-vehicle-card-list">{handleRenderCard()}</div>
            :
            <RecordDetailNoData />
        }
      </Panel>
      <Panel title="人员交通违法记录">
        {
          trafficViolationInfo?.length ?
            <IllegalList data={trafficViolationInfo} />
            :
            <RecordDetailNoData />
        }
      </Panel>
    </div>)
}

