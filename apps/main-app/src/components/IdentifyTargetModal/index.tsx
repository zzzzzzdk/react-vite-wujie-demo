import React, { useState, useEffect, useRef } from 'react'
import { Modal, Tabs, Image } from '@yisa/webui'
import GaitNumTip from "@/components/Card/Normal/GaitNumTip";
import dictionary from '@/config/character.config'
import type IdentifyTargetProps from './interface'
import type { TabsItem } from "@yisa/webui/es/Tabs/interface";
import './index.scss'

export default function IdentifyTargetModal(props: IdentifyTargetProps) {
  const {
    title = "",
    type = "person",
    visible,
    onCancel,
    data,
  } = props

  const clusterTypes = [
    data?.matches?.findIndex(item => item.clusterType === "idcard") > -1,
    data?.matches?.findIndex(item => item.clusterType === "captureFace") > -1,
    data?.matches?.findIndex(item => item.clusterType === "driverFace") > -1,
    data?.matches?.findIndex(item => item.clusterType === "pedestrian") > -1
  ]
  const clusterTabs = dictionary.clusterTabs
    .filter((item, index) => clusterTypes[index])
    .map(item => ({ key: item.value, name: item.label }))

  //身份落地选择项
  const [curClusterTab, setCurClusterTab] = useState(dictionary.clusterTabs[0].value)

  const handleTabsChange = (key: string) => {
    setCurClusterTab(key)
  }

  useEffect(() => {
    //身份落地选择项
    if (type === "person") {
      setCurClusterTab(clusterTabs?.[0]?.key || dictionary.clusterTabs[0].value)
    }
  }, [data])


  return (
    <Modal
      title={title || `识别目标（${data?.matches?.length || 0}个结果）`}
      visible={visible}
      footer={null}
      onCancel={onCancel}
      className="similarity-container-modal"
      width={1050}
    >
      {type === "person" && <Tabs type="line" data={clusterTabs} activeKey={curClusterTab} onChange={handleTabsChange} />}
      <ul className="similarity-container">
        {
          data?.matches
            ?.filter(item => type === "person" ? item.clusterType === curClusterTab : true)
            ?.map((item, index) => {
              const { similarity } = item
              const calcsimilarity = isNaN(Number(similarity)) ? ["00", "00"] : String(similarity).split(".").length === 2 ? String(similarity).split(".") : [String(similarity), "00"]
              return <li key={index} className="similarity-container-item">
                <div
                  className="image"
                  data-text="检索条件"
                >
                  <Image src={type === "person" ? item.featureImage : item.targetImage} />
                </div>
                <span className="similarity">
                  <em>{calcsimilarity[0]}</em>
                  <em>.{calcsimilarity[1]}%</em>
                </span>
                <div
                  className="image"
                  data-text="检索结果"
                // onClick={handleSimilarityTargetClick}
                >
                  <Image src={type === "person" ? item.targetImage : data?.targetImage} />
                  {
                    (data?.targetType === "face" || data?.targetType === "pedestrian") && !!data?.gaitMaskUrl?.length &&
                    <GaitNumTip cardData={data} />
                  }
                </div>
              </li>
            })
        }
      </ul>
    </Modal>

  )
}

