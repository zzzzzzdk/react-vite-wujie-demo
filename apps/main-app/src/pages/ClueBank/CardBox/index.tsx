import React, { useState } from 'react'
import { Checkbox, Image} from '@yisa/webui'
import { ImgZoom } from '@yisa/webui_business'
import { Icon } from '@yisa/webui/es/Icon'
import FooterLinks from '@/components/Card/FooterLinks'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import CluefooterLinks from './CluefooterLinks'
import { isFunction } from "@/utils";
import './index.scss'
function CardBox(props: any) {
  const {
    checked = false,
    onChange,
    cardData = {},
    linkEleClick,
    showImgZoom = false
  } = props
  const [stateChecked, setStateChecked] = useState(checked)
  const isChecked = 'checked' in props ? checked : stateChecked

  const handleCheckedChange = (event: CheckboxChangeEvent) => {
    // console.log(props,'11')
    // if (!('checked' in props)) {
    //   setStateChecked(event.target.checked)
    // }
    console.log(event.target.checked,777);
    
    if (onChange && isFunction(onChange)) {
      onChange({
        cardData: cardData,
        checked: event.target.checked
      })
    }
  }
  const timeinfo = (time: string) => {
    return (
      <div className='person-info'><Icon type="shijian" />{time}</div>
    )
  }
  const placeinfo = (place: string) => {
    return (
      <div className='person-info'><Icon type="didian" />{place}</div>
    )
  }
  const addtimeinfo = (jiontime: string) => {
    return (
      <div>
        <div className='add-title'>加入时间：</div>
        <div className='person-info'><Icon type="shijian" />{jiontime}</div>
      </div>
    )
  }
  const nameinfo = (name: string) => {
    return (
      <div className='person-info'><Icon type="gerenzhongxin" />{name}</div>
    )
  }
  return (
    <div className={`card-box ` + (checked ? 'ischecked' : '')}>
      <div className='title-top'>
        <span>11</span><span>.{11}%</span>
      </div>
      <div className='content-box'>
        <Checkbox
          className="card-checked"
          checked={checked}
          onChange={handleCheckedChange}
        />
        <div className='card-img'>
          {/* <Image className='image' src={cardData.targetImage} /> */}
          {
            showImgZoom ?
              <ImgZoom imgSrc={cardData.targetImage} />
              :
              <Image src={cardData.targetImage} />
          }
        </div>
        <div className='person-item'>
          {/* <div className='time-info'>2023-10-11</div> */}
          {
            timeinfo(cardData.time)
          }
          {/* <div className='place-info'>以萨熟悉熟悉熟悉熟悉熟悉</div> */}
          {
            placeinfo(cardData.place)
          }
          {/* <div className='addtime-info'>1</div> */}
          {
            addtimeinfo(cardData.jiontime)
          }
          {/* <div className='name-info'>孔繁宇</div> */}
          {
            nameinfo(cardData.name)
          }
        </div>
      </div>
      {/* <div className='title-bottom'> */}
      {/* <CluefooterLinks eleClick={linkEleClick} cardData={cardData} /> */}
      <FooterLinks eleClick={linkEleClick} cardData={cardData}></FooterLinks>
      {/* </div> */}
    </div>
  )
}


export default CardBox
