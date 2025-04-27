import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react'
import { Modal, Message, Loading, Image } from '@yisa/webui'
import { Icon, CloseCircleFilled } from '@yisa/webui/es/Icon'
import { VideoPlay, HlsPlay, XgPlayer } from '@/components'
import { RefXgPlayerType } from '@/components/XgPlayer/index'
import { GaitVideoProps, GaitVideoRef, GaitVideoPlayFormData, GaitVideoPlayType } from './interface'
import { VideoPlayRefProps } from '@/components/VideoPlay/interface'
import { HlsPlayRefProps } from '@/components/HlsPlay/interface'
import ajax from '@/services'

const GaitVideo = forwardRef<GaitVideoRef, GaitVideoProps>((props, ref) => {
  const {
    data,
    playAllVideo = () => { },
    playerId = "mse", //播放器挂载元素，如果需要同时播放不同视频则一定需要指定不同id
  } = props

  const prefixCls = "gait-video"

  // 视频加载
  const [videoLoading, setVideoLoading] = useState(false)
  // 是否显示视频
  const [showVideo, setShowVideo] = useState(false)
  // 离线视频
  const offVideoRef = useRef<VideoPlayRefProps | HlsPlayRefProps>(null)
  const player = useRef<RefXgPlayerType>(null)
  const [offVideoType, setOffVideoType] = useState("")

  // 录像回放请求
  const playVideo = () => {
    if (videoLoading) return
    const { infoId, targetType, locationId, captureTime, locationName, gaitVideoStartTime, gaitVideoDuration, gaitVideoUrl } = data
    if (!gaitVideoUrl) {
      Message.error("视频加载失败")
      return
    }
    setShowVideo(true)
    // const type = gaitVideoUrl.split('.').length ? gaitVideoUrl.split('.')[gaitVideoUrl.split('.').length - 1] : 'mp4'
    // setOffVideoType(type) // 将要播放视频类型：支持mp4/flv/m3u8
    setTimeout(() => {
      // offVideoRef.current?.changeUrl(gaitVideoUrl)
      player.current?.playVideo(`${gaitVideoUrl}`)
    }, 200)

    // 请求视频播放地址
    // setVideoLoading(true)
    // ajax.getVideo<{}, string>({
    //   infoId,
    //   targetType,
    //   locationId,
    //   captureTime
    // }).then(res => {
    //   console.log(res)
    //   setVideoLoading(false)
    //   if (res.data) {
    //     setShowVideo(true)
    //     player.current?.playVideo(res.data)
    //   } else {
    //     setShowVideo(false)
    //     Message.error("视频播放失败")
    //   }
    // }).catch(err => {
    //   setVideoLoading(false)
    //   setShowVideo(false)
    //   Message.error("视频播放失败")
    //   console.log(err)
    // })

  }


  const closeVideo = () => {
    if (showVideo) {
      setShowVideo(false)
      setVideoLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    closeVideo,
    playVideo
  }))

  return (
    <div className={prefixCls}>
      <Loading wrapperClassName={`${prefixCls}-loading`} size="large" spinning={videoLoading}>
        {
          showVideo ?
            <div className={`${prefixCls}-container`}>
              <span className={`${prefixCls}-container-close`} onClick={closeVideo}>
                <CloseCircleFilled />
              </span>
              {/* {
                offVideoType === "flv" || offVideoType === 'mp4' ?
                  <VideoPlay ref={offVideoRef} className="video-wrap" type={offVideoType} />
                  :
                  <HlsPlay ref={offVideoRef} className="video-wrap hls" />
              } */}
              <XgPlayer
                className="video-wrapper"
                ref={player}
                id={playerId}
              />
            </div>
            :
            <>
              <Image src={data?.bigImage} alt="" />
              <div className={`${prefixCls}-play`} onClick={() => playAllVideo?.()}>
                <Icon type="bofang1" />
              </div>
            </>
        }
      </Loading>
    </div>
  )
})

export default GaitVideo
