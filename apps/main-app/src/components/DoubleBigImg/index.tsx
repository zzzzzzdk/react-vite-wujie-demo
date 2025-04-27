import React, { useState, useEffect, useRef } from 'react'
import { BigImg } from '@/components'
import BigImgProps from '../BigImg/interface'
import { ResultRowType } from '@/pages/Search/Target/interface'

export default function (props: BigImgProps) {

  //额外弹窗
  const [wrapperBigImg, setWrapperBigImg] = useState({
    visible: false,
    currentIndex: 0
  })
  const [wrapperBigImgData, setWrapperBigImgData] = useState<ResultRowType[]>([])
  const handleWrapperBigImgClose = () => {
    setWrapperBigImg({
      visible: false,
      currentIndex: 0
    })
  }

  const handleConnectItemClick = (item: ResultRowType) => {
    setWrapperBigImgData([item])
    setWrapperBigImg({
      visible: true,
      currentIndex: 0
    })
  }

  return (
    <>
      <BigImg
        {...props}
        onConnectItemClick={handleConnectItemClick}
      />
      <BigImg
        modalProps={{
          visible: wrapperBigImg.visible,
          onCancel: handleWrapperBigImgClose,
        }}
        currentIndex={0}
        data={wrapperBigImgData}
        wrapClassName="big-img-modal-double"
        disabledAssociateTarget={true}
        mapId="big-img-modal-double"
      />
    </>)
}

