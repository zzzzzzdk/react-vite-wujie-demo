import React, { useState, useRef, useEffect } from "react";
import { ResultProps, ResultItem } from '../interface'
import { ResultBox, } from "@yisa/webui_business";
import { Button, Image, Popover, VirtualList, Message, Modal, Divider } from "@yisa/webui";
import { Icon, RightOutlined, LeftOutlined } from "@yisa/webui/es/Icon";
import FilterateModal from "../../Cross/FilterateModal";
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import { jumpRecordVehicle } from "@/utils";
import { Card } from "@/components";
import { RelateData } from "../../record/detail/interface";
import PersonInfo from './PerosnInfo'
import { PersonInfoDataType } from "../interface";

const Result = (props: ResultProps) => {
  const {
    ajaxLoading,
    currentData = {
      trackId: '',
      trackData: [],
      extendData: [],
      personInfoData: {
        personBasicInfo: {
        },
        locationNames: '',
        personTags: [],
        lngLat: {
          lng: 0,
          lat: 0,
        },
      },
      vehicleInfoData: [],
      predictPath: [],
    } as unknown as ResultItem,
    currentTrackId,
    cardResultVisible = false,
    selectedIndexArr = [],
    handleCardClick,
    handleOpenBigImg,
    // FilterBtn,
    resultData,
    handleAddFilterate,
    bgColor,
    indexColor
  } = props

  let listData = currentData.trackData.filter(item => (item.infos?.length || 0) > 0)
  listData = currentData.trackData.map((elem, index) => ({ ...elem, index: currentData.trackData.length - index }))

  // 虚拟列表盒子高度
  const virtualBoxRef = useRef<HTMLDivElement>(null)
  const [virtualBoxHeight, setVirtualBoxHeight] = useState(virtualBoxRef.current?.offsetHeight || 0)

  // 
  const [fold, setFold] = useState(false)


  // 过滤名单删除回调
  const handleFilterateDelChange = (data: TargetResultItemType[]) => {

  }

  // 车辆信息展开收起
  const handleVehicleFold = () => {
    setFold(!fold)
  }

  const calcVirtualHeight = () => {
    // console.log(virtualBoxRef.current?.offsetHeight)
    const height = virtualBoxRef.current?.offsetHeight || 0
    setVirtualBoxHeight(height)
  }

  useEffect(() => {
    // handleParamsData()

    // calcListCount()
    // window.addEventListener('resize', calcListCount)

    const resizeObserver = new ResizeObserver((entries) => {
      calcVirtualHeight()
    });
    virtualBoxRef.current && resizeObserver.observe(virtualBoxRef.current);

    return () => {
      // window.removeEventListener('resize', calcListCount)
      virtualBoxRef.current && resizeObserver.unobserve(virtualBoxRef.current)
    }
  }, [])

  // console.log('virtualBoxHeight', virtualBoxHeight, currentData.trackData)

  const [vehicleInfoIndex, setVehicleInfoIndex] = useState(0)
  const curVehicleInfoData = currentData.vehicleInfoData[vehicleInfoIndex] ?? {}

  const handleVehiclePrev = () => {
    const newIndex = vehicleInfoIndex - 1
    setVehicleInfoIndex(newIndex)
  }

  const handleVehicleNext = () => {
    const newIndex = vehicleInfoIndex + 1
    setVehicleInfoIndex(newIndex)
  }


  return (
    <>
      <ResultBox
        loading={ajaxLoading}
        nodata={!resultData || (resultData && !resultData.length)}
      >
        {
          currentData.personInfoData ?
            <div className="result-data-item">
              <div className="result-title">档案信息</div>
              <div className="result-data-item-con" style={{ backgroundColor: bgColor }}>
                <PersonInfo
                  personInfoData={currentData.personInfoData}
                />
              </div>
            </div>
            : ''
        }
        <Divider />
        <div className="result-title"><div>轨迹信息</div>
          {/* <FilterBtn /> */}
        </div>
        {
          currentData.vehicleInfoData && currentData.vehicleInfoData.length ?
            <div className="result-data-item">
              <div className={`vehicle-info-card ${fold ? 'fold' : 'unfold'}`} style={{ backgroundColor: bgColor }}>
                {
                  fold ?
                    `${curVehicleInfoData.licensePlate || '-'} - ${curVehicleInfoData.carInfo || '-'}、${curVehicleInfoData.beginTime || '-'} - ${curVehicleInfoData.endTime || '-'}`
                    :
                    <>
                      <div className="vehicle-info-item">
                        <label>车牌号码</label>
                        {
                          curVehicleInfoData.licensePlate !== "未识别" ?
                            <a
                              className={`plate-bg plate-color-${curVehicleInfoData.plateColorTypeId2}`}
                              target="_blank"
                              href={jumpRecordVehicle(curVehicleInfoData.licensePlate, curVehicleInfoData.plateColorTypeId2)}
                            >
                              {curVehicleInfoData.licensePlate || '--'}
                            </a>
                            :
                            <div className={`plate-bg plate-color-8`}></div>
                        }
                      </div>
                      <div className="vehicle-info-item" title={curVehicleInfoData.carInfo}><label>车型</label>{curVehicleInfoData.carInfo || '--'}</div>
                      <div className="vehicle-info-item"><label>起始时间</label>{curVehicleInfoData.beginTime || '--'}</div>
                      <div className="vehicle-info-item"><label>终止时间</label>{curVehicleInfoData.endTime || '--'}</div>
                    </>
                }
                <div className="fold-btn" onClick={handleVehicleFold}>
                  {
                    fold ?
                      <><Icon type="zhankaidaohang" />展开</>
                      :
                      <><Icon type="shouqidaohang" />收起</>
                  }
                </div>
                {
                  currentData.vehicleInfoData.length > 1 ?
                    <>
                      {vehicleInfoIndex === 0 ? "" : <div className="transfer prev" onClick={handleVehiclePrev}>换乘<LeftOutlined /></div>}
                      {vehicleInfoIndex === currentData.vehicleInfoData.length - 1 ? "" : <div className="transfer next" onClick={handleVehicleNext}>换乘<RightOutlined /></div>}
                    </>
                    : ''
                }
              </div>
              <Divider style={{ margin: '10px 0' }} />
            </div>
            : ''
        }
        <div className="result-data-item result-list-wrap" ref={virtualBoxRef}>
          <div className="result-list">
            {/* {
              !cardResultVisible ? */}
            {
              <ResultBox
                loading={ajaxLoading}
                nodata={!listData || (listData && !listData.length)}
              >
                {listData.map((item, index) => {
                  return (
                    <Card.Identify
                      style={{ backgroundColor: bgColor }}
                      key={item.minCaptureTime + index}
                      indexColor={indexColor}
                      cardData={item}
                      onImgClick={(e, data, i) => handleOpenBigImg(e, data, i, item.indexArr)}
                      checked={selectedIndexArr[0] === (item.indexArr?.[0]) && selectedIndexArr[1] === item.indexArr?.[1]}
                      onCardClick={(e, data,) => handleCardClick(e, data, item.index)}
                      locationCanClick={false}
                      showAddFilterate={false}
                    // onAddFilterate={handleAddFilterate}
                    />
                  )
                })}
              </ResultBox>
            }
            {/* <VirtualList
              data={listData}
              itemKey={(item) => item.infoId}
              height={virtualBoxHeight}
              itemHeight={258}
            >
              {
                (item, index) => {
                  return (
                    <div>
                      <Card.Identify
                        key={item.infoId}
                        cardData={item}
                      // onImgClick={(e, data, i) => handleOpenBigImg(e, data, i, index)}
                      // checked={selectedIndex === (item.index)}
                      // onCardClick={(e, data,) => handleCardClick(e, data, item.index)}
                      // locationCanClick={false}
                      // onAddFilterate={handleAddFilterate}
                      />
                    </div>
                  )
                }
              }
            </VirtualList> */}
            {/* : null
            } */}
          </div>
        </div>
      </ResultBox>



    </>
  )
}

export default Result