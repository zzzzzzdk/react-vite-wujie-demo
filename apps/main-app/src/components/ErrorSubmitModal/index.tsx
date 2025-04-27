import React, { useEffect, useState } from 'react'
// import { Modal } from 'antd'
import { Icon } from '@yisa/webui/es/Icon'
import { Modal, Message, Button, Input, Form, Upload, Radio } from '@yisa/webui'
// import { FormSelectionBox, FormTextarea, Icon } from '../../basic'
import services from '@/services'
import './index.scss'
import { ErrorSubmitPropsType } from './interface'

const errorType = [
  {
    value: "0",
    label: "图片识别错误"
  },
  {
    value: "1",
    label: "车牌识别错误"
  },
  {
    value: "2",
    label: "设备时间错误"
  },
  {
    value: "3",
    label: "卡口位置错误"
  },
  {
    value: "4",
    label: "其他"
  },
]

function ErrorSubmitModal(props: ErrorSubmitPropsType) {
  const { carryData, onOk, modalVisible = true, onCancel, errorTypes = errorType } = props
  const [typeVal, setTypeVal] = useState("0")
  const [reason, setReason] = useState("")

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    resetVal()
  }

  useEffect(() => {
    if (typeVal == errorTypes[0].value) return
    setTypeVal(errorTypes[0].value)
  }, [errorTypes])

  const handleConfirm = () => {
    //纠错类型具体判断
    let type='0'//普通类型
    if(carryData.matches?.length>0){
      // type="1"
      if(carryData.isGait){
        type="3"//步态检索
      }
      else{
        type="2"//以图检索
      }
    }
    else {
      if(carryData.isGait){
        type="1"//普通步态
      }
    }
    let _form = {
      type: typeVal,
      reason: reason
    }
    let _data = {
      errorType: _form.type,
      errorContent: _form.reason,
      ...carryData,
      type:type
    }
    services.handleFeedback(_data).then(res => {
      if (onOk) {
        onOk()
      }
      Message.success('纠错提交成功')
      resetVal()
    }).catch(error => {
      Message.warning('纠错提交失败')
      return
    })
  }

  const resetVal = () => {
    setTypeVal("0")
    setReason("")
  }
  const onChangeType = (v: string) => {
    setTypeVal(v)
  }
  const onChangeTextarea = (value: string) => {
    setReason(value)
  }
  return (
    <Modal
      visible={modalVisible}
      wrapClassName="error-submit-modal"
      title="纠错"
      onCancel={handleCancel}
      onOk={handleConfirm}
    >
      <div className="error-submit-modal-con">
        <Radio.Group options={errorTypes} value={typeVal} onChange={(e: any) => {
          onChangeType(e.target.value)
        }} />
        <div className='text-tixing'>请输入纠错说明：</div>
        <Input.TextArea
          maxLength={200}
          showWordLimit
          // style={m}
          value={reason}
          onChange={(e, value) => { onChangeTextarea(value) }}
          autoSize={{ minRows: 6 }}
          placeholder='请输入纠错说明'
        />
      </div>
    </Modal>
  )
}

export default ErrorSubmitModal
