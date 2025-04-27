import React, { useEffect, useRef, useState } from "react";
import { Drawer, Button, Form, Slider, Select, Message, Space, Switch, Image, Radio, Modal, Checkbox, } from '@yisa/webui'
import { ExtendTargetItemType, ExtendTargetModalProps } from "../interface";
import { isFunction } from "@/utils";
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import characterConfig from "@/config/character.config";
import { CheckboxChangeEvent } from "@yisa/webui/es/Checkbox";
import classNames from 'classnames'
import targetNodataLightPng from '@/assets/images/image/target-nodata-light.png'
import targetNodataDarkPng from '@/assets/images/image/target-nodata-dark.png'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { ImgZoom, BigImg } from "@/components";

const ExtendResultCard = (props: {
  type: 'cond' | 'result' | 'associates',
  data: TargetResultItemType,
  checked?: boolean,
  onCheckedChange?: (cardData: TargetResultItemType, checked: boolean) => void,
  onOpenBigImg?: (data: TargetResultItemType) => void
}) => {

  const { type, data, checked, onCheckedChange, onOpenBigImg } = props
  let cardTitle = type === 'cond' ? '检索条件' : type === 'result' ? '检索结果' : `关联${characterConfig.featureTypeToText[data.targetType]}`

  if (data.drivingPositionId && type === 'associates') {
    cardTitle += `(${data.drivingPositionId === 1 ? '主驾' : data.drivingPositionId === 2 ? '副驾' : '未识别'})`
  }

  const [stateChecked, setStateChecked] = useState(checked)
  const isChecked = 'checked' in props ? checked : stateChecked

  const handleCheckedChange = (event: CheckboxChangeEvent) => {
    // event.stopPropagation()
    // event.preventDefault()
    // console.log(event.target.checked)
    if (!('checked' in props)) {
      setStateChecked(event.target.checked)
    }

    if (onCheckedChange && isFunction(onCheckedChange)) {
      onCheckedChange(
        data,
        event.target.checked
      )
    }
  }

  return (
    <div
      className={classNames("extend-result-card", {
        'checked': isChecked
      })}
      onClick={() => onOpenBigImg?.(data)}
    >
      <div className="extend-result-card-title">{cardTitle}</div>
      <div className="extend-result-card-con">
        <Image src={data.targetImage} />
        <span onClick={(e) => { e.stopPropagation() }}>
          {
            type === 'associates' ?
              <Checkbox
                className="card-checked"
                checked={isChecked}
                onChange={handleCheckedChange}
              />
              : ''
          }
        </span>
      </div>
    </div>
  )
}

