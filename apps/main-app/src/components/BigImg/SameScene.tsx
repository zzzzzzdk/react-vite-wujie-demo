import React, { memo, useEffect, useMemo, useState, useContext } from "react"
import { Tabs, Loading } from '@yisa/webui'
import { SameSceneProps } from "./interface";
import character from "@/config/character.config"
import { ResultRowType } from "@/pages/Search/Target/interface";
import { Card, BottomRight } from '@/components'
import { ApiResponse } from "@/services";
import ajax from "@/services"
import noDataDark from '@/assets/images/image/search-nodata-dark.png'
import noDataLight from '@/assets/images/image/search-nodata-light.png'
import { BigImgContext } from "./context";
import { ImgInfoCard } from './components'
import './SameScene.scss'
import { RootState, useSelector } from "@/store";
import { groupByKey } from '@/utils'

const SameScene = (props: SameSceneProps) => {
  const {
    currentIndex = 0,
    // modalVisible,
    currentData,
    onSameScenceChange
  } = props

  const {
    selectedFeatureData,
    handleFeatureChange
  } = useContext(BigImgContext)
  const { skin } = useSelector((state: RootState) => state.comment)

  // 同画面目标
  const [activeTargetType, setActiveTargetType] = useState('all')
  const [dataGroup, setDataGroup] = useState<ResultRowType[][]>([])
  const [resultData, setResultData] = useState<ResultRowType[]>([])
  // const filterData = resultData.filter(item => activeTargetType === 'all' ? item : item.targetType === activeTargetType)
  const [ajaxLoading, setAjaxLoading] = useState(false)

  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)
  //类型分组
  const groupByKeyResult = groupByKey(resultData, "targetType")
  const filterData: ResultRowType[] = activeTargetType === 'all' ? resultData : (groupByKeyResult[activeTargetType] || [])
  const targetTypeOption = [{
    key: 'all',
    name: '全部'
  }].concat(character.targetTypes.map(item => {
    const len = (groupByKeyResult[item.value] || []).length
    if (!len) {
      return { key: "", name: "" }
    } else {
      return { key: item.value, name: `${item.label}(${len})` }
    }
  })).filter(item => item.key)

  // const currentData: ResultRowType = Array.isArray(data) && data[currentIndex] ? data[currentIndex] : ({} as ResultRowType)

  const handleChangeActiveTab = (key: string) => {
    setActiveTargetType(key)
    onSameScenceChange?.(groupByKeyResult[key] || resultData)
  }

  const analyzeSameScene = () => {
    setAjaxLoading(true)
    ajax.uploadImg<any, ResultRowType[]>({
      imageUrl: currentData?.bigImage,
      analysisType: 'full'
    }).then(res => {
      const { data = [], bigImage, dataGroup = [] } = res
      const result = data.map(item => (Object.assign({}, item, {
        bigImage: bigImage,
        captureTime: currentData?.captureTime,
        locationId: currentData?.locationId,
        locationName: currentData?.locationName,
        lngLat: currentData?.lngLat,
        carInfo: '', // 车辆类型不显示车型，只显示时间和地点
      })))
      setResultData(result)
      setDataGroup(dataGroup)
      onSameScenceChange?.(result)
      setAjaxLoading(false)
    }).catch(err => { })
  }

  useEffect(() => {
    setActiveTargetType('all')
    // if (currentData && currentData.feature) {
    //   analyzeSameScene()
    // }
    if (currentData && currentData.bigImage) {
      analyzeSameScene()
    }
  }, [currentIndex])

  const handleCardClick = (item: ResultRowType) => {
    const isExist = !!(selectedFeatureData?.filter(o => o['feature'] === item.feature).length)
    let newFeatureData = selectedFeatureData ? [...selectedFeatureData] : []

    if (isExist) {
      newFeatureData = newFeatureData.filter(o => o['feature'] !== item.feature)
    } else {
      newFeatureData.push({
        ...item,
        ...item.detection
      })
    }
    handleFeatureChange?.(newFeatureData)
  }

  return (
    <div className="same-scene">
      {
        !ajaxLoading && <Tabs
          activeKey={activeTargetType}
          onChange={(key) => handleChangeActiveTab(key)}
          data={targetTypeOption}
          type="line"
        />
      }
      <div className="same-scene-result">
        <Loading spinning={ajaxLoading}>
          {
            activeTargetType === "all" && dataGroup.length > 0 ?
              dataGroup.map((item, index) => {
                return (<div className="same-scene-container" key={index}>
                  <div className="title">目标{index + 1}</div>
                  <div className="imgs">
                    {
                      Array.isArray(item) ? item.map(item => <ImgInfoCard
                        key={item.feature + index}
                        data={{
                          ...item,
                          source: "sameScene",
                          captureTime: currentData?.captureTime || ""
                        }}
                      />)
                        : <div>暂无数据</div>
                    }
                  </div>
                </div>)
              })
              : filterData.length ?
                <div className="filter-data-container">
                  {
                    filterData.map((item, index) => {
                      return (
                        <ImgInfoCard
                          key={item.feature + index}
                          data={{
                            ...item,
                            source: "sameScene",
                            captureTime: currentData?.captureTime || ""
                          }}
                        />
                      )
                    })
                  }
                </div>
                :
                <div className="nodata">
                  {ajaxLoading ? '' :
                    <>
                      <img src={skin === "dark" ? noDataDark : noDataLight} alt="" />
                      <span>暂无数据</span>
                    </>}
                </div>
          }
        </Loading>
      </div>
      {
        bottomRightMapVisible &&
        <BottomRight
          name={currentData?.locationName || '--'}
          lat={currentData?.lngLat?.lat || null}
          lng={currentData?.lngLat?.lng || null}
          onClose={() => { setBottomRightMapVisible(false) }}
        />
      }
    </div>
  )
}

export default SameScene
