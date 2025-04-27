import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Loading } from '@yisa/webui'
import BaseModalProps from "./interface";
import { isObject, isFunction } from "@/utils";
import { XgPlayer } from "@/components";
import { RefXgPlayerType } from '@/components/XgPlayer/index'
import services from "@/services";

const TimeSetModal = (props: BaseModalProps) => {
  const {
    modalProps,
    data
  } = props
  const player = useRef<RefXgPlayerType>(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [ajaxLoading, setAjaxLoading] = useState(false)

  useEffect(() => {
    // console.log(data)
    if (data?.fileId && modalProps?.visible) {
      player.current?.destroyVideo()
      setAjaxLoading(true)
      services.offline.getVideoUrl({
        fileId: data?.fileId
      }).then(res => {
        console.log(res)
        setAjaxLoading(false)
        if (res.playUrl) {
          // setVideoUrl(res.playUrl)
          player.current?.playVideo(res.playUrl)
        }
      }).catch(err => {
        setAjaxLoading(false)
        console.log(err)
      })
    }
  }, [data, modalProps?.visible])

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
    // resetLatlng()

  }

  return (
    <Modal
      title="视频播放"
      {...(modalProps || {})}
      className="video-modal"
      onCancel={handleCancel}
      unmountOnExit={true}
      footer={null}
    >
      <Loading spinning={ajaxLoading}>
        <XgPlayer
          ref={player}
        // videoUrl={'http://192.168.5.47:3003/video/bgfx.mp4'}
        // videoUrl={'http://192.168.5.47:3003/video/playback3.flv'}
        // videoUrl={'http://192.168.5.47:3003/video/flv-demo.flv'}
        // videoUrl={videoUrl}
        />
      </Loading>
    </Modal>
  )
}

export default TimeSetModal