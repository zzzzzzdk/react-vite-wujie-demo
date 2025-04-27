
import './index.scss'
import React, { useEffect, useRef, useState } from 'react'
import { Card } from '@/components'
import './index.scss'
const ClothSameInfo = (props: any) => {
  const {
    data = {
      date: '2023-12-01',
      details: [{}, {}],
      dateCount: 0
    },
    hasMore = true,
    onClickMore = () => { },
    handleDetailClick = () => { },
  } = props
  return <div className="clothing-same" onClick={() => handleDetailClick(0)}>
    <div className="clothing-data">
      {
        data.details?.map((item: any, index: number) => {
          return <Card.ClothInfo isShowGait={true} isSameDay={true} key={index} cardData={item} onCardClick={(e: any) => {
            e.stopPropagation()
            handleDetailClick(index)
          }} />
        })
      }
    </div>
    <div className="capture-time">
      {data.date} ({data.dateCount})
    </div>
    {
      hasMore && (data.details?.length > 2) ?
        <div className="title-right" onClick={onClickMore}>查看更多{'>'}</div>
        : null
    }
  </div>
}
export default ClothSameInfo
