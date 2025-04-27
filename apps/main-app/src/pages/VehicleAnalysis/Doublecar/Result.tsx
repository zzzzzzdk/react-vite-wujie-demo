import React, { useState, useEffect } from "react";
import { Table, Image, Link, Button, Space, Popover } from '@yisa/webui'
import { ErrorImage, ResultBox } from '@yisa/webui_business'
import { Card, BottomRight, GroupTable, BigImg, Panel, MapAroundPoint } from "@/components";
import { ResultRowType} from "@/pages/Search/Target/interface";
import { DoublecarListType, DoubleCarResultProps } from './interface'
import DoubleCarCard from "./DoubleCarCard";
import { ImgListDataType } from "@yisa/webui_business/es/ImgPreview";
import ImgInfoCard from "@/pages/PersonAnalysis/Foothold/component/ImgInfoCard";

const TargetResult = (props: DoubleCarResultProps) => {
  const {
    loading = false,
    resultData,
    onCheckedChange,
    checkedList = []
  } = props

  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)
  const [imglist, setImg] = useState<DoublecarListType>({
    distance: "0",
    id: "0",
    speed: "0",
    timedifference: "0",
    doublecar: []
  })
  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })
  const [currentData,setCurrentData]=useState<ResultRowType>()
  const handleLocationClick = (data:ResultRowType) => {
    setBottomRightMapVisible(true)
    setCurrentData(data)
  }
  // 大图
  const handleOpenBigImg = (index: number, cardlist: ResultRowType[], totaldata: DoublecarListType) => {
    setImg(totaldata)
    console.log(totaldata);
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }
  const listItemRender = (data: ImgListDataType, index: number) => {
    const { targetImage } = data
    return <div className="doublecar-list-item-card">
      <span className="sign">{index == 0 ? "双胞胎车A" : "双胞胎车B"}</span>
      <ErrorImage
        src={targetImage}
      />
    </div>
  }
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }

  const BigImgInfoRender = (data: ResultRowType, currentIndex: number) => {
    let doubledata = {
      captureTimeA: imglist.doublecar[0].captureTime,
      locationNameA: imglist.doublecar[0].locationName,
      captureTimeB: imglist.doublecar[1].captureTime,
      locationNameB: imglist.doublecar[1].locationName,
      distance: imglist.distance,
      timedifference: imglist.timedifference,
      speed: imglist.speed
    }
    let footholdarr = {
      type: "doublecar" as "doublecar",
      data: [
        {
          ...imglist.doublecar[0].lngLat,
          locationName: imglist.doublecar[0].locationName
        }, {
          ...imglist.doublecar[1].lngLat,
          locationName: imglist.doublecar[1].locationName
        }]
    }
    return <div className="img-info-view-content-content">
      <div className="foothold-img-right-info">
        <Panel title="抓拍信息">
          <ImgInfoCard
            type="doublecar-goal"
            cardData={data}
          />
        </Panel>
        <Panel title="双胞胎车信息">
          <ImgInfoCard
            type="doublecar-message"
            cardData={doubledata}
          />
        </Panel>
        <div className="img-info-item info-map-wrap">
          <div className="item-con info-map">
            <MapAroundPoint
              locationId={data.locationId}
              lng={data.lngLat.lng}
              lat={data.lngLat.lat}
              footholdarr={footholdarr || {}}
            />
          </div>
        </div>
      </div>
    </div>
  }
  return (
    <div className="result-group">
      <ResultBox
        loading={loading}
        nodata={!resultData.data || (resultData.data && !resultData.data.length)}
      >
        {
          resultData.data?.map((item, index) => <DoubleCarCard
            checkedList={checkedList}
            key={item.id}
            cardData={item}
            handleOpenBigImg={handleOpenBigImg}
            handleLocationClick={handleLocationClick}
            onCheckedChange={onCheckedChange} />)
        }
      </ResultBox>
      <BigImg
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
        data={imglist.doublecar}
        showtab={false}
        disabledAssociateTarget={true}
        listItemRender={listItemRender}
        imgInfoRender={BigImgInfoRender}
      />
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

export default TargetResult
