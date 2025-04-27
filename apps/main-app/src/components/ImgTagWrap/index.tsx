import React from 'react'
import { Image } from '@yisa/webui'
import dictionary from '@/config/character.config'
import ImgTagWrapProps from './interface'
import './index.scss'
import { ResultRowType } from '@/pages/Search/Target/interface'
import { arrayBuffer } from 'node:stream/consumers'

function ImgTagWrap(props: ImgTagWrapProps) {
  const {
    currentData,
    data,
    handleImgClick = () => { }
  } = props

  const onHandleImgClick = (_data: ResultRowType) => {
    handleImgClick(_data)
  }
  return (
    <div className="img-tag-wrap">
      {
        currentData && <div className="img-wrap" onClick={() => onHandleImgClick(currentData)} key={currentData.infoId}>
          <div className="tag-name">{dictionary.featureTypeToText[currentData.targetType]}</div>
          <Image src={currentData.targetImage} />
        </div>
      }
      {
        data.targetImage &&
          <div className="img-wrap" onClick={() => onHandleImgClick(data)} key={data.infoId}>
            <div className="tag-name">{dictionary.featureTypeToText[data.targetType]}</div>
            <Image src={data.targetImage} />
          </div>
      }

      {/* <div className="img-info">
                <div>
                    <label>性别：</label>
                    <span>{data.target?.sex || '--'}</span>
                </div>
                <div>
                    <label>年龄：</label>
                    <span>{data.target?.age || '--'}</span>
                </div>
                <div>
                    <label>上衣颜色：</label>
                    <span>{data.target?.coat_color || '--'}</span>
                </div>
                <div>
                    <label>下衣颜色：</label>
                    <span>{data.target?.dress_color || '--'}</span>
                </div>
            </div> */}
    </div>
  )
}

export default ImgTagWrap
