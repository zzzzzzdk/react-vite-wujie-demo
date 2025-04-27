import React, { useState, useEffect, useRef } from "react";
import { Modal, Image, Tabs } from '@yisa/webui'
import { BigImg, GroupTable, GaitModal, BottomRight, Card, ResultHeader, IdentifyTargetModal } from "@/components";
import cn from 'classnames'
import { isFunction } from "@/utils";
import dictionary from '@/config/character.config'
import { changeFilterTags } from '@/store/slices/groupFilter';
import { useSelector, useDispatch, RootState } from '@/store'
import type { YituTargetResultProps } from "./interface";
import type { ResultRowType } from '@/pages/Search/Target/interface'
import type { TabsItem } from "@yisa/webui/es/Tabs/interface";
import type { GroupFilterCallBackType } from "@/components/Card/Normal/interface";
import GaitNumTip from "@/components/Card/Normal/GaitNumTip";

const ImageResult = (props: YituTargetResultProps) => {
  const {
    type = "person",
    pageSize,
    resultShowType = "image",
    data = [],
    resultData,
    onCheckedChange,
    checkedList = [],
    onGroupFilterChange,
    imageType = "image",
    onlyIncludeVehicleFlag,
    onlyIncludeCarFlag,
    resultHeaderRightTemplate,
    resultHeaderFilterTemplate,
    groupLoading = false
  } = props
  const dispatch = useDispatch()
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter
  })
  //每一行数量
  const [listCount, setListCount] = useState(8)
  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })
  //相似度大图
  const [opensimilarityModal, setOpensimilarityModal] = useState(false)
  // const currentMatches = useRef<ResultRowType>()
  const [currentMatches, setCurrentMatches] = useState<ResultRowType>()
  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)
  //身份落地选择项
  const [curClusterTab, setCurClusterTab] = useState(dictionary.clusterTabs[0].value)
  //身份落地tabs
  const [clusterTabs, setClusterTabs] = useState<TabsItem[]>(dictionary.clusterTabs.map(item => ({ key: item.value, name: item.label })))

  const currentData: ResultRowType = Array.isArray(data) && data[bigImgModal.currentIndex] ? data[bigImgModal.currentIndex] : ({} as ResultRowType)

  const handleCheckedChange = (data: { cardData: any, checked: boolean }) => {
    if (onCheckedChange && isFunction(onCheckedChange)) {
      onCheckedChange({ ...data, type })
    }
  }

  const handleGroupTableFilter = (id: string, text: string) => {
    console.log('selected id, text:', id, text)

    const newFilterTags = filterTags.concat({
      type: 'id',
      text: text,
      value: id
    })
    dispatch(changeFilterTags(newFilterTags))
    onGroupFilterChange?.({ filterTags: newFilterTags })
  }

  const handleCardFilter = ({ text, value, type, cardData }: GroupFilterCallBackType) => {
    const groupType = filterTags.length ? filterTags[filterTags.length - 1].value : 'licensePlate2'
    // 判断当前是一次识别车牌还是二次识别车牌分组
    const newFilterTags = filterTags.concat({
      type: 'id',
      text: cardData && cardData[groupType],
      value: cardData && cardData[groupType]
    })
    dispatch(changeFilterTags(newFilterTags))
    onGroupFilterChange?.({ filterTags: newFilterTags })
  }

  //比中点击
  const handlesimilarityNumberClick = (cardData: ResultRowType, index: number) => {
    // currentMatches.current = cardDataF
    setCurrentMatches(cardData)
    //身份落地有四种数据
    if (type === "person") {
      const clusterTypes = [cardData.matches.findIndex(item => item.clusterType === "idcard") > -1,
      cardData.matches.findIndex(item => item.clusterType === "captureFace") > -1,
      cardData.matches.findIndex(item => item.clusterType === "driverFace") > -1,
      cardData.matches.findIndex(item => item.clusterType === "pedestrian") > -1]
      const clusterTabs = dictionary.clusterTabs
        .filter((item, index) => clusterTypes[index])
        .map(item => ({ key: item.value, name: item.label }))
      setCurClusterTab(clusterTabs[0].key)
      setClusterTabs(clusterTabs)
    }
    setOpensimilarityModal(true)
    setBigImgModal({
      visible: false,
      currentIndex: index
    })
  }
  //比中弹窗的结果图被点击
  // const handleSimilarityTargetClick = () => {
  //   setBigImgModal({ ...bigImgModal, visible: true })
  // }

  //拖拽
  // const handledragStart = (e: React.DragEvent) => {
  //   console.log(e)
  // }
  //点位被点击
  const handleLocationClick = (index: number) => {
    setBottomRightMapVisible(true)
    setBigImgModal({
      visible: false,
      currentIndex: index
    })
  }

  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = type === "person" ? 436 : 208
      const width = (document.querySelector('.result-group')?.clientWidth || 0) - (type === "person" ? 104 : 126)
      const count = Math.floor(width / itemWidth)
      if (count >= 8 || count <= 2) {
        setListCount(count)
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

  const handleRenderCard = () => {
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          if (type === "person") {
            _template.push(
              <Card.PersonInfo
                // checked={checkedList.filter(item => item.infoId === data[j].infoId).length > 0}
                checked={false}
                showChecked={false}
                key={data[j].infoId}
                cardData={data[j]}
                onImgClick={() => handleOpenBigImg(j, data[j])}
                onChange={handleCheckedChange}
                onsimilarityNumberClick={(cardData) => handlesimilarityNumberClick(cardData, j)}
              // onImgDragStart={handledragStart}
              // showImgZoom={false}
              />
            )
          } else if (type === "target") {
            const showZoom = data[j].targetType === 'vehicle' || data[j].targetType === 'bicycle' || data[j].targetType === 'tricycle'
            _template.push(
              <Card.Normal
                checked={checkedList.filter(item => item.infoId === data[j].infoId).length > 0}
                key={data[j].infoId}
                cardData={data[j]}
                onImgClick={() => handleOpenBigImg(j)}
                onChange={handleCheckedChange}
                onsimilarityNumberClick={(cardData) => handlesimilarityNumberClick(cardData, j)}
                // onImgDragStart={handledragStart}
                onFilterChange={handleCardFilter}
                onLocationClick={() => { handleLocationClick(j) }}
                showImgZoom={showZoom}
                draggable={true}
                showCaptureTime={true}
                showLocation={true}
                pageName="image"
              />
            )
          }
        } else {
          _template.push(<div className={cn("card-item-flex", { "person": type === "person" })} key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  const handleRenderGroup = () => {
    console.log(onlyIncludeVehicleFlag, '_onlyIncludeVehicleFlag')
    return (
      <GroupTable
        data={data}
        pageSize={pageSize}
        tableConfig={{
          name: filterTags[filterTags.length - 1]?.tableName,
          countTitle: onlyIncludeVehicleFlag ? '过车数量' : '数量'
        }}
        onSelect={handleGroupTableFilter}
      />
    )
  }

  // 大图 ,身份信息可以打开聚类档案
  const handleOpenBigImg = (index: number, data?: ResultRowType) => {
    //身份信息没有大图,点击可以跳转档案
    if (type === "person") {
      const { personBasicInfo: { idcard = "", idType = "", groupId = "", groupPlateId = '' } = {}, feature = '' } = data || {}
      window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({ 
        idNumber: idcard === '未知' ? '' : idcard, 
        groupId: groupId ? groupId : [], 
        groupPlateId: groupPlateId ? groupPlateId : [], 
        idType: idType || '111', 
        feature: feature || '' 
      }))}`)
      return
    }
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }

  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }

  const handleTabsChange = (key: string) => {
    setCurClusterTab(key)
  }

  return (
    <>
      {
        type === "target" && !!data?.length && <>
          {resultHeaderFilterTemplate}
          <ResultHeader
            targetType={onlyIncludeVehicleFlag ? "vehicle" : "face"}
            pageType="target"
            className="outcomes-header"
            resultData={resultData}
            rightSlot={resultShowType === "group" ? "" : resultHeaderRightTemplate}
            onGroupFilterChange={onGroupFilterChange}
            groupFilterDisabled={groupLoading}
          />
        </>
      }
      {
        type === "person" && !!data?.length && <ResultHeader
          targetType={"face"}
          pageType="record"
          className="outcomes-header"
          resultData={resultData}
          rightSlot={""}
          onGroupFilterChange={onGroupFilterChange}
          groupFilterDisabled={true}
          needgroupchoose={false}
        />
      }
      <div className="result-group">
        {
          resultShowType === "image" &&
          <>
            {handleRenderCard()}
            {
              imageType === "image" && <BigImg
                modalProps={{
                  visible: bigImgModal.visible,
                  onCancel: handleCloseBigImg
                }}
                currentIndex={bigImgModal.currentIndex}
                onIndexChange={(index) => {
                  setBigImgModal({
                    visible: true,
                    currentIndex: index
                  })
                }}
                data={data}
              />
            }
            {
              imageType === "gait" && <GaitModal
                gaitModalVisible={bigImgModal.visible}
                onCancel={handleCloseBigImg}
                currentIndex={bigImgModal.currentIndex}
                data={data}
              />
            }
          </>
        }
        {
          resultShowType === "group" && handleRenderGroup()
        }
        {
          bottomRightMapVisible &&
          <BottomRight
            name={currentData.locationName || '--'}
            lat={currentData.lngLat?.lat || null}
            lng={currentData.lngLat?.lng || null}
            onClose={() => { setBottomRightMapVisible(false) }}
          />
        }
        <IdentifyTargetModal
          data={currentMatches || {} as ResultRowType}
          visible={opensimilarityModal}
          onCancel={() => { setOpensimilarityModal(false) }}
          type={type}
        />
      </div>

    </>
  )
}

export default ImageResult
