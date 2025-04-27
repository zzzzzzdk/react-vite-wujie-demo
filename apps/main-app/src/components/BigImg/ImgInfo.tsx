import React, { memo, useEffect, useMemo, useState } from "react"
import { Tabs, Image, Space, Tooltip, Button } from '@yisa/webui'
import { Icon } from "@yisa/webui/es/Icon"
import { ImgInfoProps } from "./interface"
import character from "@/config/character.config"
import { isFunction, isObject, jumpRecordVehicle } from "@/utils"
import ajax from "@/services"
import { ResultRowType } from "@/pages/Search/Target/interface"
import classNames from 'classnames'
import { BottomRight, MapAroundPoint, GaitSequence, JoinClue, MovePathModal, DoubleMapAroundPoint, CopyToClipboard } from "@/components"
import SameScene from "./SameScene"
import './ImgInfo.scss'
import { ImgInfoCard } from "./components"
import { logReport } from "@/utils/log"
import { validatePlate } from "@/utils"
import { useDebounceEffect } from 'ahooks';

const tabsOption = [
  { key: "1", name: '目标详情' },
  { key: "2", name: '同画面目标' },
]

function ImgInfo(props: ImgInfoProps) {
  const {
    connectData = [],
    currentIndex = 0,
    data = [],
    showInfoMap = true,
    imgInfoRender,
    onConnectItemClick,
    showConnect = false,
    showCData,
    onSameScenceChange,
    showtab,
    mapId,
    matchesDesc,
    resultDesc,
    movePath = [],
    targetPoint = []
  } = props
  const [activeTab, setActiveTab] = useState('1')
  const [showClue, setShowClue] = useState(false)
  const [clueList, setClueList] = useState<ResultRowType[]>([])
  const [showMovePath, setShowMovePath] = useState(false)

  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)

  const currentData: ResultRowType = showConnect ?
    (showCData as ResultRowType)
    :
    Array.isArray(data) && data[currentIndex] ? data[currentIndex] : ({} as ResultRowType)

  const lng = currentData.lngLat?.lng || null
  const lat = currentData.lngLat?.lat || null

  const handleChangeActiveTab = (key: string) => {
    setActiveTab(key)
    if (key === '1') {
      onSameScenceChange?.([], true)
    }
  }

  const renderInfo = useMemo(() =>
    imgInfoRender ?
      isFunction(imgInfoRender) ?
        (imgInfoRender as any)(data[currentIndex], currentIndex)
        :
        imgInfoRender
      :
      <></>,
    [currentIndex])

  const handleShowBottomRightMap = () => {
    setBottomRightMapVisible(true)
  }

  // 关联目标路径展示!
  const handleShowMovePath = () => {
    const desc = `图片1 - 大图弹窗 -【移动路径展示】`
    logReport({
      type: 'none',
      data: {
        desc,
        data
      }
    })
    setShowMovePath(true)
  }

  // 渲染目标结果信息模板
  const handleRenderInfoItem = () => {
    return (
      <>
        {
          data[currentIndex]?.matches && data[currentIndex]?.matches?.length > 0 ?
            <div className="img-info-item">
              <div className="item-con">
                <div className="comparison">
                  <div className="img-item">
                    <div className="tip">{matchesDesc || '检索条件'}</div>
                    <Image src={data[currentIndex].matches[0]?.targetImage} />
                  </div>
                  <div className="similarity"><span>{data[currentIndex].similarity || 0}</span><em>%</em></div>
                  <div className="img-item">
                    <div className="tip">{resultDesc || '检索结果'}</div>
                    <Image src={data[currentIndex].targetImage || ''} />
                  </div>
                </div>
              </div>
            </div>
            : ''
        }
        {
          connectData.length ?
            <div className="img-info-item">
              <div className="item-label">
                <Tooltip
                  title="以下为该目标在当前摄像头内，抓拍的其他维度信息"
                  placement="right"
                >关联目标 <Icon type="tishi" />
                </Tooltip>

                <span className="mobile-path-btn" onClick={handleShowMovePath}>移动路径展示</span>
              </div>
              <div className="item-con connect-data">
                <ul className="connect-data-wrapper">
                  {
                    connectData.map((item, i) => {
                      return <li
                        key={item.infoId}
                      >
                        <ImgInfoCard
                          key={item.infoId}
                          data={{
                            ...item,
                            source: "associateTarget"
                          }}
                        />
                      </li>
                    })
                  }
                </ul>
              </div>
            </div>
            : ''
        }
        {
          character.hasGait && currentData.gaitFeature && currentData.isGait && currentData.gaitObjectNumber > 0 ?
            <div className="img-info-item">
              <div className="item-con gait">
                <GaitSequence
                  data={currentData}
                />
              </div>
            </div>
            : ''
        }
        <div className="img-info-item">
          <div className="item-label">抓拍信息</div>
          <div className="item-con target-info">
            <div className='linebox'></div>
            <div className="target-info-content">
              {
                currentData.targetType === "vehicle" ?
                  <Space size={5} direction="vertical">
                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className="target-info-item">
                        <div className="label">前端识别</div>:
                        {
                          validatePlate(currentData.licensePlate1) ?
                            <a target="_blank"
                              href={jumpRecordVehicle(currentData.licensePlate1, currentData.plateColorTypeId1)}
                              className="con">
                              {currentData.licensePlate1}
                            </a>
                            :
                            <div className="con">{currentData.licensePlate1}</div>
                        }
                      </div>
                      <div className="target-info-item">
                        <div className="label">二次识别</div>:
                        {
                          currentData.licensePlate2 === '未识别' ?
                            <div className={`plate-bg plate-color-8`}></div>
                            :
                            <>
                              <a
                                className={`plate-bg plate-color-${currentData.plateColorTypeId2}`}
                                target="_blank"
                                href={jumpRecordVehicle(currentData.licensePlate2, currentData.plateColorTypeId2)}
                                id="text-to-copy"
                              >
                                {currentData.licensePlate2}
                              </a>
                              <CopyToClipboard text={currentData.licensePlate2} />
                            </>
                        }
                      </div>
                    </Space>
                    <Space size={5} direction="horizontal" className="gap-flex">
                      {/* <div className="target-info-item">
                        <div className="label">车型</div>:
                        <div className="con" title={currentData.carInfo}>{currentData.carInfo}</div>
                      </div> */}
                      <div className="target-info-item">
                        <div className="label">方向</div>:
                        <div className={`con`}>{currentData.direction || "未知"}</div>
                      </div>
                    </Space>
                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className="target-info-item">
                        <div className="label">车型</div>:
                        <div className="con" title={currentData.carInfo}>{currentData.carInfo}</div>
                      </div>
                      {/* <div className="target-info-item">
                        <div className="label">方向</div>:
                        <div className={`con`}>{currentData.direction || "未知"}</div>
                      </div> */}
                    </Space>

                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className="target-info-item">
                        <div className="label">时间</div>:
                        <div className="con">{currentData.captureTime || "未知"}</div>
                      </div>
                    </Space>

                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className={classNames("target-info-item", { "can-click": !showInfoMap || (currentData.conditionData && currentData.gaitFeature) })}>
                        <div className="label">地点</div>:
                        <div
                          className="con"
                          title={currentData.locationName}
                          onClick={!showInfoMap || (currentData.conditionData && currentData.gaitFeature) ? handleShowBottomRightMap : () => { }}
                        >{currentData.locationName || '未知'}</div>
                      </div>
                    </Space>

                  </Space>
                  :
                  <Space size={5} direction="vertical">
                    {
                      currentData.licensePlate &&
                      <div className="target-info-item">
                        <div className="label">车牌号码</div>:
                        <div className="con bitricycle">{currentData.licensePlate}</div>
                      </div>
                    }
                    <div className="target-info-item">
                      <div className="label">时间</div>:
                      <div className="con">{currentData.captureTime || "未知"}</div>
                    </div>
                    {/* {
                      currentData.shootTime &&
                      <div className="target-info-item">
                        <div className="label">拍摄时间</div>:
                        <div className="con">{currentData.shootTime}</div>
                      </div>
                    } */}
                    <div className={classNames("target-info-item", { "can-click": !showInfoMap || (currentData.matches && currentData.gaitFeature) })}>
                      <div className="label">地点</div>:
                      <div
                        className="con"
                        title={currentData.locationName}
                        onClick={!showInfoMap || (currentData.matches && currentData.gaitFeature) ? handleShowBottomRightMap : () => { }}
                      >{currentData.locationName || '未知'}</div>
                    </div>
                  </Space>
              }
            </div>
          </div>
        </div>
        {
          // 这三者数据同时存在的时候，下方地图展示区域不足
          !showInfoMap || (currentData.matches && currentData.isGait && connectData.length) ?
            ""
            :
            <div className="img-info-item info-map-wrap">
              <div className="item-con info-map">
                {/* <MapAroundPoint
                  locationId={currentData.locationId}
                  lng={lng}
                  lat={lat}
                  footholdarr={currentData.footholdarr}
                  id={mapId}
                /> */}
                <DoubleMapAroundPoint
                  locationId={currentData.locationId}
                  lng={lng}
                  lat={lat}
                  footholdarr={currentData.footholdarr}
                  id={mapId}
                  data={currentData}
                />
              </div>
            </div>
        }
      </>
    )
  }

  return (
    <>
      <div className={"img-info-view"}>
        {imgInfoRender ? (renderInfo as JSX.Element) :
          <div className={showtab ? 'img-info-view-content' : "img-info-view-content-notab"}>
            {/* <Tabs
              activeKey='1'
              onChange={(key) => handleChangeActiveTab(key)}
              data={tabsOption}
              type="line"
              className="img-info-tabs"
            /> */}
            {
              showtab && <Tabs
                activeKey='1'
                onChange={(key) => handleChangeActiveTab(key)}
                data={tabsOption}
                type="line"
                className="img-info-tabs"
              />
            }
            <div className="img-info-view-content-content">
              {
                activeTab === '1' ?
                  handleRenderInfoItem()
                  :
                  <SameScene
                    currentData={showConnect ? showCData :
                      Array.isArray(data) && data[currentIndex] ? data[currentIndex] : undefined}
                    currentIndex={currentIndex}
                    onSameScenceChange={onSameScenceChange}
                  />
              }
            </div>
          </div>
        }
      </div>
      {
        bottomRightMapVisible &&
        <BottomRight
          name={currentData.locationName}
          lat={lat}
          lng={lng}
          onClose={() => { setBottomRightMapVisible(false) }}
        />
      }
      <JoinClue
        visible={showClue}
        clueDetails={clueList}
        onOk={() => { setShowClue(false) }}
        onCancel={() => { setShowClue(false) }}
      />
      <MovePathModal
        bigImage={currentData.bigImage}
        modalProps={{
          visible: showMovePath,
          onCancel: () => setShowMovePath(false)
        }}
        movePath={movePath}
        targetPoint={targetPoint}
        data={[currentData, ...connectData]}
      />
    </>
  )
}

export default ImgInfo
