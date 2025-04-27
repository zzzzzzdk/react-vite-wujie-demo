import React, { useState } from "react";
import './index.scss'
import { Image, Tooltip, Checkbox, Modal, Message } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import SearchPersonInfoType from './interface'
import './index.scss'

function SearchPersonCard(props:SearchPersonInfoType) {
  const {
    cardtype='row',
    tag,
    // name,
    // personId
    cardData
  } = props
  const prefixCls = "card-searchperson-item"
  return (
         <div className={`${prefixCls}-wrapper ${cardtype}`}>
        <div
          className={`card-img`}
        >
          {
            tag?<span className={'tag'}>{tag}</span>:''
          }
          <div
            className="card-img-inner"
          >
            <Image src={cardData.targetImage} />
          </div>
        </div>
        <div className={`${prefixCls}-wrapper-right`}>
              <div className="person-item">
                <div className='person-info'><Icon type="xingming" />{cardData.name||"未知"}</div>
                <div className='person-info'><Icon type="shenfenzheng" />{cardData.personId||"未知"}</div>
              </div>
        </div>
      </div>
  )
}

export default SearchPersonCard


