import React, { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Message } from '@yisa/webui'
import { HlsPlayProps, HlsPlayRefProps } from './interface'
import { VideoPlayRefProps } from '../VideoPlay/interface'
import './index.scss'

const HlsPlay = forwardRef<VideoPlayRefProps, HlsPlayProps>(function (props, ref) {
  const {
    className = '',
  } = props

  const hlsPlayer = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const config = {
    autoStartLoad: true,
    debug: false,
    manifestLoadingTimeOut: 10000 * 10,
    levelLoadingTimeOut: 10000 * 10,
    nudgeOffset: 0.1 * 10,
    nudgeMaxRetry: 3 * 10,
  }



  const hlsPlay = (url: string) => {
    const { Hls } = window

    if (hlsPlayer.current) {
      hlsPlayer.current.detachMedia()
    }
    let _hls = new Hls(config);
    _hls.attachMedia(videoRef.current);
    hlsPlayer.current = _hls


    if (Hls.isSupported()) {
      // bind them together
      hlsPlayer.current.on(Hls.Events.MEDIA_ATTACHED, function () {
        console.log('媒体已连接');
        hlsPlayer.current.loadSource(url);
        hlsPlayer.current.on(Hls.Events.MANIFEST_PARSED, function (_: any, data: any) {
          console.log('发现' + data.levels.length + '个视频片段');
          hlsPlayer.current.play();
        });
      });

      hlsPlayer.current.on(Hls.Events.ERROR, function (_: any, data: any) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              tryReload('1', '网络错误')
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              tryReload('2', '播放媒体错误')
              break;
            default:
              // cannot recover
              hlsPlayer.current.destroy();
              break;
          }
        }
      });

    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = url;
      videoRef.current.addEventListener('loadedmetadata', function () {
        videoRef.current?.play();
      });
    }
  }

  const tryReload = (type:string, text:string, i=0) => {
    if (i <= 5) {
      switch (type) {
        case '1':
          hlsPlayer.current.startLoad();
          break;
        case '2':
          hlsPlayer.current.recoverMediaError();
          break;
      }
      setTimeout(() => {
        tryReload(type, text, i++)
      }, 1000);
    } else {
      Message.warning(text)
    }
  }

  useImperativeHandle(ref, () => ({
    changeUrl: (url: string) => {
      hlsPlay(url)
    }
  })
  )

  return (
    <div className={`hls-container ${className}`}>
      <video className='video-element' ref={videoRef} autoPlay muted controls crossOrigin='anonymous'></video>
    </div>
  )
})

export default HlsPlay
