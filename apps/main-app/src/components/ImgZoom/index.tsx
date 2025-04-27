import React, { useEffect, useState, useRef, useCallback } from 'react'
import classnames from 'classnames'
import { PictureOutlined } from '@yisa/webui/es/Icon'
import { getPrefixCls } from '@/config'
import ImgZoomProps from './interface'
import './style/index.scss'

function ImgZoom(props: ImgZoomProps) {
  const {
    imgSrc = '',
    position,
    scale = true, // false变形填充，true等比例
    draggable = false
  } = props
  const prefixCls = getPrefixCls('img-zoom');

  const [isShowZoom, setIsShowZoom] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const [size, setSize] = useState({
    zoomBoxW: 0,
    zoomBoxH: 0,
    zoomW: 0,
    zoomH: 0
  })

  // 各容器
  const box = useRef<HTMLDivElement>(null)
  const picBox = useRef<HTMLDivElement>(null)
  const pic = useRef<HTMLImageElement>(null)
  const zoomBox = useRef<HTMLDivElement>(null)
  const zoom = useRef<HTMLImageElement>(null)

  const picWrap = useRef<HTMLDivElement>(null)
  const float = useRef<HTMLSpanElement>(null)

  const [isError, setIsError] = useState(false)

  function imgError() {
    setIsError(true)
  }

  const handleScalePic = () => {
    const $spic = pic.current
    if ($spic && picBox.current) {
      //容器的尺寸
      const boxW = picBox.current.clientWidth
      const boxH = picBox.current.clientHeight

      $spic.src = imgSrc

      $spic.onload = () => {
        setIsLoaded(true)
        // 图片原始尺寸
        let spicW = $spic.width
        let spicH = $spic.height

        setSize({
          ...size,
          zoomW: $spic.width,// 图片原始尺寸
          zoomH: $spic.height
        })

        // 等比例缩放
        if (spicW / spicH > boxW / boxH) {
          $spic.style.width = boxW + 'px'
          if (!scale) {
            $spic.style.height = boxH + 'px'
          }
        } else {
          $spic.style.height = boxH + 'px'
          if (!scale) {
            $spic.style.width = boxW + 'px'
          }
        }
      }
    }
  }

  const handleMouseEnter = () => {
    if (isError || !isLoaded) return
    setIsShowZoom(true)
  }

  useEffect(() => {
    if (picWrap.current && zoomBox.current) {
      const _remainR = document.body.clientWidth - (picWrap.current.getBoundingClientRect().left + picWrap.current.clientWidth)
      const _remainL = picWrap.current.getBoundingClientRect().left
      const _zoomW = zoomBox.current.clientWidth

      if (isShowZoom) {
        let _p = 'left'
        if (position) {
          _p = position
        } else {
          // 右侧自适应
          _p = _remainR < _zoomW ? 'right' : 'left'
        }
        zoomBox.current.style[_p] = picWrap.current.clientWidth + picWrap.current.offsetLeft + 'px'


        let newSize = {
          ...size,
          zoomBoxW: zoomBox.current.clientWidth,
          zoomBoxH: zoomBox.current.clientHeight
        }
        // 如果原图宽高小于zoomBox，等比例放大
        if (size.zoomW < zoomBox.current.clientWidth && size.zoomH < zoomBox.current.clientHeight && zoom.current) {
          zoom.current.style.height = zoomBox.current.clientHeight * 2 + 'px'
          zoom.current.style.width = zoomBox.current.clientWidth * 2 + 'px'
          newSize.zoomW = zoomBox.current.clientWidth * 2
          newSize.zoomH = zoomBox.current.clientHeight * 2
        }

        // 放大镜容器宽高
        setSize(newSize)
      }
    }
  }, [isShowZoom]);

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isError) return
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    setTimeout(() => {
      setIsShowZoom(false)
    }, 100)
  }


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isError) return
    // 比例计算：放大镜的容器宽/图片原始尺寸 = float的宽度/小图的宽度
    // 由上得到：float的宽度 = 放大镜的容器宽 * 小图宽/图片的原始尺寸
    if (pic.current && float.current && picWrap.current && zoom.current) {
      // 小图尺寸
      const picW = pic.current.clientWidth
      const picH = pic.current.clientHeight
      // console.log('picW , picH', picW, picH)
      // 浮动块的大小
      const floatW = size.zoomBoxW * picW / size.zoomW
      const floatH = size.zoomBoxH * picH / size.zoomH
      // console.log('floatW, floatH', floatW, floatH)
      float.current.style.width = floatW + 'px'
      float.current.style.height = floatH + 'px'

      // 计算放大镜的位置
      // 放大镜的left=鼠标当前位置-小图的left-(放大镜的宽度/2)
      const $picWrap = picWrap.current

      const mouseX = e.clientX
      const mouseY = e.clientY

      const l = $picWrap.getBoundingClientRect().left
      const t = $picWrap.getBoundingClientRect().top

      let left = mouseX - l - (floatW / 2)
      let top = mouseY - t - (floatH / 2)

      // 防止超出边界
      if (left < 0) {
        left = 0
      } else if (left > picW - floatW) {
        left = picW - floatW
      }
      if (top < 0) {
        top = 0
      } else if (top > picH - floatH) {
        top = picH - floatH
      }
      float.current.style.left = left + 'px'
      float.current.style.top = top + 'px'

      if (!scale) {
        const y = size.zoomH * top / picH
        const x = size.zoomW * left / picW
        zoom.current.style.top = -y + 'px'
        zoom.current.style.left = -x + 'px'
      } else {
        // 放大镜跟大图片移动方向总是相反
        const x = left / (picW - floatW) * (size.zoomW - size.zoomBoxW)
        const y = top / (picH - floatH) * (size.zoomH - size.zoomBoxH)

        zoom.current.style.top = -y + 'px'
        zoom.current.style.left = -x + 'px'
      }
    }

  }

  //fix：修复尺寸变化带来的遮挡问题
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      handleScalePic()
    });
    picBox.current && resizeObserver.observe(picBox.current);
    return () => {
      picBox.current && resizeObserver.unobserve(picBox.current)
    }
  }, [])


  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-wrap`} ref={box}>
        <div className={`${prefixCls}-original-pic-bg`} ref={picBox}>
          <div
            className={classnames(`${prefixCls}-original-pic-wrap`, { "original-pic-error": isError })}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            ref={picWrap}
            draggable={draggable}
          >
            <span
              className={classnames(`${prefixCls}-float`, { "show": isShowZoom })}
              ref={float}
            ></span>
            <img
              ref={pic}
              onError={imgError}
              className={classnames(`${prefixCls}-original-pic`)}
              alt=""
            />
            {isError ?
              <div className='zoom-img-error-layer'>
                <PictureOutlined />
              </div> : ''}
          </div>
        </div>

        <div
          ref={zoomBox}
          className={classnames(`${prefixCls}-big-pic-wrap`, { "show": isShowZoom })}
        >
          <img src={imgSrc} ref={zoom} />
        </div>
      </div>
    </div>
  )
}

export default ImgZoom
