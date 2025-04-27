import React, { useEffect } from 'react'
import { Space, Image } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import cn from 'classnames'
import { jumpRecordVehicle } from '@/utils'
import { ImgInfoCardType } from './interface'
import { CopyToClipboard } from '@/components'
import { validatePlate } from '@/utils'
import './index.scss'

export default function ImgInfoCard(props: ImgInfoCardType) {
  const {
    type = "cardInfo",
    data,
    onLocationClick = () => { },
    onTrackCardClick = () => { },
    trackIndex,
    sign,
    active
  } = props
  const prefixCls = "img-info-card"

  useEffect(() => {
    document.querySelector(".track-info-content.active")?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  })

  return (<div className={cn(`${prefixCls}`)}>
    {
      type === "cardInfo" && <div className="target-info-content">
        <Space size={5} direction="vertical">
          <Space size={5} direction="horizontal" className="gap-flex">
            <div className="target-info-item">
              <div className="label">前端识别</div>:
              {
                validatePlate(data.licensePlate1) ?
                  <a target="_blank"
                    href={jumpRecordVehicle(data.licensePlate1, data.plateColorTypeId2)}
                    className="con">
                    {data.licensePlate1}
                  </a>
                  :
                  <div className="con plate-active">{data.licensePlate1}</div>
              }
            </div>
            <div className="target-info-item">
              <div className="label">二次识别</div>:
              {
                data.licensePlate2 !== "未识别" ?
                  <>
                    <a target="_blank"
                      href={jumpRecordVehicle(data.licensePlate2, data.plateColorTypeId2)}
                      className={`plate-bg plate-color-${data.plateColorTypeId2}`}
                    >
                      {data.licensePlate2}
                    </a>
                    <CopyToClipboard text={data.licensePlate2} />
                  </>
                  :
                  <div className={`plate-bg plate-color-8`}></div>
              }
              {/* <div className={`plate-bg plate-color-${!validatePlate(data.licensePlate2) ? 8 : data.plateColorTypeId2}`}>{data.licensePlate2}</div> */}
            </div>
          </Space>
          <Space size={5} direction="horizontal" className="gap-flex">
            <div className="target-info-item">
              <div className="label">方向</div>:
              <div className={`con`}>{data.direction || "未知"}</div>
            </div>
          </Space>
          <Space size={5} direction="horizontal" className="gap-flex">
            <div className="target-info-item">
              <div className="label">车型</div>:
              <div className="con" title={data.carInfo}>{data.carInfo}</div>
            </div>
          </Space>
          <Space size={5} direction="horizontal" className="gap-flex">
            <div className="target-info-item">
              <div className="label">时间</div>:
              <div className="con">{data.captureTime || "未知"}</div>
            </div>
          </Space>
          <Space size={5} direction="horizontal" className="gap-flex">
            <div className="target-info-item">
              <div className="label">地点</div>:
              <div
                className="con"
                title={data.locationName}
                onClick={onLocationClick}
              >{data.locationName || '未知'}</div>
            </div>
          </Space>
        </Space>
      </div>
    }
    {
      type === "personInfo" && <div className="person-info-content">
        <Space size={5} direction="vertical">
          <Space size={5} direction="horizontal">
            <div className="person-info-item">
              <span className="person-sign">{sign}</span>
              <div className="person-info">  <Image src={data.targetImage} /></div>
            </div>
          </Space>
          <Space size={5} direction="horizontal">
            <div className="person-info-item">
              <Icon type="xingming" />
              <div className="person-info">{data.name || '-'}</div>
            </div>
          </Space>
          <Space size={5} direction="horizontal">
            <div className="person-info-item">
              <Icon type="zhengjianzhao" />
              <div className="person-info">{data.idcard || '-'}</div>
            </div>
          </Space>
        </Space>
      </div>
    }
    {
      type === "trackInfo" && <div
        className={cn("track-info-content", { "number-gap": trackIndex, active: active })}
        onClick={() => { onTrackCardClick(data) }}
      >
        {trackIndex !== undefined && <div className="index">{trackIndex}</div>}
        {sign && <div className="sign">{sign}</div>}
        <div className="track-info-item">
          <Icon type="shijian" />
          <div className="card-info">{data.captureTime || '-'}</div>
        </div>
        <div className="track-info-item">
          <Icon type="didian" />
          <div className="card-info">{data.locationName || '-'}</div>
        </div>
      </div>
    }
  </div>)

}


