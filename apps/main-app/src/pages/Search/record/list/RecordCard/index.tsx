import { isArray, jumpRecordVehicle } from "@/utils"
import { Tabs, Pagination, Select, Image, Popover, Button, Loading, Message, Checkbox } from "@yisa/webui"
import { color, number } from "echarts"
import type { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import './index.scss'
import React from "react"
interface DriveInfoType { idNumber: string, idType: string, groupId: number[], groupPlateId: number[], name: string }
export interface CardDataType {
  idNumber?: string,
  groupId?: string[],
  groupPlateId?: string[],
  key?: string,
  feature?: string,
  personName?: string,
  imageUrl?: string,
  labels?: { name: string, color: number, id: string }[],
  phone?: string[],
  age?: string,
  sex?: string,
  nation?: string,
  householsAddress?: string,
  residentialAddress?: string,
  carInfo?: { licensePlate: string, plateColor: string }[],
  driveInfo?: { licensePlate: string, plateColor: string }[],
  groupUpdateTime?: string,
  groupCount?: number,
  archivesUpdateTime?: string
  groupPlateCount?: number,
  householdAddress?: string,
  licensePlate?: string, plateColor?: string
  name?: string
  idType?: number
  vehicleCategory?: string,
  vehicleColor?: string,
  identifyVehicleModel?: string
  useVehicel?: string
  drivePerson: DriveInfoType[]
}

interface PropsType {
  cardData: CardDataType,
  cardType: string
  checked?: boolean
  onRecordCardChecked?: (data: CardDataType, checked: boolean) => void
  keywords?: string[];
}
const RecordCard = (props: PropsType) => {
  const {
    cardData,
    cardType = 'person',//卡片类型
    checked,
    onRecordCardChecked = () => { },
    keywords = []
  } = props

  const prefixCls = 'record-lists-card'

  // 跳转详情页
  const handleRecordCardClick = (data: any, type: string = cardType) => {
    if (type == 'person') {
      window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
        idNumber: data.idNumber === '未知' ? '' : data.idNumber,
        idType: data.idType || '111',
        groupId: data.groupId || [],
        groupPlateId: data.groupPlateId || [],
        key: data.key || '',
        feature: data.feature || ''
      }))}`)
    } else {
      window.open(`#/record-detail-vehicle?${encodeURIComponent(JSON.stringify({
        licensePlate: data.licensePlate || '',
        plateColorTypeId: data.plateColor || '-1'
      }))}`)
    }
  }

  const handleCheckBoxChange = (ev: CheckboxChangeEvent) => {
    if (!cardData.idNumber) {
      Message.warning("本档案未实名")
      return
    }

    onRecordCardChecked(cardData, ev.target.checked)

  }
  const handleCheckBoxClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation()
  }

  const highlight = (text: string = '') => {
    // console.log(keywords)
    if (text && keywords && isArray(keywords) && keywords.length) {
      const regex = new RegExp(keywords.map(keyword => `${keyword.trim()}`).join('|'), "gi");
      return <span dangerouslySetInnerHTML={{ __html: text.replace(regex, (match) => `<mark>${match}</mark>`) }}></span>
    }
    return text
  };

  return <div className={`${prefixCls}`} onClick={() => handleRecordCardClick(cardData)} key={cardData.key}>
    {/* {cardType == 'person' && <div className="card-header">{cardData.personName}</div>} */}
    {cardType == 'person' && <div className="card-header-check-box" onClick={handleCheckBoxClick}>
      <Checkbox
        checked={checked}
        onChange={handleCheckBoxChange}
      />
    </div>}
    <div className="card-capture">
      {
        cardData.groupCount ?
          <div className="capture"> 抓拍人脸: <span>{cardData.groupCount}</span>   </div>
          : ''
      }
      {
        cardData.groupPlateCount ?
          <div className="capture"> 车中人脸: <span>{cardData.groupPlateCount}</span>   </div>
          : ''
      }
    </div>
    <div className="card-img">
      <Image src={cardData.imageUrl} />
    </div>
    <div className="card-info">
      {
        cardType == 'person' ?
          <div className="basic-info">
            <div
              className={`person-name`}>{highlight(cardData.personName) || "未知"}
            </div>
            <div className="info-item idNUmber">
              <div className="text">{cardData.idType == 414 ? '护照号' : "身份证号"}:</div>
              <div className="value">{highlight(cardData.idNumber) || '--'}</div>
            </div>
            <div className="info-item info">
              <div className="text">基本信息:</div>
              <div className="value">
                {
                  !cardData.age && !cardData.sex && !cardData.nation
                    ? <span>--</span>
                    : <>
                      <span>{highlight(cardData.sex) || ''}</span>
                      <span>{highlight(cardData.age) || ''}</span>
                      <span>{highlight(cardData.nation) || ''}</span>
                    </>
                }
              </div>
            </div>
            <div className="info-item under-car">
              <div className="text">名下车辆:</div>
              <div className="value">
                {
                  cardData.carInfo && cardData.carInfo.length > 0
                    ? cardData.carInfo.slice(0, 2).map((ele: any) => {
                      return <span className={`plate2-text plate-bg plate-color-${ele?.plateColor}`}
                        key={ele?.licensePlate + ele?.plateColor}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRecordCardClick(ele, 'car')
                        }}
                      >{highlight(ele?.licensePlate)}</span>
                    })
                    : '--'
                }
                {
                  cardData.carInfo && cardData.carInfo?.length > 2 ?
                    <Popover
                      overlayClassName={`${prefixCls}-more-car-popover`}
                      content={<div className="more-car">
                        {
                          cardData.carInfo.map((ele: any) => {
                            return <span className={`plate2-text plate-bg plate-color-${ele.plateColor}`}
                              key={ele?.licensePlate + ele?.plateColor}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRecordCardClick(ele, 'car')
                              }}
                            >{highlight(ele.licensePlate)}</span>
                          })
                        }
                      </div>}
                    >
                      <span className="more">查看更多</span>
                    </Popover>
                    : null
                }
              </div>
            </div>
            <div className="info-item drive-car">
              <div className="text">驾乘车辆:</div>
              <div className="value">
                {
                  cardData.driveInfo && cardData.driveInfo.length > 0
                    ? cardData.driveInfo.slice(0, 2).map((ele: any) => {
                      return <span className={`plate2-text plate-bg plate-color-${ele?.plateColor}`}
                        key={ele?.licensePlate + ele?.plateColor}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRecordCardClick(ele, 'car')
                        }}
                      >
                        {highlight(ele?.licensePlate)}
                      </span>
                    })
                    : '--'
                }
                {
                  cardData.driveInfo && cardData.driveInfo?.length > 2 ?
                    <Popover
                      overlayClassName={`${prefixCls}-more-car-popover`}
                      content={<div className="more-car">
                        {
                          cardData.driveInfo.map((ele: any) => {
                            return <span className={`plate2-text plate-bg plate-color-${ele.plateColor}`}
                              key={ele?.licensePlate + ele?.plateColor}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRecordCardClick(ele, 'car')
                              }}
                            >{highlight(ele.licensePlate)}</span>
                          })
                        }
                      </div>}
                    >
                      <span className="more">查看更多</span>
                    </Popover>
                    : null
                }
              </div>
            </div>
            <div className="info-item tel-phone">
              <div className="text">联系方式:</div>
              <div className="value">
                {
                  cardData.phone && cardData.phone.length
                    ? cardData.phone.slice(0, 4).map((ele: string) => {
                      return <div key={ele} className="tel-item">{ele}；</div>
                    })
                    : '--'
                }
                {
                  cardData.phone && cardData.phone.length > 4 ? <Popover
                    overlayClassName={`${prefixCls}-more-tel-popover`}
                    content={<div className="more-tel">
                      {
                        cardData.phone?.map((ele: string) => {
                          return <div key={ele} className="tel-item">{ele}；</div>
                        })
                      }
                    </div>}
                  >
                    <span className="more">查看更多</span>
                  </Popover>
                    : null
                }
              </div>
            </div>
            <div className="info-item address">
              <div className="text">户籍地址:</div>
              <div className="value" title={cardData.householdAddress}>{highlight(cardData.householdAddress) || '--'}</div>
            </div>
            <div className="info-item address">
              <div className="text">现住址:</div>
              <div className="value" title={cardData.residentialAddress}>{highlight(cardData.residentialAddress) || '--'}</div>
            </div>
          </div>
          :
          <div className="basic-info">
            <a
              target="_blank"
              href={jumpRecordVehicle(cardData.licensePlate || "", cardData.plateColor || "")}
              className={`info-plate plate2-text plate-bg plate-color-${cardData.plateColor}`}>{cardData.licensePlate}
            </a>
            <div className="info-item idNUmber">
              <div className="text">车主信息:</div>
              <div className="value"
                onClick={(e) => {
                  if (!cardData.idNumber) return
                  e.stopPropagation();
                  handleRecordCardClick(cardData, "person")
                }}
              >{highlight(cardData.name) || "未知"}（{highlight(cardData.idNumber) || '--'}）</div>
            </div>
            <div className="info-item">
              <div className="text">车辆类型:</div>
              <div className="value">{highlight(cardData.vehicleCategory) || '--'}</div>
            </div>
            <div className="info-item">
              <div className="text">车辆颜色:</div>
              <div className="value">{cardData.vehicleColor ? ['其他', '花色', '未知'].includes(cardData.vehicleColor) ? cardData.vehicleColor : `${cardData.vehicleColor}色` : '--'}</div>
            </div>
            <div className="info-item drive-car">
              <div className="text">车辆型号:</div>
              <div className="value">{highlight(cardData.identifyVehicleModel) || '--'}</div>
            </div>
            {/* <div className="info-item drive-car">
              <div className="text">使用用途:</div>
              <div className="value">{cardData.useVehicel || '--'}</div>
            </div> */}
            <div className="info-item drive-person">
              <div className="text">驾乘人员:</div>
              <div className="value">
                {
                  cardData.drivePerson && cardData.drivePerson.length ?
                    <div className="drive-item"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRecordCardClick(cardData.drivePerson, 'person')
                      }}>
                      {cardData.drivePerson[0]?.name}-{cardData.drivePerson[0]?.idNumber}
                    </div>
                    : '--'
                }
                {
                  cardData.drivePerson && cardData.drivePerson.length > 1 ?
                    <Popover
                      overlayClassName={`${prefixCls}-more-drive-popover`}
                      content={<div className="more-drive">
                        {
                          cardData.drivePerson.slice(1).map((ele: DriveInfoType) => {
                            return <div className="drive-item" key={ele.idNumber}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRecordCardClick(cardData.drivePerson, 'person')
                              }}>
                              {ele.name}-{ele.idNumber}
                            </div>
                          })
                        }
                      </div>}
                    >
                      <span className="more">查看更多</span>
                    </Popover>
                    : null
                }
              </div>
            </div>
          </div>
      }
      <div className="label-info">
        <div className="info-item label">
          <div className="text">{cardType == 'person' ? '人员标签' : '车辆标签'}:</div>
          <div className="value">
            {
              cardData.labels && cardData.labels.length ? cardData.labels.slice(0, 5).map((ele: any) => {
                return <div className={`label-item label-item-${ele.color}`} key={ele.id} title={ele.name}>{ele.name}</div>
              })
                : '--'
            }
            {
              cardData.labels && cardData.labels?.length > 5 ?
                <Popover
                  overlayClassName={`${prefixCls}-more-label-popover`}
                  content={<div className="more-label">
                    {
                      cardData.labels?.map((ele: any) => {
                        return <div className={`label-item label-item-${ele.color}`} key={ele.id} title={ele.name}>{ele.name}</div>
                      })
                    }
                  </div>}
                >
                  <div className="label-item label-item-more">+{cardData.labels.length - 5}</div>
                </Popover>
                : null
            }
          </div>
        </div>
      </div>
      <div className="update-time">
        {
          cardData.archivesUpdateTime ?
            <div className="time">
              <div className="label">档案更新时间:</div>
              <div className="value">{cardData.archivesUpdateTime};</div>
            </div>
            : ''
        }
        {
          cardData.groupUpdateTime ?
            <div className="time">
              <div className="label">聚类更新时间:</div>
              <div className="value">{cardData.groupUpdateTime};</div>
            </div>
            : ''
        }
      </div>
    </div>
  </div>
}
export default RecordCard