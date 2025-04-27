import React, { useState, useRef } from 'react'
import { PersonInfoDataType } from '../interface'
import { Image, Popover, Message, Modal } from '@yisa/webui'
import { RelateData } from '../../record/detail/interface';
import { IdentifyTargetModal } from '@/components';
import { ResultRowType } from "@/pages/Search/Target/interface";

export interface PersonInfoProps {
  personInfoData: PersonInfoDataType;
}

const PerosnInfo = (props: PersonInfoProps) => {
  const {
    personInfoData
  } = props
  const tagNum = 3

  //相似度大图-比中项
  const [opensimilarityModal, setOpensimilarityModal] = useState(false)
  const currentMatches = useRef<ResultRowType>()

  //比中几项
  const handlesimilarityNumberClick = () => {
    if (!personInfoData?.matches?.length) {
      Message.warning("未比中目标")
      return
    }
    //比中点击
    currentMatches.current = personInfoData as unknown as ResultRowType
    setOpensimilarityModal(true)
  }

  const handlePersonInfoImgClick = () => {
    const { personBasicInfo: { idcard = "", idType = "", groupId = "", groupPlateId = '' } = {}, feature = '' } = personInfoData || {}
    window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({ 
      idNumber: idcard === '未知' ? '' : idcard, 
      groupId: groupId ? groupId : [], 
      groupPlateId: groupPlateId ? groupPlateId : [], 
      idType: idType || '111', 
      feature: feature || '' 
    }))}`)
  }

  return (
    <>

      <div className="person-info-card">
        <div className="img-wrap" onClick={handlePersonInfoImgClick}><Image src={personInfoData.targetImage} /></div>
        <div className="base-info">
          <div className="name">{personInfoData.personBasicInfo.name || '暂未实名'}</div>
          {
            /^[\dXx]+$/.test(personInfoData.personBasicInfo.idcard)
              ?
              <a href={`#/record-detail-person?${encodeURIComponent(
                JSON.stringify({ 
                  idNumber: personInfoData.personBasicInfo.idcard === '未知' ? '' : personInfoData.personBasicInfo.idcard, 
                  groupId: Array.isArray(personInfoData.personBasicInfo?.groupId) ? personInfoData.personBasicInfo?.groupId : [personInfoData.personBasicInfo?.groupId],
                  idType: personInfoData.personBasicInfo.idType || '111' 
                }))}`}
                className="card-info-content link" target="_blank" title={personInfoData.personBasicInfo.idcard}>{personInfoData.personBasicInfo.idcard || '-'}</a>
              :
              <div className="card-info-content" title={personInfoData.personBasicInfo.idcard}>{personInfoData.personBasicInfo.idcard || '-'}</div>
          }
          <div className="person-tags">
            {
              personInfoData?.personTags && personInfoData?.personTags?.length ?
                <ul className="tags">
                  {
                    personInfoData.personTags.slice(0, personInfoData.personTags.length > tagNum ? tagNum - 1 : tagNum).map((item: any, index: number) => <li key={index} title={item.name} className={`label-item label-item-${item.color}`}>{item.name}</li>)
                  }
                  {
                    personInfoData.personTags.length > tagNum ?
                      <Popover
                        placement="top"
                        content={personInfoData.personTags.map((elem: any, index: number) => <li key={index} className={`label-item label-item-${elem.color}`} title={elem.name}>{elem.name}</li>)}
                        overlayClassName="popover-person-tag"
                      >
                        <li key='...' className="label-item more">+{personInfoData.personTags.length - (tagNum - 1)}</li>
                      </Popover>
                      : null
                  }
                </ul>
                : <span className="ysd-icon">-</span>
            }
          </div>
        </div>
        {
          !!personInfoData.matches?.length ?
            <span onClick={handlesimilarityNumberClick} className="matches">比中<span>{personInfoData.matches?.length || 0}</span>项</span>
            : ""
        }
      </div>
      <Modal
        title={`识别目标（${currentMatches.current?.matches?.length || 0}个结果）`}
        visible={opensimilarityModal}
        footer={null}
        onCancel={() => { setOpensimilarityModal(false) }}
        className="similarity-container-modal"
        width={1050}
      >
        <ul className="similarity-container">
          {
            currentMatches.current?.matches?.map((item, index) => {
              const { similarity } = item
              const calcsimilarity = isNaN(Number(similarity)) ? ["00", "00"] : String(similarity).split(".").length === 2 ? String(similarity).split(".") : [String(similarity), "00"]
              return <li key={index} className="similarity-container-item">
                <div className="image" data-text="检索条件"><Image src={item.featureImage} /></div>
                <span className="similarity"><em>{calcsimilarity[0]}</em><em>.{calcsimilarity[1]}%</em></span>
                <div
                  className="image"
                  data-text="检索结果"
                >
                  <Image src={item.targetImage} />
                </div>
              </li>
            })
          }
        </ul>
      </Modal>
      <IdentifyTargetModal
        data={(currentMatches.current || {} as ResultRowType)}
        visible={opensimilarityModal}
        onCancel={() => { setOpensimilarityModal(false) }}
      />
    </>
  )
}

export default PerosnInfo