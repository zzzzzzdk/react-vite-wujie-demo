import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { CheckableTag } from '@yisa/webui_business'
import { CheckableTagDataType, characterDataType, CheckableTagDataItemType } from '@yisa/webui_business/es/CheckableTag/interface';
import { Row, Space, Select } from '@yisa/webui'
import { CaretUpOutlined, CaretDownOutlined } from '@yisa/webui/es/Icon'
import { FormPlate } from '@/components'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox';
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { PlateValueProps } from '@/components/FormPlate/interface'
import classNames from 'classnames'
import featureData from '@/config/feature.json'
import { TargetType } from "@/config/CommonType";
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { isArray, isObject } from "@/utils";
const { Option } = Select

export type RefFeatureListType = {
  closeFeatureShow: () => void;
}

export interface FeatureListProps {
  targetType: TargetType;
  onChange?: (data: any) => void;
  captureAngle?: number;
  value?: {
    [key: string]: any;
  };
}
export type FeatureShowType = 'options' | 'info'

export const featureColorToShow = {
  1: '#000000', // 黑
  2: '#FFFFFF', // 白
  3: '#ABBEC1', // 灰
  4: '#FF0A0E', // 红
  5: '#3F99FF', // 蓝
  6: '#FEAE1F', // 黄
  8: '#997A5B', // 棕
  7: '#FF6633', // 橙
  9: '#65DB16', // 绿
  10: '#8547FF', // 紫
  11: '#00FFFF', // 青
  12: '#F77CBB', // 粉
  13: 'transparent', // 透明
  14: 'linear-gradient(44deg, #033289 3%, #00cc66 15%, #02c877 18%, #0bb1e1 33%, #eb6890 63%, #d4d411 82%, #022978 95%)', // 花色
  15: 'linear-gradient(180deg, #FBFFFC, #49F462)', // 白绿
  16: 'linear-gradient(89deg, #F2CE32 0%, #F2CE32 49%, #39C72B 52%, #39C72B 100%)', // 黄绿
}

export const featureDirectionToShow = {
  1: 'bei', // 上
  2: 'nan', // 方向向下
  3: 'xi', // 方向向左
  4: 'dong', // 方向向右
  5: 'xibei', // 方向向左上
  6: 'dongbei', // 方向向右上
  7: 'xinan', // 方向向左下
  8: 'dongnan', // 方向向右下
}


// 车辆特征分组
// 前车窗特征
const frontFeatures = ['pendant', 'accessory', 'card', 'sunVisorLeft', 'sunVisorRight'],
  // 后车窗特征
  backFeatures = ['spareTire', 'led', 'bolster', 'toy', 'sticker', 'sundries'],
  // 车头特征
  headFeatures = ['hatLeft', 'hatRight', 'glassesLeft', 'glassesRight', 'maskLeft', 'maskRight', 'behaviorLeft', 'behaviorRight', 'coatColorTypeIdLeft', 'coatColorTypeIdRight'],
  // 其他特征
  otherFeatures = ["sunroof", "roofRack", "tissue", "graffiti", 'reflectiveOr']

export { frontFeatures, backFeatures, headFeatures, otherFeatures }

/**
 * @description 特征选项
 * @default default
 */
