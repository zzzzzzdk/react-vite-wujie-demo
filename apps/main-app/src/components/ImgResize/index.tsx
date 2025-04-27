import React, { useEffect, useState, memo, useCallback, useImperativeHandle, forwardRef, useRef } from 'react'
import { Button, Message } from '@yisa/webui'
import ImgResizeProps, { RefImgResizeType, FeatureXYProps } from './interface'
import './index.scss'
import { TargetFeatureItem } from '@/config/CommonType'
import character from '@/config/character.config'

function FeatureListXY(props: FeatureXYProps, fRef: React.ForwardedRef<RefImgResizeType>) {
  const {
    featureData,
    selectFeature,
    curFeature,
    boxScale,
    multiple,
    limit = 1,
    showConfirmBtn = false,
    curFeatureIndex = -1,
    setCurFeatureIndex = () => { }
  } = props;
  !multiple && curFeature.length > 1 && Message.warning("传递的特征数组与单选不匹配");
  // const [curFeature, setCurFeature] = useState({})

  const chooseFeatureHandle = (item: TargetFeatureItem) => {
    // setCurFeature(e)
    //多选和单选的交互方式不一样，单选再次选中会取消选择，单选则会有确认选择的提示框
    if (multiple) {
      //找到了，证明要取消选择
      if (curFeature.find(it => it.feature === item.feature)) {
        selectFeature(curFeature.filter(it => it.feature !== item.feature))
      } else {
        if (curFeature.length > limit - 1) {
          Message.warning(`最多选择${limit}个`)
          return
        }
        selectFeature([...curFeature, item])
      }
    } else {
      selectFeature([item], item)
    }
  }

  // useEffect(() => {
  //   featureData.sort((a, b) => {
  //     const itemDataA = { ...a, ...(a.detection || {}) },
  //       itemDataB = { ...b, ...(b.detection || {}) }
  //     return itemDataB.w * itemDataB.h - itemDataA.w * itemDataA.h
  //   })
  // }, [])

  useImperativeHandle(fRef, () => ({
    changeFeature: (item) => {
      selectFeature([item])
    }
  }))

  // useEffect(() => {
  //   console.log(boxScale)
  // }, [boxScale])

  return (
    <>
      {
        featureData
          .sort((a, b) => {
            const itemDataA = { ...a, ...(a.detection || {}) },
              itemDataB = { ...b, ...(b.detection || {}) }
            return itemDataB.w * itemDataB.h - itemDataA.w * itemDataA.h
          })
          .map((item, index) => {
            const itemData = {
              ...item,
              ...(item.detection || {})
            }
            const css = {
              width: itemData.w + 'px',
              height: itemData.h + 'px',
              left: itemData.x + 'px',
              top: itemData.y + 'px'
            }
            //是否有选中样式
            const activeClass = curFeature.find(item => item.feature === itemData.feature)

            if (!itemData.feature) {
              return (<span key={index} style={css} className="feature-item">

              </span>)
            }
            return (
              <span
                key={index}
                className={(activeClass || curFeatureIndex === index) ? 'feature-item active' : 'feature-item'}
                onClick={() => {
                  if (showConfirmBtn && !multiple) {
                    setCurFeatureIndex(index)
                  }
                  chooseFeatureHandle(itemData)
                }}
                style={Object.assign(css, { zIndex: index })}
              >
              </span>
            )
          })
      }
    </>
  )
}

