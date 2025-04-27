import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Message } from '@yisa/webui'
import flvjs from 'flv.js'
import { VideoPlayProps, VideoPlayRefProps } from './interface'
import './index.scss'

let lastUrl = ''
let timer: NodeJS.Timeout | undefined
let reloadTimes = 0

const VideoPlay = forwardRef<VideoPlayRefProps, VideoPlayProps>(function (props, ref) {

  const {
    type = 'flv',
    className = ''
  } = props

  const videoElement = useRef<HTMLVideoElement>(null)

  const flvPlayer = useRef<flvjs.Player>()

  var [videoUrl, setVideoUrl] = useState('')
  function playVideo(url: string) { // 播放视频
    if (flvjs.isSupported()) {
      // if (videoUrl && url !== lastUrl) {
      if (videoUrl) {
        lastUrl = url
        flvPlayer.current = flvjs.createPlayer({
          type: type,
          hasAudio: false,
          url: lastUrl,
          isLive: true,
        }, {
          enableStashBuffer: true,
          autoCleanupSourceBuffer: true,
        });
        // var videoElement1 = document.getElementById('videoElement-1');
        if (flvPlayer.current && videoElement.current) {
          try {
            flvPlayer.current.attachMediaElement(videoElement.current);
            flvPlayer.current.load();

            flvPlayer.current.play();
            // flvPlayer.current.on('metadata_arrived', function () {
            //   setShowLoading(false)
            // })
            flvPlayer.current.on('error', function () {
              if (reloadTimes < 4) {
                reloadTimes += 1
                destroy()
                timer = setTimeout(() => {
                  playVideo(videoUrl)
                }, 5000)
              } else {
                Message.error('视频加载失败')
                // setShowLoading(false)
                clearTimeout(timer)
                timer = undefined
                destroy()
                reloadTimes = 0
              }
            })
          } catch (e) {
            console.log(e)
          }
        }
      }
    }
  }

  function destroy() {
    if (flvPlayer.current) {
      try {
        flvPlayer.current.pause();
        flvPlayer.current.unload();
        flvPlayer.current.detachMediaElement();
        flvPlayer.current.destroy();
        flvPlayer.current = undefined;
      } catch (e) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
      reloadTimes = 0
    }
    flvPlayer.current && destroy()
    videoUrl && playVideo(videoUrl)

  }, [videoUrl, type])

  useImperativeHandle(ref, () => ({
    changeUrl: (url: string) => {
      // if (url === videoUrl) {// 重新播放相同地址
      //   if (flvPlayer.current) {
      //     // 触发重新播放的时候，设置播放时间为0
      //     try {
      //       flvPlayer.current.currentTime = 0
      //       flvPlayer.current.play();
      //     } catch (err) {
      //       console.log(err)
      //     }
      //   }
      // } else {
      setVideoUrl(url)
      // }
    },
    destroyVideo: () => {
      destroy()
    }
  })
  )
  return (
    <div className="ysd-video-wrap" id="videoParent">
      {/* <div className="error-layer"></div> */}
      <video ref={videoElement} id='videoElement-1' className={`ysd-video ${className}`} src="" muted controls autoPlay></video>
    </div>
  )
})


export default VideoPlay