const FeatureList = (props: FeatureListProps, ref: React.ForwardedRef<RefFeatureListType>) => {
  const {
    targetType = 'face',
    onChange,
    captureAngle,
    value
  } = props
  const nodeRef = useRef<HTMLDivElement>(null)
  const thisFeatureData = featureData[targetType] || {}
  const [activeShow, setActiveShow] = useState<FeatureShowType>('options')

  const [featureInfo, setFeatureInfo] = useState({})
  const [featureInfoText, setFeatureInfoText] = useState('')

  // 盒子宽度，宽度小，特征选项排列方式改变
  const [boxWidth, setBoxWidth] = useState(1500)
  const observer = useRef<ResizeObserver | null>(null)

  // const [captureAngle, setCaptureAngle] = useState<SelectCommonProps['value']>('-1')

  const handleChangeShow = (e: React.MouseEvent) => {
    // console.log(e.currentTarget)
    // e.stopPropagation() // 该事件影响车牌号码弹框关闭

    // 事件传播阻止
    let lis = document.querySelectorAll('.ysdb-checkable-tag-content')
    let clickFeatureItem = false
    for (let i = 0; i < lis.length; i++) {
      if (lis[i].contains((e.target as Node))) {
        clickFeatureItem = true
      }
    }
    const innerElementClass = ['.capture-angle-select', '.ysd-select-trigger', '.fusion3-form-plate-keyboard-box']

    for (let i = 0; i < innerElementClass.length; i++) {
      const elem = document.querySelector(innerElementClass[i])
      if (elem?.contains(e.target as any)) {
        clickFeatureItem = true
      }
    }
    // ysd-select-trigger
    if (clickFeatureItem) {
      return
    }

    setActiveShow(prev => prev === 'options' ? 'info' : 'options')
  }

  // 特征选中回调
  const handleCheckChange = (event: CheckboxChangeEvent, data: CheckableTagDataType, isSingle: boolean) => {
    // console.log(event, data)
    const { formItemName, formItemNameText, formItemData } = data

    if (!value) {
      setFeatureInfo(prev => {
        return {
          ...prev,
          [formItemName]: {
            formItemNameText,
            formItemData
          }
        }
      })
    }


    if (onChange) {
      let valueArr: (string | number)[] = []
      formItemData.forEach(elem => {
        valueArr.push(elem.value)
      })
      let newFormItem = {}
      newFormItem[formItemName] = isSingle ? valueArr[0] : valueArr

      onChange(newFormItem)
    }

  }

  const handleChangeFeatureInfoText = () => {
    // 格式化特征选项展示
    let _featureInfoText = ``
    Object.keys(featureInfo).forEach((key) => {
      const item = featureInfo[key]
      const itemText = item.formItemNameText
      const itemData = item.formItemData

      if (itemData.length === 1 && parseInt(itemData[0].value) === -1) {
        return
      }

      // 如果是车辆特征显示，车头车尾被禁用的特征选选中不显示
      const isDisabled = targetType === "vehicle" ?
        captureAngle === 1 ?
          backFeatures.includes(key)
          :
          captureAngle === 2 ?
            frontFeatures.includes(key) || headFeatures.includes(key)
            :
            captureAngle === 3 ? true :
              false
        : false

      if (isDisabled) { return }

      const formatText = `${itemText}：${itemData.map((elem: CheckableTagDataItemType) => elem.text).join("；")}；`
      _featureInfoText += formatText
    })
    setFeatureInfoText(_featureInfoText)
  }

  const boxWidthChangeListen = () => {
    let element = document.querySelector('.feature-list') as Element
    observer.current = new ResizeObserver((mutationList: any) => {
      // for (let mutation of mutationList) {
      //   console.log(mutation)
      // }
      let width = parseInt(getComputedStyle(element).getPropertyValue('width'))
      let height = getComputedStyle(element).getPropertyValue('height')
      // console.log(width)
      if ((width) === boxWidth) return
      setBoxWidth(width)
    })
    // console.log('observer', observer.current)
    observer.current.observe(element,)
    /**
     * {
          attributes: true,
          childList: true,
          // attributeFilter: ['style'],
          subtree: true, // 观察后代节点，默认为 false
        }
     */
  }

  useEffect(() => {
    handleChangeFeatureInfoText()
  }, [featureInfo])

  useEffect(() => {
    handleChangeFeatureInfoText()
  }, [captureAngle])

  useEffect(() => {
    setFeatureInfo({})
    setFeatureInfoText('')
    // 切换targetType，打开特征栏
    if (activeShow === 'info') {
      setActiveShow('options')
    }
  }, [targetType])

  useEffect(() => {
    if (value && isObject(value)) {
      // 改变特征文本
      let newFeatureInfo = {}
      for (let key in value) {
        const thisVal = value[key]
        if (
          thisFeatureData.hasOwnProperty(key)
          && thisVal !== -1
          && JSON.stringify(thisVal) !== '[-1]'
          && thisVal !== ""
        ) {
          if (key !== 'licensePlate') {
            newFeatureInfo[key] = {
              formItemNameText: thisFeatureData[key].desc,
              formItemData: thisFeatureData[key].value.filter((item: any) => isArray(thisVal) ? thisVal.includes(item.value) : thisVal === item.value)
            }
          } else {
            newFeatureInfo[key] = {
              formItemNameText: '车牌号码',
              formItemData: [{ value: value.licensePlate || -1, text: value.licensePlate }]
            }
          }
        }
      }
      // console.log(newFeatureInfo)
      setFeatureInfo(newFeatureInfo)
    }
  }, [value])

  useEffect(() => {
    boxWidthChangeListen()
    return () => {
      if (observer.current) {
        observer.current.disconnect()
        observer.current = null
      }
    }
  }, [])

  // const handleAngleSelectChange = (value: SelectCommonProps['value']) => {
  //   setCaptureAngle(value)
  // }

  const handlePlateNumberChange = (value: PlateValueProps) => {
    // console.log(plate_number)
    if (!("value" in props)) {
      setFeatureInfo(prev => {
        return {
          ...prev,
          ['licensePlate']: {
            formItemNameText: '车牌号码',
            formItemData: [{ value: value.plateNumber || -1, text: value.plateNumber }]
          }
        }
      })
    }

    if (onChange) {
      onChange({
        'licensePlate': value.plateNumber
      })
    }
  }


  // 遍历生成特征选项
  const handleOptionsTemplate = (key: string) => {
    // 人员民族，暂时隐藏
    if(key == "nationId"){
      return
    } 
    const item = thisFeatureData[key as keyof typeof thisFeatureData]
    const hasColor = key.indexOf('Color') > -1 || key.indexOf('color') > -1
    const hasIcon = key.indexOf('movingDirection') > -1


    const thisValue: Array<characterDataType> = item['value'] || []

    const dataSource: Array<characterDataType> = thisValue.map((elem: characterDataType) => {
      let colorOpt = {}
      if (hasColor && parseInt(elem.value) !== -1 && parseInt(elem.value) !== 99) {
        colorOpt = {
          showStyle: 'colorBlock',
          color: featureColorToShow[(elem.value as unknown as keyof typeof featureColorToShow)],
          borderColor: featureColorToShow[(elem.value as unknown as keyof typeof featureColorToShow)]
        }
      }
      let iconOpt = {}
      if (hasIcon && parseInt(elem.value) !== -1 && parseInt(elem.value) !== 99) {
        iconOpt = {
          showStyle: 'icon',
          icon: featureDirectionToShow[(elem.value as unknown as keyof typeof featureDirectionToShow)],
        }
      }

      return {
        value: elem.value,
        text: elem.text,
        isSingle: elem['isSingle'],
        cancelOther: parseInt(elem.value) === -1,
        ...colorOpt,
        ...iconOpt
      }
    })

    // 做个判断，目标类型为vehicle时，切换抓拍角度选项，车头、车尾、车侧对应显示不同
    const isDisabled = targetType === "vehicle" ?
      captureAngle === 1 ?
        backFeatures.includes(key)
        :
        captureAngle === 2 ?
          frontFeatures.includes(key) || headFeatures.includes(key)
          :
          captureAngle === 3 ? true :
            false
      : false

    // 设置默认值
    let defaultValue = value?.hasOwnProperty(key) ?
      isArray(value[key]) ? value[key] : [value[key]]
      : dataSource.length ? [dataSource[0].value] : [-1]

    if (key === 'licensePlate') {
      defaultValue = value?.hasOwnProperty(key) ? value[key] : ''
    }

    return (
      key === 'licensePlate' ?
        <div className="ysdb-checkable-tag" key={`${targetType}_${key}`}>
          <div className="ysdb-checkable-tag-children">
            <div className="ysdb-checkable-tag-name">{item['desc']}</div>
            <div className="ysd-checkbox-group ysdb-checkable-tag-content">
              <FormPlate
                isShowColor={false}
                isShowKeyboard
                onChange={handlePlateNumberChange}
                value={{
                  plateNumber: defaultValue,
                  plateTypeId: -1,
                  noplate: ''
                }}
                keyboardClassName="small-zindex"
              />
            </div>
          </div>
        </div>
        :
        <CheckableTag
          key={`${targetType}_${key}`}
          dataSource={dataSource || []}
          value={defaultValue}
          labelName={item['desc']}
          onChange={(event: CheckboxChangeEvent, data: CheckableTagDataType) => handleCheckChange(event, data, item['isSingle'])}
          fieldName={key}
          showAsRadio={item['isSingle']}
          className={classNames({
            'disabled': isDisabled
          })}
        />
    )
  }

  // 车辆特征类型排列单独生成
  const handleVehicleOptionsTemplate = () => {
    const moduleArr = ['天窗', '前车窗', '后车窗', '左右侧人员一', '左右侧人员二']

    return <>
      <div className="vehicle-module-item">
        {
          Object.keys(thisFeatureData).slice(0, 5).map(key => {
            return handleOptionsTemplate(key)
          })
        }
      </div>
      <div className="vehicle-module-item">
        {
          Object.keys(thisFeatureData).slice(5, 10).map(key => {
            return handleOptionsTemplate(key)
          })
        }
      </div>
      <div className="vehicle-module-item">
        {
          Object.keys(thisFeatureData).slice(10, 16).map(key => {
            return handleOptionsTemplate(key)
          })
        }
      </div>
      <div className="vehicle-module-item">
        {
          Object.keys(thisFeatureData).slice(16, 22).map(key => {
            return handleOptionsTemplate(key)
          })
        }
      </div>
      <div className="vehicle-module-item">
        {
          Object.keys(thisFeatureData).slice(22, 26).map(key => {
            return handleOptionsTemplate(key)
          })
        }
      </div>
    </>
  }

  useImperativeHandle(ref, () => ({
    closeFeatureShow: () => setActiveShow('info')
  })
  )

  return (
    <div
      ref={nodeRef}
      className={classNames(
        `feature-list`,
        targetType,
        {
          'unfold': activeShow === 'options',
          'fold': activeShow === 'info',
          'small-resolution': boxWidth < 1700
        },
      )}
      onClick={handleChangeShow}
    >
      <div className="feature-info">{featureInfoText ? `已选特征: ${featureInfoText}` : '已选特征: 无'}</div>
      <div className={"feature-options"}>
        <Space size={10} wrap className="feature-options-space">
          {
            targetType === 'vehicle' ?
              handleVehicleOptionsTemplate()
              :
              Object.keys(thisFeatureData).map((key) => {
                return handleOptionsTemplate(key)
              })
          }
        </Space>
      </div>
      <div className="fold-switch-btn">
        {
          activeShow === 'info' ?
            <>展开<CaretDownOutlined /></>
            :
            <>收起<CaretUpOutlined /></>
        }
      </div>
    </div>
  )
}

export default forwardRef(FeatureList)
