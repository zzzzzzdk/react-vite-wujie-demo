import React, { useState, useEffect, useRef } from "react";
import { Modal, Image as ImgCon, Space, Message } from '@yisa/webui'
import { Icon, CloseOutlined, CheckOutlined } from "@yisa/webui/es/Icon";
import MovePathModalProps, { PointData } from "./interface";
import { isObject, isFunction } from "@/utils";
import { ImgResize, Card } from "@/components"
import noDataDark from '@/assets/images/image/search-nodata-dark.png'
import noDataLight from '@/assets/images/image/search-nodata-light.png'
import { RootState, useSelector } from "@/store";
import { ResultRowType } from '@/pages/Search/Target/interface';
import { TargetFeatureItem } from '@/config/CommonType';
import { TargetPointType, PointType } from "../BigImg/interface";
import SVG from 'svg.js';
import character from "@/config/character.config";
import './index.scss'

const MovePathModal = (props: MovePathModalProps) => {
  const {
    modalProps,
    onModalConfirm,
    data = [],
    movePath = [],
    targetPoint = [],
    bigImage = ''
  } = props
  const { skin } = useSelector((state: RootState) => state.comment)
  const [showMovePath, setShowMovePath] = useState(true)
  const [curBgData, setCurBgData] = useState<ResultRowType>()
  const svgCon = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (data.length) {
      setCurBgData(data[0])
    }

  }, [data])

  useEffect(() => {
    if (modalProps?.visible && showMovePath) {
      setTimeout(() => {
        drawMovePath()
      }, 0);
    } else {
      clearMovePath()
    }
  }, [modalProps?.visible, showMovePath])

  const handleOk = () => {

    if (onModalConfirm && isFunction(onModalConfirm)) {

    }
    // resetLatlng()
  }

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }

    if (!showMovePath) {
      setShowMovePath(true)
    }
  }

  const handleSwitchMovePath = () => {
    if (showMovePath) {
      setShowMovePath(false)
    } else {
      setShowMovePath(true)
    }
  }

  const handleChangeData = (event: React.MouseEvent, data: ResultRowType) => {
    setCurBgData(data)
  }

  const handlePointClick = (pointData: TargetPointType) => {
    const newCurData = data.find((element) => element.infoId === pointData.infoId)
    // console.log("newCurData", newCurData)
    setCurBgData(newCurData)
  }

  // 生成路径轨迹
  const drawMovePath = () => {
    console.log("生成路径轨迹")

    const _image = new Image()
    _image.src = bigImage
    _image.onload = () => {
      // 图片的原始尺寸
      let picW = _image.width
      let picH = _image.height
      //容器的尺寸
      const boxW = svgCon.current?.clientWidth || 0
      const boxH = svgCon.current?.clientHeight || 0



      let _s: number = 1
      // const widthScale = boxW / picW,
      // heightSacle = boxH / picH
      if (boxH / picH < boxW / picW) {
        _s = boxH / picH
      } else {
        _s = boxW / picW
      }
      const scale = Number(_s.toFixed(2))

      const movePos = {
        left: -((picW * scale) - boxW) / 2,
        top: -(picH * scale - boxH) / 2
      }
      // console.log('缩放比例：', widthScale, heightSacle)
      console.log('缩放比例：', scale, movePos)
      // setScale()
      try {
        // 假设你已经有了一个SVG元素  
        const element = document.getElementById('movePathCon')
        // console.log(element)
        if (!element) return
        const draw = SVG(element).size('100%', '100%');

        // draw.attr({
        //   'transform': `translate(${movePos.left}px, ${movePos.top}px) scale(${scale})`
        // })

        // 创建一个polyline元素  
        var polyline = draw.polyline([]).plot(movePath.map(function (point) {
          return [point.x * scale + movePos.left, point.y * scale + movePos.top];
        }));

        // 设置polyline的样式  
        polyline.fill('none').stroke({ width: 3, color: '#FF5B4D', dasharray: '5,5' });

        // 为每个点创建一个带有红色边框的圆形元素  
        targetPoint.forEach(function (item, index) {
          // const point = item.point
          // var circle = draw.circle(10).move((point.x * scale + movePos.left) - 5, (point.y * scale + movePos.top) - 5);
          // // 设置圆圈的样式，带有7px宽度的红色边框和白色填充  
          // circle.attr({
          //   'stroke': '#FFFFFF',
          //   'stroke-width': 3,
          //   'fill': '#FF5B4D',
          // });

          // // 创建标签背景矩形  
          // var labelBg = draw.rect(70, 24).move((point.x * scale + movePos.left) - 35, (point.y * scale + movePos.top) - 24 - 7);
          // labelBg.attr({
          //   'fill': 'rgba(255,91,77,0.72)',
          //   'stroke': 'rgba(255,91,77,0.72)',
          //   'stroke-width': 1,
          //   'cursor': 'pointer'
          // });

          // // 为背景矩形添加点击事件监听器  
          // labelBg.on('click', () => handlePointClick(item));
          // console.log(item.targetType)
          // // 创建标签文本并放在背景矩形的中央  
          // var label = draw.text(`${character.featureTypeToText[item.targetType]}`).move(labelBg.bbox().x + labelBg.bbox().width / 2, labelBg.bbox().y + labelBg.bbox().height / 2 - 4);
          // label.attr({
          //   'fill': 'white',
          //   'font-size': 12,
          //   'text-anchor': 'middle',
          //   'alignment-baseline': 'middle',
          //   'cursor': 'pointer'
          // });

          // // label['dataset']['index'] = index;

          // // 为标签添加点击事件监听器  
          // label.on('click', () => handlePointClick(item));

          // 如果这是最后一个点，则不添加箭头到circle上，而是在polyline上添加  
          if (index === targetPoint.length - 1) {
            // 创建一个箭头标记  
            var arrowMarker = draw.marker(10, 10, function (add) {
              add.polyline('0,0 10,5 0,10').fill('none').stroke({ width: 1, color: '#FF5B4D' });
            });

            // 将箭头标记附加到polyline的最后一个点上  
            polyline['marker']('end', arrowMarker, { refX: 8, refY: 5 });
          }
        });

      } catch (err) {
        console.log(err)
      }
    }
  }

  const clearMovePath = () => {
    const element = document.getElementById('movePathCon')
    // console.log(element)
    if (!element) return
    element.innerHTML = ''
  }

  return (
    <Modal
      title="查看关联目标"
      {...(modalProps || {})}
      className="mobile-path-modal"
      wrapStyle={{ zIndex: 2022 }}
      maskStyle={{ zIndex: 2021 }}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="image-area-wrapper">
        <div className="image-tip"><Icon type="tishi" /> 以下为该目标在当前摄像头内，抓拍的其他维度信息</div>
        <div className="image-area">
          <ImgResize
            picData={{
              bigImage: curBgData?.bigImage || '',
              data: curBgData ? [{ ...curBgData, ...(curBgData.detection ?? {}) }] : []
            }}
            isShowModal={modalProps?.visible}
          />
          <div className="switch-btn" onClick={handleSwitchMovePath}>
            {showMovePath ? <span><CloseOutlined />关闭移动路径</span> : <span><CheckOutlined />移动路径展示</span>}
          </div>
          {
            showMovePath ?
              <div className="move-path" id="movePathCon" ref={svgCon}>

              </div>
              : ''
          }
        </div>
      </div>
      <div className="target-list">
        <div className="target-list-title">关联目标</div>
        <div className="target-list-con">
          {
            data.length ?
              data.map((item, index) => {
                return (
                  <Card.Target
                    key={item.infoId + index}
                    checked={curBgData?.infoId === item.infoId}
                    cardData={item}
                    onCardClick={handleChangeData}
                  />
                )
              })
              :
              <div className="nodata">
                <img src={skin === "dark" ? noDataDark : noDataLight} alt="" />
                <p>暂无数据</p>
              </div>
          }
        </div>
      </div>
    </Modal>
  )
}

export default MovePathModal