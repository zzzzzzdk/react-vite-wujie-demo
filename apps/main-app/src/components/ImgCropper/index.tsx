import React, { useState, useRef, useEffect } from 'react'
import ReactCropper from 'react-cropper'
import { Cropper, ReactCropperElement, } from 'react-cropper/dist/index'
import 'cropperjs/dist/cropper.css'
import { Button, Message, Loading } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import ImgCropperProps, { AreaPosType } from './interface'
import ajax from '@/services'
import './index.scss'
import { TargetFeatureItem, TargetType } from '@/config/CommonType'
import classNames from 'classnames'
import character from '@/config/character.config'
import { ApiResponse } from '@/services'

// 识别项li数组

const jumpArr = [
  {
    text: "局部检索",
    url: "#/image-search-new",
    mode: 'feature'
  },
]

const ImgCropper = (props: ImgCropperProps) => {
  const {
    pic,
    handleChooseFeature,
    applicationType,
    jumpArr = [],
    pageType = "", // 页面类型
    picData = { data: [], bigImage: '' }, // 所有识别数据
    chooseFeature,
    limit = 5
  } = props

  const boxRef = useRef<HTMLDivElement>(null)
  const cropperRef = useRef<HTMLImageElement | ReactCropperElement>(null)
  const [initLoading, setInitLoading] = useState(true)
  // 截取结束时的位置
  const [movePos, setMovePos] = useState<{
    x: number | string;
    y: number | string;
  }>({ x: '50%', y: '50%' })
  const [showMoveTip, setShowMoveTip] = useState(true)
  const [endPos, setEndPos] = useState<{
    x: number;
    y: number;
    targetType?: TargetType;
  }>({
    x: 0,
    y: 0,
    targetType: 'face'
  })
  const [curCropperimg, setCurCropperImg] = useState("")
  const [showTip, setShowTip] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [resultData, setResultData] = useState<{ data: TargetFeatureItem[] }>({ data: [] })
  const resultDataRef = useRef(resultData)
  resultDataRef.current = resultData
  const [hideCropper, setHideCropper] = useState(true) // 隐藏截取工具

  const curFeatureRef = useRef({
    x: 0,
    y: 0,
    w: 0,
    h: 0
  })

  const cropperFucRef = useRef<Cropper | null>(null)

  const ajaxFeature = (params: FormData) => {
    return ajax.getClippingFeature(params);
  }

  const handleCropperStart = () => {
    setHideCropper(false)
    setShowTip(false)
    setShowMoveTip(false)
  }

  const handleCropper = (e: any) => {
    curFeatureRef.current = {
      x: parseInt(e.detail.x),
      y: parseInt(e.detail.y),
      w: parseInt(e.detail.width),
      h: parseInt(e.detail.height)
    }
  }

  const handleCropperEnd = async (e: any) => {
    console.log('------------end--------')
    // console.log(cropperFucRef.current.getCropBoxData())
    if (curFeatureRef.current.x === 0 && curFeatureRef.current.y === 0 && curFeatureRef.current.w === 0 && curFeatureRef.current.h === 0) {
      Message.warning('请选取特征')
      setShowMoveTip(true)
      return
    }
    if (!cropperFucRef.current) { // 无实例,不计算
      return
    }
    const data = cropperFucRef.current.getCropBoxData()
    // 自适应高度展示tip，避免遮盖选项
    const boxData = cropperFucRef.current.getContainerData()
    // console.log(boxData)
    // 计算终点top
    let boxHeight = boxData.height
    let tipHeight = jumpArr && jumpArr.length ? (jumpArr.length * 40 + 12) : 86
    let endTipY = 0
    if (boxHeight - data.top < tipHeight) {
      endTipY = boxHeight - tipHeight
    } else {
      endTipY = data.top
    }
    // 计算终点left
    let boxWidth = boxData.width
    let tipWidth = applicationType === "bigImg" || applicationType === 'embed' ? 132 : 150
    let endTipX = 0
    if (boxWidth - (data.left + data.width) < tipWidth) { // 如果右侧剩余区域不足以放下提示框，那么定位到左边
      // 下边一批判断：如果左边的剩余区域不足以放下提示框，那么计算上方或者下方是否有足够的空间，如果没有，就放在截图区域里面
      // console.log(data.left)
      if (data.left < tipWidth) {
        endTipX = data.left
        if (data.top >= tipHeight) {
          endTipY = data.top - tipHeight + 42
        } else if ((boxHeight - (data.top + data.height)) >= tipHeight) {
          endTipY = data.top + data.height
        } else {
        }
      } else {
        endTipX = data.left - tipWidth
      }
    } else {
      // 默认放在截图框的右边
      endTipX = data.left + data.width
    }
    setEndPos({
      x: endTipX,
      y: endTipY
    })
    setShowTip(true)
    // 携带base64请求接口
    const canvas = cropperFucRef.current.getCroppedCanvas()
    let _img = canvas.toDataURL()
    // console.log(_img)
    setCurCropperImg(_img)
    setSearchLoading(true)
    // let file = base64ToFile(_img, 'cropper-img'+new Date().getTime())
    let formData = new FormData()
    formData.append('feature', JSON.stringify(curFeatureRef.current))
    formData.append('img_data', _img)

    if (pageType === 'yitu') {
      // 判断开始
      // 1.格式化数据，为取数据交集做准备
      let _data = picData.data ? picData.data.map((item) => {
        return {
          ...item,
          endX: Number(item.x) + Number(item.w),
          endY: Number(item.y) + Number(item.h)
        }
      }) : []
      let curFea = {
        ...curFeatureRef.current,
        endX: curFeatureRef.current.x + curFeatureRef.current.w,
        endY: curFeatureRef.current.y + curFeatureRef.current.h
      }
      // 2.首先判断有无交集，有交集展示识别项，无交集重新框选
      // ------- 开始获取交集区域
      let result = compareFun(curFea, _data)
      // console.log(result)
      if (result && result.length) {
        // ------- 获取最大区域之前格式化数据
        result = result.map((item) => {
          return {
            ...item,
            w: item.endX - item.x,
            h: item.endY - item.y,
            cropper_feature: [`${item.x},${item.y},${item.endX - item.x},${item.endY - item.y}`],
            areaValue: (item.endX - item.x) * (item.endY - item.y) // 给数组每个元素赋值最大面积
          }
        })
        let maxArea = result[0]
        // 判断如果单一交集，
        if (result.length === 1) {
          maxArea = result[0]
        }
        // 如果是多个交集，判断最大
        if (result.length > 1) {
          result.forEach((item) => {
            item.areaValue = (item.w as number) * (item.h as number) // 给数组每个元素赋值最大面积
          })
          for (let i = 0; i < result.length; i++) {
            if (result[i + 1]) {
              maxArea = (maxArea.areaValue ?? 0) < (result[i + 1].areaValue ?? 0) ? result[i + 1] : maxArea
            }
          }
        }
        let hasPart = false
        let formData1 = new FormData()
        formData1.append('full_path', maxArea.bigImage || '')
        formData1.append('img_path', _img)
        formData1.append('x', `${curFeatureRef.current.x}`)
        formData1.append('y', `${curFeatureRef.current.y}`)
        formData1.append('w', `${curFeatureRef.current.w}`)
        formData1.append('h', `${curFeatureRef.current.h}`)
        // let resultObj = {}
        // await ajaxFeature(formData1).then(res => {
        //   // console.log(res)
        //   if (!parseInt(res.status)) {
        //     if (res.data && res.data.feature) { // 通过新接口获取新的特征值，其他数据取之前的
        //       resultObj = {
        //         ...maxArea,
        //         feature: res.data.feature,
        //         is_whole: 0,
        //         targetImage: _img
        //       }
        //       hasPart = true
        //     }else{
        //       resultObj = Object.assign({}, maxArea)
        //     }
        //   }else{
        //     resultObj = Object.assign({}, maxArea)
        //   }
        // })
        // console.log(resultObj, hasPart, maxArea)
        setSearchLoading(false)
        maxArea = Object.assign({}, maxArea, {
          is_whole: 0,
          targetImage: _img
        })
        setResultData({
          data: [(maxArea as TargetFeatureItem)],
          // whole_data: maxArea,
          // part_data: hasPart ? resultObj : null
        })
        if (boxWidth - (data.left + data.width) < tipWidth) { // 如果右侧剩余区域不足以放下提示框，那么定位到左边
          // 下边一批判断：如果左边的剩余区域不足以放下提示框，那么计算上方或者下方是否有足够的空间，如果没有，就放在截图区域里面
          // console.log(data.left)
          if (data.left < tipWidth) {
            endTipX = data.left
            if (data.top >= tipHeight) {
              endTipY = data.top - tipHeight
            } else if ((boxHeight - (data.top + data.height)) >= tipHeight) {
              endTipY = data.top + data.height
            } else {
            }
          } else {
            endTipX = data.left - tipWidth
          }
        } else {
          // 默认放在截图框的右边
          endTipX = data.left + data.width
        }
        setEndPos({
          x: endTipX,
          y: endTipY,
          targetType: maxArea.targetType
        })


      } else {

        setSearchLoading(false)
        setResultData({ data: [] })
        if (boxWidth - (data.left + data.width) < tipWidth) { // 如果右侧剩余区域不足以放下提示框，那么定位到左边
          // 下边一批判断：如果左边的剩余区域不足以放下提示框，那么计算上方或者下方是否有足够的空间，如果没有，就放在截图区域里面
          // console.log(data.left)
          if (data.left < tipWidth) {
            endTipX = data.left
            if (data.top >= tipHeight) {
              endTipY = data.top - tipHeight + 42
            } else if ((boxHeight - (data.top + data.height)) >= tipHeight) {
              endTipY = data.top + data.height
            } else {
            }
          } else {
            endTipX = data.left - tipWidth
          }
        } else {
          // 默认放在截图框的右边
          endTipX = data.left + data.width
        }
        setEndPos({
          x: endTipX,
          y: endTipY,
          targetType: 'vehicle'
        })
      }

    } else {

      await ajaxFeature(formData).then(res => {
        setSearchLoading(false)
        // console.log(res)
        const resData = res as any
        if (resData.data && resData.data.length) {
          setResultData(resData)
          if (boxWidth - (data.left + data.width) < tipWidth) { // 如果右侧剩余区域不足以放下提示框，那么定位到左边
            // 下边一批判断：如果左边的剩余区域不足以放下提示框，那么计算上方或者下方是否有足够的空间，如果没有，就放在截图区域里面
            // console.log(data.left)
            if (data.left < tipWidth) {
              endTipX = data.left
              if (data.top >= tipHeight) {
                endTipY = data.top - tipHeight
              } else if ((boxHeight - (data.top + data.height)) >= tipHeight) {
                endTipY = data.top + data.height
              } else {
              }
            } else {
              endTipX = data.left - tipWidth
            }
          } else {
            // 默认放在截图框的右边
            endTipX = data.left + data.width
          }
          setEndPos({
            x: endTipX,
            y: endTipY,
            targetType: resData.data[0] && resData.data[0].targetType ? resData.data[0].targetType : "face"
          })
        } else {
          setResultData({ data: [] })
        }

      }).catch(err => {
        console.log(err)
      })
    }
  }

  // 比对是否交叉
  const compareFun = (area: AreaPosType, areaArr: AreaPosType[]) => {
    var comparisonAll: boolean | AreaPosType = false, // 交集区域坐标
      comparisonArr = []
    if (areaArr.length > 0) {
      for (var i = 0; i < areaArr.length; i++) {
        var thsArea = areaArr[i]
        //除开自己
        if (!(thsArea.x == area.x && thsArea.y == area.y && thsArea.endX == area.endX && thsArea.endY == area.endY)) {

          comparisonAll = compareFunRoet(area, thsArea)
          if (comparisonAll) {
            // comparisonArr.push(areaArr[i])
            comparisonArr.push(comparisonAll)
          }
        }
      }
    }
    return comparisonArr
  }

  // 坐标交集算法：
  const compareFunRoet = (r2: AreaPosType, r1: AreaPosType) => {
    var r1StartX = r1.x,
      r1StartY = r1.y,
      r1EndX = r1.endX,
      r1EndY = r1.endY,
      r2StartX = r2.x,
      r2StartY = r2.y,
      r2EndX = r2.endX,
      r2EndY = r2.endY;
    var mStartX = r1StartX < r2StartX ? r1StartX : r2StartX,
      mEndX = r1EndX > r2EndX ? r1EndX : r2EndX,
      mStartY = r1StartY < r2StartY ? r1StartY : r2StartY,
      mEndY = r1EndY > r2EndY ? r1EndY : r2EndY
    var bStartX = r1StartX == mStartX ? r2StartX : r1StartX,
      bEndX = r1EndX == mEndX ? r2EndX : r1EndX,
      bStartY = r1StartY == mStartY ? r2StartY : r1StartY,
      bEndY = r1EndY == mEndY ? r2EndY : r1EndY
    if (bStartX >= bEndX || bStartY >= bEndY) {
      return false
    } else {
      return {
        x: bStartX, // 交集区域x
        y: bStartY,
        endX: bEndX,
        endY: bEndY,
        // feature_id: r1.feature_id, // 原始特征id
        targetImage: r1.targetImage,
        targetType: r1.targetType,
        feature: r1.feature,
        origin_type: r1.targetType,
        origin_x: r1.x, // 原始区域x
        origin_y: r1.y,
        origin_w: r1.w,
        origin_h: r1.h,
        // face_feature_id: r1.face_feature_id,
        originImg: r1.originImg,
        brandId: r1.brandId,
        modelId: r1.modelId,
        yearId: r1.yearId,
        // is_whole: r1.is_whole,
        bigImage: r1.bigImage,
        // color_id: r1.color_id
      }
    }
  }

  // 将base64转化为file
  const base64ToFile = (dataurl: string, filename: string) => {
    var arr = dataurl.split(','), mime = (arr[0].match(/:(.*?);/) ?? "")[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleConfimFeature = () => {
    if (chooseFeature && chooseFeature.length > limit - 1) {
      Message.warning(`最多选择${limit}个`)
      return
    }
    if (handleChooseFeature) {
      // if (pageType === 'yitu') {
      //   handleChooseFeature(resultData, curFeatureRef.current)
      // } else {
      handleChooseFeature(resultData.data[0])
      // }
    }
    // 重置
    cropperFucRef.current?.reset()
    setShowMoveTip(true)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    event.preventDefault()
    event.nativeEvent.stopImmediatePropagation()
    // event.stopPropagation()
    // console.log(event.clientX, event.clientY)
    // console.log(document.body.clientHeight)
    // 计算鼠标移动的x,y
    let _x = 0, _y = 0
    let parentDom = document.getElementsByClassName("image-cropper")[0]
    if (applicationType == 'bigImg') {
      let kw = (document.body.clientWidth - (boxRef.current as HTMLDivElement).clientWidth - 510) / 2
      // let ky = (document.body.clientHeight - (boxRef.current as HTMLDivElement).clientHeight - 250)
      // console.log(kw)
      _x = event.clientX - kw + 10
      _y = event.clientY - 108 + 10
      // console.log("event.clientY + 10", event.clientY + 10)
    } else if (applicationType == 'embed') {
      parentDom = document.getElementsByClassName("cc-img-switch-cut")[0]
      let parentX = (parentDom as HTMLElement).offsetLeft, parentY = parentDom.getBoundingClientRect().top
      let bodyScroll = document.documentElement.scrollTop
      _x = event.clientX - parentX + 10
      _y = event.clientY - parentY + bodyScroll + 10
    } else if (applicationType === 'uploadArea') {
      let parentX = parentDom.getBoundingClientRect().left, parentY = parentDom.getBoundingClientRect().top
      let bodyScroll = document.documentElement.scrollTop
      _x = event.clientX - parentX + 10
      _y = event.clientY - parentY + bodyScroll + 10
      // console.log(_x, _y)
    } else {
      _x = event.nativeEvent.offsetX + 20
      _y = event.nativeEvent.offsetY + 20
    }
    // console.log(event, event.clientY)
    // 处理鼠标在最右边和最下边，提示会遮挡的情况
    let boxRight, boxBottom
    if (applicationType == 'embed' || applicationType === 'uploadArea') {
      boxRight = parentDom.getBoundingClientRect().right - parentDom.getBoundingClientRect().left
      boxBottom = parentDom.getBoundingClientRect().bottom - parentDom.getBoundingClientRect().top
    } else {
      boxRight = parentDom.getBoundingClientRect().right
      boxBottom = parentDom.getBoundingClientRect().bottom - 108
    }
    // console.log(parentDom.getBoundingClientRect())
    if (_x > (boxRight - 170)) {
      _x = _x - 170
    }
    // console.log(_y, (boxBottom - 70))
    if (_y > (boxBottom - 70)) {
      _y = _y - 70
    }
    // console.log(_x, _y, parentDom.getBoundingClientRect().right, parentDom.getBoundingClientRect().bottom)
    setMovePos({ x: _x, y: _y })
  }

  function dataURLToBlob(dataurl: string) {

    const type = dataurl.match(/data:(.+);/)?.[1];
    const base64 = dataurl.split(',')[1];
    const binStr = atob(base64);
    const u8a = new Uint8Array(binStr.length);
    let p = binStr.length;
    while (p) {
      p--;
      u8a[p] = binStr.codePointAt(p) || 0;
    }
    return new Blob([u8a], { type });
  }

  const openPage = (url: string, data: any) => {
    ajax.uploadTokenParams<{}, ApiResponse<string>>({
      params: data
    }).then(res => {
      if (res.data) {
        window.open(`${url}id=${res.data}`)
      } else {
        Message.warning(res.message || "")
      }
    }).catch(err => {
      Message.warning(err.message)
    })
  }

  useEffect(() => {
    console.time("初始化")
    setInitLoading(true)
  }, [])

  return (
    <div className='image-cropper' onMouseMove={handleMouseMove} ref={boxRef}>
      {
        showMoveTip ?
          <>
            <div className="move-tip" style={{ left: movePos.x, top: movePos.y }}>
              <p>按住左键框选</p>
              <p>点击右键或ESC取消</p>
            </div>
          </>
          :
          ""
      }
      {
        initLoading &&
        <Loading spinning={true} />
      }
      <ReactCropper
        className={hideCropper ? 'cropper hide-cropper' : "cropper"}
        ref={cropperRef}
        src={pic}
        dragMode='crop'
        zoomOnWheel={false}
        movable={false}
        viewMode={1}
        guides={true} // 显示虚线
        // minCropBoxHeight={10}
        // minCropBoxWidth={10}
        autoCrop={true}
        initialAspectRatio={1}
        autoCropArea={-1}
        cropstart={handleCropperStart}
        crop={handleCropper}
        cropend={handleCropperEnd}
        onInitialized={(instance) => {
          cropperFucRef.current = instance
          console.timeEnd("初始化")
          setInitLoading(false)
        }}
        // 跨域与以下三个属性无关，cookie传输的需要
        crossOrigin={"anonymous"}
        checkCrossOrigin={false}
        checkOrientation={false}
      />
      {
        showTip ?
          <div className="tip-wrap" style={{ top: endPos.y, left: endPos.x }}>
            {
              searchLoading ?
                <p>目标检测中...</p>
                :
                resultData.data && resultData.data.length ?
                  applicationType === "bigImg" || applicationType === 'embed' ?
                    <ul className="jump-li-wrap">
                      {
                        jumpArr.map((item, index) => {
                          /**
                           * 1、截取后识别区域目标
                              2、如没有返回目标，则提示没有目标
                              3、返回后，如果结果中没有人脸，则禁用轨迹查询、身份查询。
                              4、选择轨迹查询、身份查询 选取返回的人脸目标第一条跳转
                              5、选取以图检索/跨镜追踪，按照返回目标类型，有人脸之外识别项，取其他识别项第一条，只有人脸取人脸
                           */
                          let disabledStatus = item.disabled ? true : false
                          let jumpData = {} as TargetFeatureItem


                          if (item.text == "身份查询" || item.text == '轨迹重现') {
                            let hasFace = false
                            for (let i = resultData.data.length - 1; i >= 0; i--) {
                              const elem = resultData.data[i]
                              if (elem.targetType == 'face') {
                                hasFace = true
                                jumpData = elem
                              }
                            }
                            if (!hasFace) {
                              disabledStatus = true
                            }
                          } else if (item.text == "局部检索" || item.text == '跨镜追踪') {
                            const otherArr = resultData.data.filter(o => o.targetType !== 'face')
                            const faceArr = resultData.data.filter(o => o.targetType === 'face')
                            if (otherArr.length) {
                              jumpData = otherArr[0]
                            } else {
                              if (faceArr.length) {
                                jumpData = faceArr[0]
                              }
                            }



                          } else {
                            jumpData = resultData.data[0]
                          }
                          let _targetImage = jumpData.targetImage

                          // 防止base64过大，转化为blob
                          // let U = URL.createObjectURL(dataURLToBlob(jumpData.targetImage));
                          // _targetImage = U
                          // console.log(jumpData)
                          return <li className={classNames("jump-li", {
                            "disabled": disabledStatus
                          })} key={index} title={disabledStatus ? item.disabledTip : ""}>
                            <a
                              href="javascript:;"
                              // target="_blank"
                              className={classNames({
                                "disabled": disabledStatus
                              })}
                              onClick={() =>  openPage(`${item.url}`, {
                                featureList: [{
                                  feature: jumpData.feature,
                                  targetType: jumpData.targetType,
                                  targetImage: _targetImage,
                                  isFeature: true,
                                  detection: jumpData.detection,
                                  gaitFeature: jumpData.gaitFeature,
                                  infoId: jumpData.infoId,
                                  bigImage: picData.bigImage,
                                  licensePlate2: jumpData.licensePlate2,
                                  plateColorTypeId2: jumpData.plateColorTypeId2,
                                }]
                              })}
                            >
                              {
                                item.icon ?
                                  <Icon type={item.icon} />
                                  :
                                  ""
                              }
                              {item.text}
                            </a>
                          </li>
                        })
                      }
                    </ul>
                    :
                    <>
                      <p>已选择{endPos.targetType && character.featureTypeToText[endPos.targetType] ? character.featureTypeToText[endPos.targetType] : "人脸"}目标</p>
                      <Button onClick={handleConfimFeature}>确认目标</Button>
                    </>
                  :
                  <p>未识别目标</p>
            }
          </div>
          :
          ''
      }
    </div>
  )
}

export default ImgCropper
