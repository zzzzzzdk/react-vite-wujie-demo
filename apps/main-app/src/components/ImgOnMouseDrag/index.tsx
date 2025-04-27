import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Message } from '@yisa/webui'
import Test from '@/assets/images/gait-test.png'
import classNames from 'classnames'
import ImgOnMouseDragProps from './interface'
import _ from 'lodash'
import './index.scss'

function ImgOnMouseDrag(props: ImgOnMouseDragProps) {
  const { imgUrl, className, style } = props
  // 鼠标是否按下
  const isFlagRef = useRef(false)

  // dom
  const domRef = useRef<HTMLDivElement>(null)

  const imgRef = useRef(null)

  // 缓存起始坐标
  const [cacheMouse, setCacheMouse] = useState(0)
  const cacheMouseRef = useRef(cacheMouse)
  cacheMouseRef.current = cacheMouse

  const handMouseDown = (e: React.MouseEvent) => {
    isFlagRef.current = true
    window.YISACONF.gaitListMouseMoveCount = 1
    setCacheMouse(e.clientX)
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isFlagRef.current) {
        typeof window.YISACONF.gaitListMouseMoveCount === "number" && window.YISACONF.gaitListMouseMoveCount++
        setCacheMouse(e.clientX)
        let calcNum = e.clientX - cacheMouseRef.current
        if (!domRef.current) return;
        if (domRef.current.scrollLeft === 0 && calcNum > 0) {
          // Message.warning('步态序列图已经在最左侧了')
          return
        }
        let num = domRef.current.scrollLeft - calcNum
        domRef.current.scrollLeft = num
      }
    }, [])

  const handleMouseUp = () => {
    isFlagRef.current = false
  }

  const handleMouseLeave = () => {
    isFlagRef.current = false
  }

  useEffect(() => {
    function domRefScrollEvent() {
      if (domRef.current) {
        const clientWidth = domRef.current.clientWidth;
        const scrollLeft = domRef.current.scrollLeft;
        const scrollWidth = domRef.current.scrollWidth;
        if (clientWidth + scrollLeft === scrollWidth) {
          // Message.warning('步态序列图已经在最右侧了')
        }
      }
    }
    domRef.current?.addEventListener('scroll', domRefScrollEvent)

    function mouseupEvent() {
      isFlagRef.current = false
    }
    window.addEventListener('mouseup', mouseupEvent)
    return () => {
      window.removeEventListener('scroll', domRefScrollEvent)
      window.removeEventListener('mouseup', mouseupEvent)
    }
  }, [])


  return (
    <div
      className={classNames(
        "mouse-drag-container",
        className
      )}
      style={style}
      ref={domRef}
      onMouseDown={handMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >   {
        imgUrl ? <img ref={imgRef} src={Test} alt="" draggable="false" /> : props.children
      }

    </div>
  )
}

export default ImgOnMouseDrag
