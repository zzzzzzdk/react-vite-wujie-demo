import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getParams, isNumber } from "@/utils";
import { isEmptyObject } from "@/utils/is";
import { Message, VirtualList, Image, Button, Tooltip } from '@yisa/webui'
import { CloseOutlined, Icon, LeftOutlined, RightOutlined } from "@yisa/webui/es/Icon"
import { ResultBox } from '@yisa/webui_business'
import { BoxDrawer, TrackMap, Card, BigImg } from '@/components'
import { RefTrackMap } from "@/components/Map/TrackMap/interface";
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { getMapProps, isArray, isFunction } from '@/utils'
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import { TrackDataItem } from './interface'
import services from "@/services";
import classNames from 'classnames'
import { validatePlate, jumpRecordVehicle } from "@/utils";
import './index.scss'

/**
 * @description 单轨迹页，仅支持从其他页携带参数跳转
 */

const CreateTrack = () => {
  const location = useLocation()
  const [rightDrawerVisible, setRightDrawerVisible] = useState(true)
  const boxRef = useRef<HTMLDivElement>(null)
  const [ajaxLoading, setAjaxLoading] = useState(false)

  // 轨迹数据
  const [trackData, setTrackData] = useState<TrackDataItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // 大图
  const [bigImgData, setBigImgData] = useState<TargetResultItemType[]>([])
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgIndex, setBigImgIndex] = useState(0)

  // 虚拟列表盒子高度
  const virtualBoxRef = useRef<HTMLDivElement>(null)
  const [virtualBoxHeight, setVirtualBoxHeight] = useState(virtualBoxRef.current?.offsetHeight || 0)

  const trackMapRef = useRef<RefTrackMap>(null)

  const calcVirtualHeight = () => {
    // console.log(virtualBoxRef.current?.offsetHeight)
    const height = virtualBoxRef.current?.offsetHeight || 0
    setVirtualBoxHeight(height)
  }

  useEffect(() => {
    const searchData = getParams(location.search)
    if (!isEmptyObject(searchData)) {
      getTrackData(searchData.id)
    } else {
      Message.warning("无参数")
    }

    // 虚拟列表高度改变
    const resizeObserver = new ResizeObserver((entries) => {
      calcVirtualHeight()
    });
    virtualBoxRef.current && resizeObserver.observe(virtualBoxRef.current);
  }, [])

  const getTrackData = (id: string) => {
    setAjaxLoading(true)
    services.getTrackById<{ id: string }, TrackDataItem[]>({
      id: id
    }).then(res => {
      setAjaxLoading(false)
      console.log(res)
      let result = (res.data || [])
      // 添加序号，数据时间倒序排列
      result = result.map((item, index) => {
        let newPath = item.path.map(pathItem => `${pathItem['lng']},${pathItem['lat']}`).join(';')
        return {
          ...item,
          index: result.length - index,
          path: [newPath]
        }
      })
      setTrackData(result)
    }).catch(err => { setAjaxLoading(false); console.log(err) })
  }

  const handleOpenBigImg = (event: React.MouseEvent, item: TargetResultItemType, index?: number, parentIndex?: number, infos?: TargetResultItemType[]) => {
    console.log(index, parentIndex)
    const newBigImgData = infos && infos.length ? infos : trackData[parentIndex || 0].infos || []
    setBigImgData(newBigImgData)
    setBigImgIndex(index || 0)
    setBigImgVisible(true)
  }

  const handleCardClick = (event: React.MouseEvent, data: TrackDataItem, index: number) => {
    setSelectedIndex(index)
  }

  const handleTrackContentCb = (data: TrackDataItem, index: number, childIndex: number) => {
    // console.log(data, index)
    const currentData: TargetResultItemType = data && data.infos && isArray(data.infos) ? data.infos[childIndex] : {} as TargetResultItemType
    // console.log(currentData)
    let infoLength = data.infos?.length || 0

    return (
      <div className="track-popver-content">
        <div className="track-popver-content-header">
          <div className="header-text">抓拍信息（{infoLength}）</div>
          <span className='close-btn' onClick={() => {
            setSelectedIndex(null)
            trackMapRef.current?.trackRef?.closePopup()
          }}><CloseOutlined /></span>
        </div>
        <div className="track-popver-content-card">
          <span className="card-serial">{(data.index || 0) + 1}</span>
          {
            currentData.hasOwnProperty("similarity") &&
            <span className="card-similar">{currentData.similarity || 0.0}%</span>
          }
          <div className="left-img" onClick={(e) => handleOpenBigImg(e, currentData, childIndex, index, data.infos)}>
            <Image src={currentData.targetImage} />
          </div>
          <div className="right-info">
            {
              // 二三轮车车牌
              currentData.licensePlate &&
              <div className="card-info plate-wrap">
                {
                  currentData.licensePlateUrl && currentData.licensePlateUrl != "" && validatePlate(currentData.licensePlate) ?
                    <a target="_blank" href={currentData.licensePlateUrl} className={currentData.licensePlate == '无牌' ? 'plate-text plate-error' : 'plate-text'}>
                      {currentData.licensePlate}
                    </a>
                    :
                    <span className={currentData.licensePlate == '无牌' ? 'plate-text plate-error' : 'plate-text'}>{currentData.licensePlate == '无牌' ? '未知' : currentData.licensePlate}</span>
                }
              </div>
            }
            {
              currentData.licensePlate1 &&
              <div className="card-info plate-wrap">
                {
                  currentData.licensePlate1Url && currentData.licensePlate1Url != "" && validatePlate(currentData.licensePlate1) ?
                    <a target="_blank" href={currentData.licensePlate1Url} className={'plate-text'}>
                      {currentData.licensePlate1}
                    </a>
                    :
                    <span className={'plate-text plate-error'}>{currentData.licensePlate1}</span>
                }
                {
                  currentData.licensePlate2 &&
                  <Tooltip placement="bottom" title="二次识别">
                    {
                      currentData.licensePlate2 === '未识别' ?
                        <span className={`plate2-text plate-color-8`}></span> :
                        (
                          <a
                            target="_blank"
                            href={jumpRecordVehicle(currentData.licensePlate2, currentData.plateColorTypeId2)}
                            className={`plate2-text plate-bg plate-color-${currentData.plateColorTypeId2}`}
                          >
                            {currentData.licensePlate2}
                          </a>
                        )
                    }
                  </Tooltip>
                }
              </div>
            }
            <div>最近抓拍：</div>
            <div className="card-info"><Icon type="shijian" />{currentData.captureTime}</div>
            <div className="card-info" title={currentData.locationName}><Icon type="didian" />{currentData.locationName}</div>
            {/* <div className="card-btn">
              <Button type="primary" onClick={(e) => handleAddFilterate(e, currentData)}>加入过滤名单</Button>
            </div> */}
          </div>

          <span
            onClick={(e) => { handlePrev(e) }}
            className={classNames("btn-change btn-prev", {
              disabled: childIndex === 0
            })}
          >
            <LeftOutlined />
          </span>
          <span
            onClick={(e) => { handleNext(e, infoLength) }}
            className={classNames("btn-change btn-next", {
              disabled: childIndex === infoLength - 1
            })}
          >
            <RightOutlined />
          </span>
        </div>
      </div>
    )
  }
  const handleNext = (e: React.MouseEvent, length: number) => {
    // console.log('handleNext', length)
    e.stopPropagation()
    trackMapRef.current?.trackRef?.nextAlarm(length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    trackMapRef.current?.trackRef?.prevAlarm()
  }

  return (
    <div className="create-track">
      <div className="create-track-content" ref={boxRef}>
        <TrackMap
          ref={trackMapRef}
          trackData={[...trackData].reverse()}
          selectedIndex={selectedIndex}
          onSelectedChange={(index) => {
            setSelectedIndex(index)
          }}
          trackContentCb={handleTrackContentCb}
        />
        <BoxDrawer
          placement="right"
          title="轨迹信息"
          onOpen={() => setRightDrawerVisible(true)}
          onClose={() => setRightDrawerVisible(false)}
          visible={rightDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          <div className="result-con" ref={virtualBoxRef}>
            <ResultBox
              loading={ajaxLoading}
              nodata={!trackData || (trackData && !trackData.length)}
            >
              <VirtualList
                data={trackData}
                itemKey={(item) => item.index}
                height={virtualBoxHeight}
                itemHeight={258}
              >
                {
                  (item, index) => {
                    return (
                      <div>
                        <Card.Identify
                          key={item.index}
                          cardData={item}
                          onImgClick={(e, data, i) => handleOpenBigImg(e, data, i, index)}
                          checked={selectedIndex === (item.index)}
                          onCardClick={(e, data,) => handleCardClick(e, data, item.index)}
                          locationCanClick={false}
                          showAddFilterate={false}
                        />
                      </div>
                    )
                  }
                }
              </VirtualList>
            </ResultBox>
          </div>
        </BoxDrawer>
      </div>
      <BigImg
        modalProps={{
          visible: bigImgVisible,
          onCancel: () => setBigImgVisible(false)
        }}
        currentIndex={bigImgIndex}
        data={bigImgData}
        onIndexChange={(index) => {
          setBigImgIndex(index)
        }}
      />
    </div>
  )
}

export default CreateTrack
