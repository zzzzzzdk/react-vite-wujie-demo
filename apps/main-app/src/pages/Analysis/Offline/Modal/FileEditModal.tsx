import React, { useState, useEffect } from "react";
import BaseModalProps from "./interface";
import { Modal, Form, Input, Message } from '@yisa/webui'
import { isFunction } from "@/utils";
import OfflineTreeSelect from "./OfflineTreeSelect";

const FileEditModal = (props: BaseModalProps) => {
  const {
    modalProps,
    onModalConfirm,
    data
  } = props

  const [stateData, setStateData] = useState(data)

  useEffect(() => {
    setStateData(data)
  }, [data])

  const handleTreeSelectChange = (value: string) => {
    setStateData(Object.assign({}, stateData, {
      jobId: value
    }))
  }

  const handleInputChange = (e: any) => {
    setStateData(Object.assign({}, stateData, {
      fileName: e.target.value
    }))
  }

  const handleOk = () => {
    if (!stateData?.jobId) {
      Message.warning('修改归属分组不可为空！')
      return
    }
    // console.log(stateData)
    if (onModalConfirm && isFunction(onModalConfirm)) {
      onModalConfirm({
        ...stateData,
        fileId: stateData?.fileId ? [stateData.fileId] : []
      })
    }
  }

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
  }

  return (
    <Modal
      title="修改"
      {...(modalProps || {})}
      className="offline-modal"
      onOk={handleOk}
      onCancel={handleCancel}
      unmountOnExit
    >
      <Form>
        <Form.Item label="文件名称">
          <Input
            placeholder="请输入任务名称"
            value={stateData?.fileName || ''}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item label="归属分组">
          <OfflineTreeSelect
            value={stateData?.jobId ? `${stateData.jobId}` : ''}
            onChange={handleTreeSelectChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default FileEditModal