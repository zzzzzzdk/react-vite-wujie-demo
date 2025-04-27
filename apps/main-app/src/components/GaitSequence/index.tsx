import { Icon, RightOutlined } from '@yisa/webui/es/Icon'
import classNames from 'classnames'
import GaitSequenceProps from "./interface"
import GaitSequenceList from './List'
import GaitSequenceModal from './Modal'
import './index.scss'
import { useState, useEffect } from 'react'
import { isEmptyObject } from '@/utils/is'

const GaitSequence = (props: GaitSequenceProps) => {
  const {
    className,
    style,
    data,
    isConditionFlag = false,
    isResultFlag = false
  } = props
  const prefixCls = "gait-sequence"
  const [modalVisible, setModalVisible] = useState(false)


  const handleGaitSearch = () => {
    window.open(`#/image?featureList=${encodeURIComponent(JSON.stringify([{ ...data, isGait: true }]))}&isGait=1`)
  }


  return (
    <div className={classNames(prefixCls, className)} style={style}>
      <div className={`${prefixCls}-header`}>
        <div className={`${prefixCls}-title`}>
          步态序列图（{!isConditionFlag ? data?.gaitObjectNumber : data && Array.isArray(data.matches) && data.matches.length > 0 ? data.matches[0].gaitObjectNumber : 0}）
          <span className='tip'>【按住左键可拖动图像】</span>
        </div>
        <div className={`${prefixCls}-more`} onClick={handleGaitSearch}>
          {/* 查看更多<RightOutlined /> */}
          步态检索
        </div>
      </div>
      <div className={`${prefixCls}-con`}>
        <GaitSequenceList
          data={!isConditionFlag ? data : data && Array.isArray(data.matches) && data?.matches.length > 0 ? data?.matches[0] : undefined}
          onGaitSequenceListClick={() => {
            setModalVisible(true)
          }}
        />
      </div>
      <GaitSequenceModal
        modalProps={{
          visible: modalVisible,
          onCancel: () => setModalVisible(false)
        }}
        data={{ resultData: data, conditionData: (isConditionFlag || isResultFlag) && data && Array.isArray(data.matches) && data.matches.length > 0 ? data.matches[0] : undefined }}
      />
    </div>
  )
}

GaitSequence.List = GaitSequenceList
GaitSequence.Modal = GaitSequenceModal

export default GaitSequence