const FeatureXY = forwardRef(FeatureListXY)
//是否显示确认按钮 ，与单选多选的交互，默认单选有确认按钮，多选无确认按钮
function ImgResize(props: ImgResizeProps, rRef: React.ForwardedRef<RefImgResizeType>) {
  const {
    scaleMin = 0.5,
    scaleMax = 2.3,
    picData,
    limit = 5,
    chooseFeature,
    handleChooseFeature,
    showConfirmBtn = true, // 是否显示确认按钮
    multiple = false,
    isShowModal,
  } = props

  const imgContainer = useRef<HTMLDivElement>(null)
  const imgElement = useRef<HTMLImageElement>(null)
  const imgWrapper = useRef<HTMLDivElement>(null)

  //是否为鼠标按下事件
  const [isDown, setIsDown] = useState(false)
  //偏移的距离
  const [movePos, setMovePos] = useState({ left: 0, top: 0 })
  //鼠标按下的点
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  //移动后图片偏移的位置
  const [picPos, setPicPos] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)

  //是否在屏幕可是范围内显示，用于windows.resize
  const [firstImg, setFirstImg] = useState(true)
  //容器的尺寸
  const [boxSize, setBoxSize] = useState({ x: 0, y: 0 })
  //容器的尺寸/图片的尺寸
  const [picSize, setPicSize] = useState({ x: 0, y: 0 })

  const [showTip, setShowTip] = useState(false)
  //当前选中的特征框，如果有确认框，可以根据这个知道确认框的位置
  const [innerChooneFeature, setInnerChooneFeature] = useState<TargetFeatureItem[]>(chooseFeature || [])
  //TODO:未做多选的时候需要确认框的话，确认框的位置还没定位
  const defaultPos: TargetFeatureItem = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    targetType: "face",
    feature: "",
    targetImage: ""
  }
  const [curPos, setCurPos] = useState<TargetFeatureItem>(defaultPos)
  //用此去渲染数据
  const selectedFeature = chooseFeature ? chooseFeature : innerChooneFeature

  const [boxBorderScale, setBoxBorderScale] = useState(0)
  //单选时候当前选择框的索引
  const [curFeatureIndex, setCurFeatureIndex] = useState(-1)

  useEffect(() => {
    setShowTip(false)
    setInnerChooneFeature(chooseFeature || [])
  }, [picData, chooseFeature])

  //拖动鼠标 - 按下鼠标取出当前的位置
  const handleImgDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMousePos({
      x: e.pageX,
      y: e.pageY
    })
    setIsDown(true)
  }
  //抬起鼠标 - 设置为不可拖动 / 鼠标离开图片与抬起鼠标的方法一样
  const handleImgUp = () => {
    setMovePos({
      left: picPos.x,
      top: picPos.y
    })
    setIsDown(false)
  }

  //拖动图片 - 图片移动过程的计算
  const handleImgMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDown) {
      setFirstImg(false)
      let x = e.pageX - mousePos.x + movePos.left,
        y = e.pageY - mousePos.y + movePos.top

      setPicPos({ x, y })
      if (imgWrapper.current) {
        imgWrapper.current.setAttribute('style', `transform: translate(${x}px, ${y}px) scale(${scale})`)
      }
    }
  }

  //图片加载完
  const handleImgSize = () => {
    const _image = new Image()
    _image.src = picData?.bigImage || ''
    _image.onload = () => {
      // 图片的原始尺寸
      let picW = _image.width
      let picH = _image.height
      //容器的尺寸
      const boxW = imgContainer.current?.clientWidth || 0
      const boxH = imgContainer.current?.clientHeight || 0

      setBoxSize({ x: boxW, y: boxH })
      setPicSize({ x: picW, y: picH })

      setMovePos({
        left: -(picW - boxW) / 2,
        top: -(picH - boxH) / 2
      })
      setPicPos({
        x: -(picW - boxW) / 2,
        y: -(picH - boxH) / 2
      })

      let _s
      if (boxH / picH < boxW / picW) {
        _s = boxH / picH
      } else {
        _s = boxW / picW
      }
      
      setScale(Number(_s.toFixed(2)))
      setBoxBorderScale(Number(_s.toFixed(2)))

      // changeFixScale({
      //   scale: _s,
      //   left: -(picW - boxW) / 2,
      //   top: -(picH - boxH) / 2
      // })
    }
  }

  useEffect(() => {
    let _s
    if (boxSize.x !== 0 && boxSize.y !== 0) {
      if (boxSize.y / picSize.y < boxSize.x / picSize.x) {
        _s = boxSize.y / picSize.y
      } else {
        _s = boxSize.x / picSize.x
      }

      if (firstImg) {
        setMovePos({
          top: -(picSize.y - boxSize.y) / 2,
          left: -(picSize.x - boxSize.x) / 2
        })
      }
      setScale(Number(_s.toFixed(2)))
    }
  }, [boxSize])

  useEffect(() => {
    if (imgWrapper.current) {
      imgWrapper.current.setAttribute('style', `transform: translate(${movePos.left}px, ${movePos.top}px) scale(${scale})`)
    }
  }, [scale, movePos])

  // useEffect(() => {
  //   setScale(fixScale.scale)
  //   setMovePos({
  //     left: fixScale.left,
  //     top: fixScale.top
  //   })
  //   setPicPos({
  //     x: fixScale.left,
  //     y: fixScale.top
  //   })
  // }, [fixScale])

  //滚动鼠标缩放图片
  const handleImgWheel = (e: any) => {

    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    const _e = e.nativeEvent

    //offset不包含边框的宽度，以下3为span的边框宽度
    let _offsetX, _offsetY
    if (e.nativeEvent.target.localName === 'span') {
      _offsetX = _e.offsetX + parseInt(_e.target.style.left) + 3
      _offsetY = _e.offsetY + parseInt(_e.target.style.top) + 3
    } else {
      _offsetX = _e.offsetX
      _offsetY = _e.offsetY
    }

    // 缩放的最大最小边界

    let _s
    if (e.deltaY > 0) { // 缩小
      _s = scale < scaleMin ? scale : Number(scale) - 0.1
    } else { // 放大
      _s = scale > scaleMax ? scale : Number(scale) + 0.1
    }
    const _l = (picSize.x / 2 - _offsetX) * (_s - scale)
    const _t = (picSize.y / 2 - _offsetY) * (_s - scale)

    const _top = movePos.top + _t
    const _left = movePos.left + _l

    setPicPos({ x: _left, y: _top })
    setMovePos({ left: _left, top: _top })
    setScale(_s)

  }

  const handleImgDrag = (e: React.DragEvent) => {
    e.preventDefault()
    return false
  }

  // 选中特征操作
  const selectFeature = (item: TargetFeatureItem[], currentClickitem?: TargetFeatureItem) => {
    // debugger
    //新的特征数组
    const newFeatureArr = Array.isArray(item) ? item : [item]
    //TODO:多选的时候也支持弹框
    multiple ? setShowTip(false) : setShowTip(true)
    if (multiple) {
      setShowTip(false)
    } else {
      setCurPos(currentClickitem || defaultPos)
      setShowTip(true)
    }
    //内部保存一份
    // if (!("chooseFeature" in props)) {
    setInnerChooneFeature(newFeatureArr)
    // }
    if (!showConfirmBtn && handleChooseFeature) {
      //此时传递给外界的就是选中的
      handleChooseFeature(newFeatureArr)
    }
  }
  //确认框回调，（现在仅针对单选）
  const handleConfimFeature = () => {
    setCurFeatureIndex(-1)
    handleChooseFeature?.(innerChooneFeature)
    setShowTip(false)
    // setInnerChooneFeature([])
  }

  useEffect(() => {
    // 组织页面默认滚动事件
    handleBoxWheel()
  }, [])

  // 阻止默认事件
  function preventDefault(e: any) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
    // @ts-ignore
    return this;
  }

  const handleBoxWheel = () => {
    // console.log(e)
    console.log("在外部缩放")
    if (imgContainer.current && imgContainer.current.addEventListener) {
      imgContainer.current.addEventListener('mousewheel', preventDefault, false);
    }
    // @ts-ignore
    imgContainer.current.onmousewheel = preventDefault;//IE/Opera/Chrome
  }

  useImperativeHandle(rRef, () => ({
    changeFeature: (item) => {
      selectFeature([item], item)
    }
  }))
  useEffect(() => {
    if (isShowModal) {
      setCurFeatureIndex(-1)
    }
  }, [isShowModal])


  return (
    <>
      <div className='img-resize' ref={imgContainer}>
        <div className='img-container'
          ref={imgWrapper}
          onMouseDown={handleImgDown}
          onMouseMove={handleImgMove}
          onMouseUp={handleImgUp}
          onMouseLeave={handleImgUp}
          onWheel={handleImgWheel}
        >
          {
            isShowModal ?
              <img ref={imgElement} onDragStart={handleImgDrag}
                alt=''
                // onError={imgError}
                src={picData?.bigImage}
                onLoad={handleImgSize} />
              :
              ''
          }
          {
            picData && picData.data
              ?
              <FeatureXY
                featureData={picData.data}
                limit={limit}
                selectFeature={selectFeature}
                curFeature={selectedFeature}
                boxScale={boxBorderScale}
                multiple={multiple}
                showConfirmBtn={showConfirmBtn}
                curFeatureIndex={curFeatureIndex}
                setCurFeatureIndex={setCurFeatureIndex}
              />
              :
              null
          }
          {
            showTip && showConfirmBtn ?
              <div className="tip-fix-wrap" style={{ top: curPos.y, left: curPos.x + curPos.w }}>
                <div className="tip-wrap" style={{
                  transform: `scale(${1 / scale})`,
                }}>
                  <p>已选择{character.featureTypeToText[curPos.targetType] ? character.featureTypeToText[curPos.targetType] : "人脸"}目标</p>
                  <Button onClick={handleConfimFeature}>确认目标</Button>
                </div>
              </div>
              :
              ''
          }
        </div>

      </div>
    </>
  )
}


export default forwardRef(ImgResize)
