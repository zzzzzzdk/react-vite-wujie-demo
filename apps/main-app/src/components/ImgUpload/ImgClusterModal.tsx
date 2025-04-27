import React, { useState, useEffect, useRef } from 'react'
import { Button, Divider, Modal, Message } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import { ImgClusterModalProps } from './interface'
import './index.scss'
import Panel from '../Panel'
import { ErrorImage } from '@yisa/webui_business'
import CardNormal from '../Card/Normal'

export default function (props: ImgClusterModalProps) {
  const {
    visible,
    handleClusterConfirm,
    handleClusterCancel,
    data,
  } = props

  const prefixCls = "img-cluster-modal"

  const [curIndex, setCurIndex] = useState(-1)

  const handleCancel = () => {
    setCurIndex(-1)
    handleClusterCancel?.()
  }

  const handleConfirm = () => {
    if (curIndex === -1) {
      Message.warning("请选择档案！")
      return
    }
    setCurIndex(-1)
    data?.target && handleClusterConfirm?.(data.result[curIndex])
  }

  return (
    (
      <Modal
        title='人员档案选择'
        wrapClassName={`${prefixCls}`}
        visible={visible}
        maskClosable={false}
        // onOk={handleOk}
        onCancel={handleCancel}
        // centered={true}
        footer={null}
        escToExit={false}
        width={1065}
      >
        <div className={`${prefixCls}-wrapper`}>
          <Panel
            title="已上传图片"
            className="cluster-target"
          >
            <div className="cluster-target-container">
              <ErrorImage src={data?.target.targetImage || ""} />
            </div>
          </Panel>
          <Panel
            className="cluster-result"
            title="人员抓拍档案图片"
          >
            <div className="cluster-result-wrapper">
              <ul className="img-container">
                {
                  data?.result.map((item, index) => <li key={index}>
                    <CardNormal
                      cardData={{
                        ...item,
                        personBasicInfo: {
                          ...(item.personBasicInfo || {}),
                          idcard: item.personBasicInfo?.idcard || '未知'
                        }
                      }}
                      showChecked={false}
                      hasfooter={false}
                      onCardClick={() => { setCurIndex(index) }}
                      checked={curIndex === index}
                    />
                  </li>)
                }
              </ul>
              <Divider />
              <div className="result-buttons">
                <span><Icon type="tishi" /><em>仅可选择一张人员抓拍档案</em></span>
                <Button onClick={handleCancel}>取消</Button>
                <Button type="primary" onClick={handleConfirm}>确认</Button>
              </div>
            </div>
          </Panel>
        </div>
      </Modal>
    )

  )
}

