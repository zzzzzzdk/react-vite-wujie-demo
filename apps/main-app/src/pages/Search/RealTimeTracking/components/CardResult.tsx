import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { ResultProps, ResultItem, CardResultProps, CardResultData, RefCardResultType } from '../interface'
import { ResultBox, } from "@yisa/webui_business";
import { Button, Image, Popover, VirtualList, Message, Modal, Divider, Space } from "@yisa/webui";
import { Icon, RightOutlined, LeftOutlined } from "@yisa/webui/es/Icon";
import FilterateModal from "../../Cross/FilterateModal";
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import { jumpRecordVehicle } from "@/utils";
import { Card, FormRadioGroup, BigImg } from "@/components";
import { RelateData } from "../../record/detail/interface";
import classNames from 'classnames'
import PerosnInfo from "./PerosnInfo";
import { useDeepCompareEffect } from "ahooks";
import services, { ApiResponse } from "@/services";
import { useRequest } from "ahooks";
import character from '@/config/character.config'
import type { TargetFeatureItem, SortOrder, SortField } from '@/config/CommonType'
import { validatePlate } from "@/utils";


const CardResult = forwardRef<RefCardResultType, CardResultProps>(function (props, ref) {
  const {
    ajaxLoading,
    cardResultVisible,
    beforAjax,
    ResulType,
    // FilterBtn,
    currentTrackId,
    taskId,
    bgColor,
    handleAddFilterate,
    tracking
  } = props
  const [personInfoFold, setPersonInfoFold] = useState(false)

  const defaultResult = {
    personInfoData: {
      infoId: '',
      targetImage: '',
      captureTime: '',
      feature: '',
      similarity: 0,
      captureNum: 0,
      matches: [],
      personBasicInfo: {
        name: '',
        sex: '',
        age: 0,
        nation: '',
        idcard: '',
        idType: 0,
        groupId: [],
        groupPlateId: [],
      },
      locationNames: '',
      personTags: [],
      lngLat: {
        lng: 0,
        lat: 0
      },
    },
    vehicles: [],
    faces: []
  }

  const [resultData, setResultData] = useState<CardResultData>(defaultResult)
  const resultDataRef = useRef(resultData)
  resultDataRef.current = resultData
  const resultConRef = useRef<HTMLDivElement>(null)

  // 展开的条件特征值,更新数据时,使用此数组判断,避免全部收起
  const unfoldFeatures = useRef<string[]>([])

  const [listCount, setListCount] = useState(5)
  const listCountRef = useRef(listCount)
  listCountRef.current = listCount

  const [formData, setFormData] = useState({
    sort: {
      field: character.yituSort[0].value,
      order: character.yituSort[0].order,
    }
  })
  const formDataRef = useRef(formData)
  formDataRef.current = formData

  const [bigImgData, setBigImgData] = useState<TargetResultItemType[]>([])
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgIndex, setBigImgIndex] = useState(0)

  const pollingRef = useRef(false)
  const timer = useRef<NodeJS.Timeout>()

  // const { data, loading, run, cancel } = useRequest(async () => getData(), {
  //   debounceWait: 200,
  //   pollingInterval: 10000,
  //   manual: true,
  //   pollingErrorRetryCount: 3,
  //   // pollingWhenHidden: false,
  // });

  const setId = (index: number) => {
    // return index === 1 ? 'xxxx' : '2222'
    let stamp = new Date().getTime();
    return (((1 + Math.random()) * stamp) | 0).toString(16);
  }

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    if (currentTrackId && cardResultVisible && tracking) {
      getData()
      pollingRef.current = true
    } else {
      pollingRef.current = false
      if (!currentTrackId || !cardResultVisible) {
        setResultData(defaultResult)
      }
    }
  }, [cardResultVisible, currentTrackId, tracking])

  // useEffect(() => {
  //   if (timer.current) {
  //     clearTimeout(timer.current)
  //   }
  //   if (tracking && cardResultVisible) {
  //     getData()
  //     pollingRef.current = true
  //   } else {
  //     pollingRef.current = false
  //   }
  // }, [tracking])

  interface ListParams {
    taskId: string;
    trackId: string;
  }

  const getData = () => {
    services.cross.getRealTimeTrackingList<ListParams, CardResultData>({
      taskId: taskId,
      trackId: currentTrackId,
      ...formDataRef.current
    }).then(res => {
      // console.log(res)
      let result = res.data || defaultResult
      result.faces = result.faces.map((item) => {

        return ({
          ...item,
          fold: unfoldFeatures.current.includes(item.cond.feature) ? false : true,
          filterId: item.results[0] ? item.results[0].locationId + (item.minCaptureTime) : '', //这个地方应该取最小时间
        })
      })
      result.vehicles = result.vehicles.map(item => ({
        ...item,
        fold: unfoldFeatures.current.includes(item.cond.licensePlate + item.cond.plateColorTypeId2) ? false : true,
        filterId: item.results[0] ? item.results[0].locationId + (item.minCaptureTime) : ''
      }))
      setResultData({ ...result })

      if (pollingRef.current) {
        timer.current = setTimeout(getData, 10000);
      }
    }).catch(err => {
      console.log(err)
      if (pollingRef.current) {
        timer.current = setTimeout(getData, 10000);
      }
    })
  }

  const calcListCount = () => {
    const itemWidth = 194
    const width = (resultConRef.current?.clientWidth || 0) - 40 - 210 - 26 // 减出来就剩右边的结果区域
    const count = Math.floor(width / itemWidth)
    setListCount(count)
  }

  useEffect(() => {

    calcListCount()
    window.addEventListener('resize', calcListCount)


    return () => {
      window.removeEventListener('resize', calcListCount)
    }
  }, [])

  const handleSortChange = (value: SortField, order: SortOrder | undefined) => {
    const newFormData = { ...formData, sort: { field: value, order: order || 'desc' } }
    setFormData(newFormData)
    if (timer.current) {
      clearTimeout(timer.current)
    }
    getData()
  }

  const handleOpenBigImg = (data: TargetResultItemType[], index: number) => {
    setBigImgData(data)
    setBigImgVisible(true)
    setBigImgIndex(index)
  }

  const addFilterate = (data: any, type: string, index: number, filterId: string | undefined) => {
    const newResultData = { ...resultDataRef.current }
    const newData = (newResultData[type][index].results ?? []).filter((item: TargetResultItemType) => item.infoId !== data.infoId)
    newResultData[type][index].results = newData
    setResultData(newResultData)
    handleAddFilterate?.({ ...data, filterId })
  }

  // 时间排序按钮
  const TimeSortBtn = () => (
    <FormRadioGroup
      isSort={true}
      defaultValue={formData.sort.field}
      defaultOrder={formData.sort.order}
      yisaData={character.yituSort}
      onChange={handleSortChange}
    />
  )


  const handleRenderCard = () => {
    const { faces, vehicles } = resultDataRef.current
    // console.log('resultData - changes', resultDataRef.current)
    const faceTemplates = (
      faces.map((faceInfo, index) => {
        const currentResults = faceInfo.fold ? faceInfo.results.slice(0, listCount) : faceInfo.results
        return (
          <div
            className="result-item"
            key={faceInfo.minCaptureTime + index}
            style={{ backgroundColor: bgColor }}
          >
            <div className="face-cond">
              <div className="face-cond-image"><Image src={faceInfo.cond.targetImage} /></div>
              <div className="cond-total">共有<span>{faceInfo.results.length}</span>条目标结果</div>
            </div>
            <div className="results">
              {
                currentResults.map((resultItem, i) => {
                  return (
                    <Card.IdentifySingle
                      key={resultItem.infoId}
                      cardData={resultItem}
                      showFooterLinks={false}
                      onImgClick={() => handleOpenBigImg(faceInfo.results, i)}
                      showAddFilterate={false}
                      onAddFilterate={(data) => addFilterate(data, 'faces', index, faceInfo.filterId)}
                    />
                  )
                })
              }
            </div>
            <div className="item-fold" onClick={() => handleFoldChange('faces', index)}>
              {
                faceInfo.fold ?
                  <><Icon type="zhankaidaohang" />展开</>
                  :
                  <><Icon type="shouqidaohang" />收起</>
              }
            </div>
          </div>
        )
      })
    )

    const vehicleTemplates = (
      vehicles.map((vehicleInfo, index) => {
        const currentResults = vehicleInfo.fold ? vehicleInfo.results.slice(0, listCount) : vehicleInfo.results
        return (
          <div
            className="result-item"
            key={vehicleInfo.minCaptureTime + index}
            style={{ backgroundColor: bgColor }}
          >
            <div className="vehicle-cond">
              <div className="vehicle-info">
                <div className="plate-number">
                  {
                    !validatePlate(vehicleInfo.cond.licensePlate) ?
                      <span className={`plate2-text plate-color-8`}></span> :
                      (
                        <a
                          target="_blank"
                          href={jumpRecordVehicle(vehicleInfo.cond.licensePlate, vehicleInfo.cond.plateColorTypeId2)}
                          className={`plate2-text plate-bg plate-color-${vehicleInfo.cond.plateColorTypeId2}`}>
                          {vehicleInfo.cond.licensePlate}
                        </a>
                      )
                  }
                </div>
                <div className="vehicle-info-con">
                  <div className="car-info" title={vehicleInfo.cond.carInfo}>{vehicleInfo.cond.carInfo}</div>
                  <div className="time-item">
                    <p>起始时间</p>
                    <div>{vehicleInfo.cond.beginTime}</div>
                  </div>
                  <div className="time-item">
                    <p>终止时间</p>
                    <div>{vehicleInfo.cond.endTime}</div>
                  </div>
                </div>
              </div>
              <div className="cond-total">共有<span>{vehicleInfo.results.length}</span>条目标结果</div>
            </div>
            <div className="results">
              {
                currentResults.map((resultItem, i) => {
                  return (
                    <Card.IdentifySingle
                      key={resultItem.infoId}
                      cardData={resultItem}
                      showFooterLinks={false}
                      onImgClick={() => handleOpenBigImg(vehicleInfo.results, i)}
                      showSimilarity={false}
                      showAddFilterate={false}
                      onAddFilterate={(data) => addFilterate(data, 'vehicles', index, vehicleInfo.filterId)}
                    />
                  )
                })
              }
            </div>
            <div className="item-fold" onClick={() => handleFoldChange('vehicles', index)}>
              {
                vehicleInfo.fold ?
                  <><Icon type="zhankaidaohang" />展开</>
                  :
                  <><Icon type="shouqidaohang" />收起</>
              }
            </div>
          </div>
        )
      })
    )

    return <>
      {faceTemplates}
      {vehicleTemplates}
    </>
  }

  const handleFoldChange = (type: string, index: number = 0) => {
    if (type === 'personInfo') {
      setPersonInfoFold(!personInfoFold)
    } else {
      const newResultData = { ...resultDataRef.current }
      const flag = !newResultData[type][index].fold
      newResultData[type][index].fold = flag
      setResultData(newResultData)

      let feature = ``
      if (type === 'faces') {
        feature = newResultData[type][index]?.cond?.feature
      } else {
        feature = newResultData[type][index]?.cond?.licensePlate + newResultData[type][index]?.cond?.plateColorTypeId2
      }
      if (!flag) {
        unfoldFeatures.current.push(feature)
      } else {
        unfoldFeatures.current = unfoldFeatures.current.filter(feat => feat !== feature)
      }
      console.log('unfoldFeatures.current', unfoldFeatures.current)

    }
  }

  useImperativeHandle(ref, () => ({
    filterateDel: (data: any) => {
      console.log(data)
      const newResultData = { ...resultDataRef.current }
      newResultData.faces.forEach((item) => {
        const { results, filterId } = item
        data.forEach((element: any) => {
          if (filterId === element.filterId) {
            item.results.unshift(data)
          }
        })
      })
      newResultData.vehicles.forEach((item) => {
        const { results, filterId } = item
        data.forEach((element: any) => {
          if (filterId === element.filterId) {
            item.results.unshift(data)
          }
        })
      })
      setResultData(newResultData)
    }
  })
  )

  return (
    <div
      className={classNames("card-result card-result-panel", {
        'open': cardResultVisible
      })}
    >
      {
        resultData.personInfoData ?
          <>
            <div className="card-result-header">
              <div className="item-title">档案信息</div>
              <div className="fold-btn" onClick={() => handleFoldChange('personInfo')}>
                {
                  personInfoFold ?
                    <><Icon type="zhankaidaohang" />展开</>
                    :
                    <><Icon type="shouqidaohang" />收起</>
                }
              </div>
            </div>
            {
              personInfoFold ?
                ""
                :
                <div className="card-result-content">
                  <div className="person-info-wrap" style={{ backgroundColor: bgColor }}>
                    <PerosnInfo
                      personInfoData={resultData.personInfoData}
                    />
                  </div>
                </div>
            }
            <Divider style={{ margin: '15px 0' }} />
          </>
          : ''
      }
      <div className="card-result-header">
        <div className="item-title">轨迹信息 <span className="tip" title="1、多个上传目标比中，取最高相似度目标作为结果数据；2、人脸结果的其他维度抓拍不展示">1、多个上传目标比中，取最高相似度目标作为结果数据；2、人脸结果的其他维度抓拍不展示</span></div>
        <div className="btns">
          <Space size={16}>
            {/* <FilterBtn /> */}
            <ResulType />
            <TimeSortBtn />

          </Space>
        </div>
      </div>
      <div className="card-result-content" ref={resultConRef}>
        <ResultBox
          loading={ajaxLoading}
          nodata={!(resultData.faces && resultData.vehicles) || (resultData.faces && resultData.vehicles && (!resultData.faces.length && !resultData.vehicles))}
        >
          {
            cardResultVisible ? handleRenderCard()
              : ''
          }
        </ResultBox>
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
})

export default CardResult