import React from 'react'
import './index.scss'
type IllegalListType = {
  data: {
    violationType?: string
    violationAddress?: string
    driver?: string
    plateColorTypeId?: string
    licensePlate?: string
    penaltyAmount?: string
    violationPenaltyPoints?: string
    violationTime?: string
  }[]
  type?: "vehicle" | "owner"
}

export default function IllegalList(props: IllegalListType) {
  const {
    data,
    type = "vehicle"
  } = props
  return (
    <div className='record-vehicle-illegal-list'>
      {
        data.map((item, index) => {
          return (
            <div className="item-illegal-info" key={index}>
              <div className="info-index">{index + 1}</div>
              <div className="item-illegal-content">
                <div className='title'>违章类型：{item.violationType || '--'}</div>
                <div className='location'>违章地点：{item.violationAddress || '--'}</div>
                {
                  type === 'owner' ?
                    <div className='party'>当事人：{item.driver || '--'}</div>
                    :
                    <div className='party'>车牌号：
                      <span className={`plate-bg plate-color-${item.plateColorTypeId}`}>{item.licensePlate}</span>
                    </div>
                }
                <div className='penalty-amount'>罚款金额：{item.penaltyAmount || '--'}</div>
                <div className='illegal-scoring'>违法记分数：{item.violationPenaltyPoints || '0'}</div>
                <div className='illegal-time'>违章时间：{item.violationTime || '--'}</div>
              </div>
            </div>
          )
        })
      }
    </div>

  )
}

