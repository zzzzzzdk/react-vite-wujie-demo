import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { ImgUploadModalProps } from "./interface";
import { Modal, Radio, Button } from '@yisa/webui'
import { ImgPreview, ErrorImage } from '@yisa/webui_business'
import { RefImgPreviewType } from '@yisa/webui_business/es/ImgPreview/interface'
import character from "@/config/character.config";
import { TargetFeatureItem, TargetType } from "@/config/CommonType";
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import cutBtnImg from '@/assets/images/cut-btn.png'
import { Icon, LoadingOutlined, PlusOutlined } from '@yisa/webui/es/Icon'
import ImgCropper from "../ImgCropper";
import ImgResize from '../ImgResize'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import targetNodataLightPng from '@/assets/images/image/target-nodata-light.png'
import targetNodataDarkPng from '@/assets/images/image/target-nodata-dark.png'
import classNames from 'classnames'
const radioOptions = [{ value: 'all', label: '全部' }, ...character.targetTypes]

const ImgUploadModal = (props: ImgUploadModalProps) => {
  const {
    limit = 5,
    visible,
    handleFormRadioButtonChange,
    addFeature,
    handleCancel,
    picData,
    showCutBtn,
    showConfirmBtn = true,
    featureList = [],
    handleDelTargetFeature,
    multiple,
    modalTitle,
    showRadio,
    analysisType = 'full'
  } = props
  const btnRef = useRef<HTMLDivElement>(null)
  const skin = useSelector((state: RootState) => {
    return state.comment.skin
  });
  const radioOptionsData = analysisType === 'full' ? radioOptions : radioOptions.filter(item => item.value === 'all' || analysisType.indexOf(item.value) > -1)
  const [isIntercept, setIsIntercept] = useState(false)
  const isInterceptRef = useRef(isIntercept)
  isInterceptRef.current = isIntercept
  const [radioValue, setRadioValue] = useState('all')

  const [stateSelectedFeatureData, setStateSelectedFeatureData] = useState<TargetFeatureItem[]>([])
  const selectedFeatureData = 'featureList' in props ? featureList : stateSelectedFeatureData

  const handleDel = (id: string) => {
    const newSelectedFeatureData = selectedFeatureData.filter(item => item.feature !== id)
    setStateSelectedFeatureData(newSelectedFeatureData)

    handleDelTargetFeature?.(id)
  }
  //截取特征 /自选特征框回调
  const handleChooseFeatureItem = (item: TargetFeatureItem | TargetFeatureItem[]) => {
    cancelIntercept()

    const newItemList = Array.isArray(item) ? item : [item]
    if (!('featureList' in props)) {
      setStateSelectedFeatureData(newItemList)
    }
    //对外传出变化后的数组
    addFeature(newItemList, true)
    //针对单选
    if (!multiple) {
      handleCancel?.()
    }
  }

  const handleCropperChoose = (item: TargetFeatureItem) => {
    //新的特征数组
    const newFeatureArr = [...selectedFeatureData, item]
    handleChooseFeatureItem(newFeatureArr)
  }

  const oncancel = () => {
    cancelIntercept()
    if (handleCancel) {
      handleCancel()
    }
  }

  // 展示截取状态
  const handleShowIntercept = () => {
    setIsIntercept(true)
  }

  // 右键事件
  const handleTextMenu = (e: any) => {
    // console.log('右键点击：' + e)
    e.preventDefault()
    e.stopPropagation()
    cancelIntercept()
  }

  // 取消截取状态
  const cancelIntercept = () => {
    // formRadioButtonChange('all')
    setIsIntercept(false)
  }

  // 切换数据类型
  const formRadioButtonChange = useCallback((event: RadioChangeEvent | string) => {
    console.log(event)
    const value = typeof event === 'string' ? event : event.target.value
    setRadioValue(value)
    let itemData = {}
    radioOptionsData.forEach((elem) => {
      if (elem.value == value) {
        itemData = elem
      }
    })
    handleFormRadioButtonChange?.(itemData)
  }, [])


  // useEffect(() => {
  //   if (visible) {
  //     console.log(picData)
  //     // imgPreviewRef.current?.adapt()
  //   }
  // }, [visible])

  useEffect(() => {
    // ESC监听关闭截取状态
    function listenCancel(e: KeyboardEvent) {
      e.preventDefault()
      e.stopPropagation()
      if (e.keyCode == 27 && isInterceptRef.current) {
        cancelIntercept()
      }
    }
    document.addEventListener('keyup', listenCancel)

    return () => {
      document.removeEventListener('keyup', listenCancel)
    }
  }, [])

  return (
    <Modal
      title={modalTitle}
      wrapClassName='img-upload-modal'
      visible={visible}
      maskClosable={false}
      // onOk={handleOk}
      onCancel={oncancel}
      // centered={true}
      footer={null}
      escToExit={false}
    >
      <>
        {
          // showRadio && (radioOptionsData.length > 2) ?
          <div className="modal-top">
            <Radio.Group
              optionType="button"
              options={radioOptionsData}
              onChange={formRadioButtonChange}
              value={radioValue}
              disabled={isIntercept}
            />
          </div>
          // : null
        }
        <div className="img-upload-wrap" onContextMenu={handleTextMenu}>
          <div className="img-upload-left">
            {
              isIntercept ?
                <>
                  <ImgCropper
                    pic={picData?.bigImage}
                    chooseFeature={selectedFeatureData}
                    handleChooseFeature={handleCropperChoose}
                  />
                </>
                :
                // <ImgPreview
                //     featureData={featureData}
                //     src={picData?.bigImage}
                //     mode="single"
                //     onFeatureChange={handleChooseFeatureArr}
                //     ref={imgPreviewRef}
                //     resetOnChange={true}
                //     minScale={0.5}
                //     selectedFeatureData={selectedFeatureData}
                //   />
                <ImgResize
                  showConfirmBtn={showConfirmBtn}
                  multiple={multiple}
                  picData={picData}
                  chooseFeature={selectedFeatureData}
                  handleChooseFeature={handleChooseFeatureItem}
                  isShowModal={visible}
                  limit={limit}
                />
            }
            {
              showCutBtn &&
              <div className={classNames("cut-btn", {
                'hide': isIntercept
              })} onClick={handleShowIntercept} ref={btnRef}>
                <img src={cutBtnImg} alt="" />
              </div>
            }
          </div>
          {
            multiple &&
            <div className="img-upload-right">
              <div className="img-upload-right-header">已选择目标(最多选择<span>{limit}</span>个目标)</div>
              <div className="img-upload-right-content">
                {
                  !!featureList.length ?
                    <ul>

                      {
                        featureList.map((item, index) => {
                          const { feature, targetImage, targetType } = item
                          return (
                            <li key={feature + index}>
                              {targetType && <span className="feature-type-tip">{character.featureTypeToText[targetType]}</span>}
                              <span className='del-target' onClick={() => handleDel(feature)}>
                                <Icon type='lajitong' />
                              </span>
                              <ErrorImage src={targetImage} />
                            </li>
                          )
                        })
                      }
                    </ul>
                    :
                    <div className="nodata">
                      <img src={skin === "dark" ? targetNodataDarkPng : targetNodataLightPng} alt="暂无数据" />
                      <div>暂无数据</div>
                    </div>
                }
              </div>
              <div className="img-upload-right-btn">
                {
                  !!featureList.length &&
                  <Button onClick={oncancel} type="primary">确定</Button>
                }
              </div>
            </div>
          }
        </div>
      </>
    </Modal>
  )
}

export default memo(ImgUploadModal)
