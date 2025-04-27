import React, { useState, useEffect } from "react";
import { Modal, Form, DatePicker, Message } from '@yisa/webui'
import BaseModalProps from "./interface";
import { isObject, isFunction } from "@/utils";
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const TimeSetModal = (props: BaseModalProps) => {
  const {
    modalProps,
    onModalConfirm
  } = props

  const [timeValue, setTimeValue] = useState(props.data && isObject(props.data) && props.data.userTime ? props.data.userTime : dayjs().format('YYYY-MM-DD HH:mm:ss'))

  useEffect(() => {
    let date = props.data && isObject(props.data) && props.data.userTime ? props.data.userTime : dayjs().format('YYYY-MM-DD HH:mm:ss')
    setTimeValue(date)
  }, [props.data])

  const onChange = (value: Dayjs | null, dateString: string) => {
    console.log(value, dateString)
    setTimeValue(dateString)
  }

  const handleOk = () => {
    if (!timeValue) {
      Message.warning('时间不能设置为空')
      return
    }
    if (onModalConfirm && isFunction(onModalConfirm)) {
      onModalConfirm(timeValue)
    }
    // resetLatlng()
  }

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
    // resetLatlng()
  }

  return (
    <Modal
      title="请设置时间"
      {...(modalProps || {})}
      className="offline-modal"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form>
        <Form.Item label="拍摄时间">
          <DatePicker
            onChange={onChange}
            value={timeValue ? dayjs(timeValue) : null}
            showTime
            disabledDate={(date: Dayjs) => {
              return dayjs(date).isAfter(dayjs())
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TimeSetModal