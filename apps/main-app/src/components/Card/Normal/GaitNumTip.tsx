import React from "react";
import { Icon } from '@yisa/webui/es/Icon'
import { logReport } from "@/utils/log";
import character from "@/config/character.config"

export interface GaitNumTipProps {
  cardData: any;
}

const GaitNumTip = (props: GaitNumTipProps) => {
  const { cardData = {} } = props

  const handleJump = (e: React.MouseEvent) => {
    e.stopPropagation()
    // 日志提交
    logReport({
      type: 'gait',
      data: {
        desc: `图片【1】-【快捷操作：步态检索】`,
        data: cardData
      }
    })
    window.open(`#/image?featureList=${encodeURIComponent(JSON.stringify([{ ...cardData, isGait: true }]))}&isGait=1`)
  }

  return (
    character.hasGait ?
      <span className="gait-number" onClick={handleJump}>
        <Icon type="butai" />
        {cardData?.gaitObjectNumber ? cardData.gaitObjectNumber
          :
          cardData?.gaitMaskUrl ? cardData?.gaitMaskUrl?.length : 0}
      </span>
      :
      null
  )
}

export default GaitNumTip
