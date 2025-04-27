import React, { useState } from "react";
import { CreateTrackBtnProps } from './interface'
import { Button, Message } from '@yisa/webui'
import services from "@/services";
import { logReport } from "@/utils/log";
import './index.scss'

const CreateTrackBtn = (props: CreateTrackBtnProps) => {
  const {
    disabled = false,
    checkedList = []
  } = props

  const [ajaxLoading, setAjaxLoading] = useState(false)

  const handleCreateTrack = () => {
    if (!checkedList.length) {
      Message.warning('无数据选中项')
      return
    }

    // 日志提交
    logReport({
      type: 'image',
      data: {
        desc: `图片【${checkedList.length}】-【批量操作：生成轨迹】`,
        data: checkedList
      }
    })

    setAjaxLoading(true)
    services.getTrackId({
      targetList: checkedList
    }).then(res => {
      console.log(res)
      setAjaxLoading(false)
      window.open(`#/create-track?id=${res.id}`)
    }).catch(error => {
      setAjaxLoading(false)
      console.log(error)
    })
  }

  return (
    <Button
      disabled={disabled}
      size='small'
      onClick={handleCreateTrack}
      className="create-track-btn"
      loading={ajaxLoading}
    >生成轨迹</Button>
  )
}

export default CreateTrackBtn