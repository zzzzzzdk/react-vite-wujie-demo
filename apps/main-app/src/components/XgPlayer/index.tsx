import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import Player, { Events, } from 'xgplayer'
import { SimplePlayer } from 'xgplayer/es/index'
import HlsPlugin, { Hls, EVENT } from './xgplayer-hls/src'
import Mp4Plugin from "./xgplayer-mp4/src"
import FlvPlugin from './xgplayer-flv/src'
// import FlvJsPlugin from 'xgplayer-flv.js'
import 'xgplayer/dist/index.min.css';
import classNames from 'classnames'
import './index.scss'

const defaultOpts = {
  // enableWorker: false,
  retryCount: 3, // 重试 3 次，默认值
  retryDelay: 1000, // 每次重试间隔 1 秒，默认值
  loadTimeout: 10000, // 请求超时时间为 10 秒，默认值
  fetchOptions: {
    // 该参数会透传给 fetch，默认值为 undefined
    mode: 'cors',
  },
  targetLatency: 10, // 直播目标延迟，默认 10 秒
  maxLatency: 20, // 直播允许的最大延迟，默认 20 秒
  disconnectTime: 0, // 直播断流时间，默认 0 秒，（独立使用时等于 maxLatency）
  // fixAudioTimestampGap: false, //填充静默音频帧以避免检测大音频时间戳间隙时A / V
  // enableWorker: true, // 是否多线程工作
  // enableStashBuffer: true, //启用IO Stash缓冲区。 如果您需要实时（最小延迟），则设置为false，但如果有网络抖动可能会停止
  // stashInitialSize: 10240, // 缓存大小(kb)  默认384kb 128kb
  // reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
  // autoCleanupSourceBuffer: false, //自动清除缓存
  // lazyLoad: false, //如果有足够的数据用于播放，则中止 http 连接
  // deferLoadAfterSourceOpen: false, //在MediaSource sourceopen事件触发后加载。在Chrome上，在后台打开的标签页可能不会触发sourceopen事件，除非切换到该标签页。
}

export interface XgPlayerProps {
  id?: string,
  className?: string;
}

export type RefXgPlayerType = {
  playVideo: (url: string) => void;
  destroyVideo: () => void;
}

const XgPlayer = (props: XgPlayerProps, ref: React.ForwardedRef<RefXgPlayerType>) => {
  const { className, id = "mse" } = props
  const xgPlayer = useRef<SimplePlayer>()
  const [videoUrl, setVideoUrl] = useState("")

  const initPlayer = (url: string, startTime?: 0) => {
    // if (document.createElement('video').canPlayType("application/x-mpegURL")) {
    //   console.log("原生支持 hls 播放")
    //   xgPlayer.current = new Player({
    //     id: 'mse',
    //     url: url
    //   })
    // } else if (HlsPlugin.isSupported()) { // 第一步
    // console.log("HlsPlugin.isSupported")
    // }
    let videoType = (url.split('.').length ? url.split('.')[url.split('.').length - 1] : 'mp4').split("&")[0]
    console.log('videoType', videoType)
    xgPlayer.current = new Player({
      id: id,
      isLive: false,
      autoplay: true,
      autoplayMuted: true,
      url: url,
      // plugins: [Mp4Plugin, HlsPlugin, FlvPlugin],
      plugins: videoType === "mp4" ? [Mp4Plugin] : videoType === "flv" ? [FlvPlugin] : [HlsPlugin],
      hls: defaultOpts,
      startTime: startTime
    })
    if (xgPlayer.current) {
      xgPlayer.current.on(Events.PLAY, () => {
        console.log('开始播放...')
      })
      xgPlayer.current.on(Events.ERROR, (error) => {
        console.log('error', error)
        if (videoType === 'flv' && xgPlayer.current) {
          // console.log(xgPlayer.current)
          // xgPlayer.current.resetState()
          // xgPlayer.current.currentTime = error.currentTime + 10
          // xgPlayer.current.seek(error.currentTime + 10)
          // xgPlayer.current.play()

          // destroy()
          // initPlayer(url, error.currentTime + 1)
        }
      })
      xgPlayer.current.on('core_event', ({ eventName, ...rest }) => { // eventName: hls 事件名; rest: hls 事件回调函数参数
        // // 通过判断eventName来区分内核事件
        // console.log(eventName)
        if (eventName === EVENT.LOAD_START) {
          // ...
        }
      })
    }
  }

  function destroy() {
    if (xgPlayer.current) {
      xgPlayer.current.destroy() // 销毁播放器
      xgPlayer.current = undefined // 将实例引用置空
    }
  }

  const playVideo = (videoUrl: string) => {
    console.log('视频url改变: ', videoUrl)
    if (xgPlayer.current) {
      destroy()
    }

    if (videoUrl) {
      initPlayer(videoUrl)
      // xgPlayer.current.switchURL(videoUrl)
    }
  }

  useEffect(() => {
    return () => {
      destroy()
    }
  }, [])

  useImperativeHandle(ref, () => ({
    playVideo,
    destroyVideo: () => {
      destroy()
    }
  })
  )

  return (
    <div className={classNames("xgplayer-container", className)}>
      <div id={id}></div>
    </div>
  )
}

export default forwardRef(XgPlayer)