const ExtendTargetModal = (props: ExtendTargetModalProps) => {
  const {
    className,
    modalProps,
    onModalConfirm,
    onPutItAwayChange,
    data = [],
    featureList = []
  } = props
  const skin = useSelector((state: RootState) => {
    return state.comment.skin
  });
  const existingFeatures = featureList.map(item => item.feature)
  const [putItAway, setPutItAway] = useState(false)
  const [plainOptions] = React.useState([{ text: '不限', value: 'all' }, { text: '人脸', value: 'face' }, { text: '汽车', value: 'vehicle' }]);
  const [radioValue, setRadioValue] = React.useState('all');
  // TODO:这个showData根据关联目标类型筛选, 因为只有face和vehicle两个类型,可以直接用!==判断
  const showData = data.filter(item => radioValue === 'all' ? item : item.result.targetType !== radioValue)
  const [checkedValue, setCheckedValue] = useState<TargetResultItemType[]>([])

  const [bigImgData, setBigImgData] = useState<TargetResultItemType[]>([])
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgIndex, setBigImgIndex] = useState(0)

  const handleSwitch = () => {
    const newValue = !putItAway
    setPutItAway(newValue)


    if (onPutItAwayChange && isFunction(onPutItAwayChange)) {
      onPutItAwayChange(newValue)
    }
  }

  const onChange = (e: any) => {
    setRadioValue(e.target.value);
    setCheckedValue([])
  };

  useEffect(() => {
    if (!modalProps?.visible) {
      setRadioValue('all')
      setCheckedValue([])
    }
  }, [modalProps?.visible])

  const handleOk = () => {
    if (!checkedValue.length) {
      Message.warning("请选择目标")
      return
    }

    if (onModalConfirm && isFunction(onModalConfirm)) {
      onModalConfirm({
        targetType: radioValue,
        putItAway: putItAway,
        checkedValue
      })
    }
    // resetLatlng()
  }

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      setRadioValue('all')
      setCheckedValue([])
      modalProps.onCancel()
    }
  }

  const handleCheckedValueChange = (cardData: TargetResultItemType, checked: boolean) => {

    // 选中结果为车辆时只可选一个，其他多选
    let newCheckedValue: TargetResultItemType[] = [...checkedValue]

    if (checked) {
      const surplusNum = 5 - featureList.length - checkedValue.length
      if (surplusNum <= 0) {
        Message.warning("选中目标数量已超过限制，请取消选择之后，再进行选中")
        return
      }
      newCheckedValue.push(cardData)
    } else {
      newCheckedValue = newCheckedValue.filter(item => item.infoId !== cardData.infoId)
    }

    if (radioValue === 'all') {
      let vehicleItem: TargetResultItemType | null = null
      newCheckedValue.forEach((elem, index) => {
        if (elem.targetType === 'vehicle') {
          vehicleItem = elem
        }
      })
      newCheckedValue = newCheckedValue.filter(elem => elem.targetType !== 'vehicle')
      vehicleItem && newCheckedValue.push(vehicleItem)
    } else if (radioValue === 'face') {
      newCheckedValue = newCheckedValue.length ? [newCheckedValue[newCheckedValue.length - 1]] : []
    } else if (radioValue === 'vehicle') {
      newCheckedValue = [...newCheckedValue]
    }
    setCheckedValue(newCheckedValue)
  }

  const handleOpenBigImg = (data: TargetResultItemType) => {
    setBigImgData([data])
    setBigImgVisible(true)
  }

  const handleRenderResultItem = (elem: ExtendTargetItemType, resultType: string) => {
    const { associates = [], cond, result } = elem
    const associatesResult = associates.filter(item => !existingFeatures.includes(item.feature))

    return (
      associatesResult && associatesResult.length ?
        <>
          {
            resultType === 'face' ?
              <ExtendResultCard type="cond" data={cond} onOpenBigImg={handleOpenBigImg} />
              : ''
          }
          <ExtendResultCard type="result" data={result} onOpenBigImg={handleOpenBigImg} />
          {
            associatesResult.map(item => {
              return (
                <ExtendResultCard
                  key={item.infoId}
                  type='associates'
                  data={item}
                  checked={checkedValue.map(item => item.infoId).includes(item.infoId)}
                  onCheckedChange={handleCheckedValueChange}
                  onOpenBigImg={handleOpenBigImg}
                />
              )
            })
          }
        </>
        : ''
    )
  }

  return (
    <Modal
      title="拓展目标选择"
      {...(modalProps || {})}
      className="extend-target-modal"
      wrapStyle={{ zIndex: 2022 }}
      maskStyle={{ zIndex: 2021 }}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={"加入检索条件"}
    >
      <div className="extend-target-item head-func">
        <p>以下为检索结果的其他维度信息，请选择是否将其加入检索条件中</p>
        <div className="btn">
          <Space>
            <label>默认收起</label>
            <Switch
              checked={putItAway}
              onChange={handleSwitch}
            />
          </Space>
        </div>
      </div>
      <div className="extend-target-item association-type">
        <label>关联类型</label>
        <Radio.Group onChange={onChange} value={radioValue}>
          {
            plainOptions.map(item => (<Radio key={item.value} value={item.value}>{item.text}</Radio>))
          }
        </Radio.Group>
      </div>
      <div className="extend-target-item">
        {
          showData && showData.length ?
            <div className="extend-target-result">
              {
                showData.map((elem, index) => {
                  const { associates = [], cond = {}, result } = elem
                  const resultType = result?.targetType || 'face'
                  return (
                    <div className="extend-target-result-item" key={resultType + index + result.infoId}>
                      {handleRenderResultItem(elem, resultType)}
                    </div>
                  )
                })
              }
            </div>
            :
            <div className="nodata">
              <img src={skin === "dark" ? targetNodataDarkPng : targetNodataLightPng} alt="暂无数据" />
              <div>暂无数据</div>
            </div>
        }
      </div>
      <div className="extend-target-item tip">
        最多可选<span>5</span>个，已上传<span>{featureList.length}</span>个，仍可上传<span>{5 - featureList.length}</span>个，当前选中<span>{checkedValue.length}</span>个
      </div>
      <BigImg
        modalProps={{
          visible: bigImgVisible,
          onCancel: () => setBigImgVisible(false),
        }}
        wrapClassName='extend-target-bigimg'
        currentIndex={bigImgIndex}
        data={bigImgData}
        onIndexChange={(index) => {
          setBigImgIndex(index)
        }}
        showRightInfo={false}
      />
    </Modal>
  )
}

export default ExtendTargetModal