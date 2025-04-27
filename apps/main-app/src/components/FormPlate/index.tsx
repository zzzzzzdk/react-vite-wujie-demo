import React, { useState, useEffect, useRef, useId, useContext } from 'react'
import { Input, Radio, Select } from '@yisa/webui'
import { FormPlateProps, PlateValueProps, PlateTypeId, Noplate } from './interface'
import PlateKeyboard from './PlateKeyboard'
import { ConfigContext } from '@yisa/webui_business'
import { getPrefixCls } from '@/config'
import classNames from 'classnames'
import _ from 'lodash'
import './style/index.scss'

const { Option } = Select
export const plateTypeOptionTemplate = [
  {
    "label": '不限',
    "value": -1,
    "position": -35
  }, {
    "label": '蓝色',
    "value": 5,
    "position": 0
  }, {
    "label": '黄色',
    "value": 6,
    "position": 30
  }, {
    "label": '绿色',
    "value": 9,
    "position": 60
  }, {
    "label": '新能源绿',
    "value": 15,
    "position": 90
  }, {
    "label": '新能源黄绿',
    "value": 16,
    "position": 120
  }, {
    "label": '白色',
    "value": 2,
    "position": 150
  }, {
    "label": '黑色',
    "value": 1,
    "position": 180
  }
]

const noplateOption = [
  {
    label: '无牌',
    value: 'noplate'
  }
]
function FormPlate(props: FormPlateProps) {


  const ConfigData = useContext(ConfigContext)

  const prefixCls = getPrefixCls('form-plate')

  const keyboardprefixCls = prefixCls + '-keyboard-box'



  const {
    className,
    dropdownMenuClassName,
    dropdownMenuLabelClassName,
    getPopupContainer = () => document.body,
    isShowColor = ConfigData.isShowColor ?? true,
    isShowNoLimit = true,
    placeholder = '请输入',
    isDisableNoLimit = false,
    value = {
      plateTypeId: isShowNoLimit ? -1 : 5,
      plateNumber: '',
      noplate: '',
    },
    onChange,
    isShowNoPlate = false,
    placement = 'bottom',
    verticalDis = 0,
    horizontalDis = 0,
    isShowKeyboard = false,
    selectFocusInput = true,
    keyboardClassName,
    province = ConfigData.province ?? '京',
    disabled = false,
    remind = <div>提示：请输入准确车牌号（如：鲁A12345）或模糊车牌号码。模糊搜索时可用“*”代替任意位数，“？”代替一位数。（如：{province}*45，{province}A？34？5）</div>,
    allowClear = true,
    accurate = false,
    plateTypeOption = plateTypeOptionTemplate,
    getTriggerContainer
  } = props

  const cn = classNames(
    className,
    prefixCls,
  )

  const keyboardCn = classNames(
    keyboardClassName,
    keyboardprefixCls
  )

  const first = useRef(true)

  const inputDomRef = useRef<any>(null)

  const selectDomRef = useRef<any>(null)

  const inputId = useId()

  const formatData = (value: PlateValueProps) => {
    let tdata = {
      plateTypeId: isShowNoLimit ? -1 : 5,
      plateNumber: '',
      noplate: 'noplate'
    }

    if (value.noplate != 'noplate') {
      tdata = {
        plateTypeId: value.plateTypeId,
        plateNumber: value.plateNumber,
        noplate: ''
      }
    }

    return tdata
  }

  const [innerValue, setInnerValue] = useState(() => {
    return formatData(value)
  })

  const [keyboard, setKeyboard] = useState(false)

  // input元素所在的位置
  const [inputPosition, setInputPosition] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  })

  // 光标位置
  const positionRef = useRef({
    start: 0,
    end: 0
  })

  const setPlateColor = (plateTypeId: number) => {
    // plateTypeId为-1时,不显示背景图
    const position = plateTypeOption.find(item => item.value === plateTypeId)?.position || 0
    // console.log(position, position)
    if (isShowColor) {
      try {
        selectDomRef.current.dom.getElementsByClassName('ysd-select-view')[0].style.backgroundPosition = `0 ${-(position - 5)}px`
      } catch (error) {
        console.log(error)
      }
    }
  }

  const setvalue = (data: PlateValueProps) => {
    let datan = {
      ...data,
      plateNumber: String(data.plateNumber).toLocaleUpperCase().trim()
    }
    setInnerValue(datan)
    setPlateColor(datan.plateTypeId)
    onChange && onChange(datan)
  }

  const onPlateTypeChange = (value: any) => {
    setvalue({
      plateTypeId: value,
      plateNumber: innerValue.plateNumber,
      noplate: '',
    })
  }

  const handleInputChange = (e: Event) => {
    setvalue({
      plateTypeId: innerValue.plateTypeId as PlateTypeId,
      plateNumber: (e.target as HTMLInputElement).value,
      noplate: '',
    })
  }

  const handleRadChange = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (keyboard) {
      setKeyboard(false)
    }
    // 切换无牌选中状态
    const newValue = innerValue.noplate === 'noplate' ? '' : 'noplate'
    setvalue({
      plateTypeId: isShowNoLimit ? -1 : 5,
      plateNumber: '',
      noplate: newValue,
    })
  }

  const setCursorPosition = () => {
    if (selectFocusInput) {
      const ctrl = inputDomRef.current.dom
      let position = positionRef.current
      ctrl.focus();
      setTimeout(() => {
        ctrl.setSelectionRange(position.start, position.start);
      }, 10)
    }
  };

  const onPlateSelect = (v: string) => {
    let position = positionRef.current
    let { plateTypeId, plateNumber } = innerValue
    setvalue({
      plateTypeId: plateTypeId as PlateTypeId,
      plateNumber: plateNumber.substr(0, position.start) + v + plateNumber.substr(position.start, plateNumber.length),
      noplate: '',
    })
    positionRef.current = {
      start: position.start + v.length,
      end: position.end + v.length,
    }
    setCursorPosition()
  }

  const onPlateDel = () => {
    let position = positionRef.current
    if (position.start > 0) {
      let { plateTypeId, plateNumber } = innerValue
      setvalue({
        plateTypeId: plateTypeId as PlateTypeId,
        plateNumber: plateNumber.substr(0, position.start - 1) + plateNumber.substr(position.start, plateNumber.length),
        noplate: '',
      })
      positionRef.current = {
        start: position.start - 1,
        end: position.end - 1,
      }
    }
    setCursorPosition()
  }

  const onHide = () => {
    setKeyboard(false)
  }

  const getInputPostion = () => {
    if (isShowKeyboard) {

      let {
        left,
        right,
        top,
        bottom
      } = inputDomRef.current.dom.getBoundingClientRect()

      let x = 0
      let y = 0

      let rootDom: any = getPopupContainer()

      if (rootDom == document.body) {
        x = window.scrollX
        y = window.scrollY
      } else {

        let {
          left: leftw,
          top: topw,
        } = rootDom.getBoundingClientRect()

        left -= leftw
        right -= leftw
        top -= topw
        bottom -= topw
        x = rootDom.scrollLeft
        y = rootDom.scrollTop
      }

      setInputPosition({
        left: left + x,
        right: right + x,
        top: top + y,
        bottom: bottom + y
      })

    }
  }

  const handleFocus = () => {
    getInputPostion()
    setKeyboard(true)
  }

  const handleBlur = () => {
    let ctrl = inputDomRef.current.dom
    let CaretPos = {
      start: 0,
      end: 0
    };
    if (ctrl.selectionStart) {// Firefox support
      CaretPos.start = ctrl.selectionStart;
    }
    if (ctrl.selectionEnd) {
      CaretPos.end = ctrl.selectionEnd;
    }
    positionRef.current = CaretPos
  }



  useEffect(() => {

    if (first.current) {
      first.current = false
      setPlateColor(innerValue.plateTypeId)
      return
    }

    let tdata = formatData(value)

    if (!_.isEqual(tdata, innerValue)) {
      setInnerValue(tdata)
      setPlateColor(tdata.plateTypeId)
    }

  }, [JSON.stringify(value)]);


  useEffect(() => {
    console.log('keyboard')
    function closeKeyboard(e: any) {
      // e.stopPropagation()
      let tag = true
      const ev = window.event || e;
      const path = ev.path || (ev.composedPath && ev.composedPath());
      path.forEach(function (item: Element) {
        if (item.id == inputId || item.className == keyboardCn) {
          tag = false
          return false
        }
      })
      if (tag) {
        setKeyboard(false)
      }
    }

    if (isShowKeyboard) {
      document.body.addEventListener('click', closeKeyboard)
    }

    return () => {
      if (isShowKeyboard) {
        document.body.removeEventListener('click', closeKeyboard)
      }
    }
  }, []);


  const dropdownClassName = classNames(
    `${prefixCls}-plate-type`,
    {
      [`${prefixCls}-no-limit`]: !isShowNoLimit,
    },
    `${dropdownMenuClassName ? dropdownMenuClassName : ""}`
  )


  return (
    <div className={cn}>
      {
        isShowColor && <Select
          disabled={disabled}
          ref={selectDomRef}
          listHeight={300}
          dropdownClassName={dropdownClassName}
          className={dropdownMenuLabelClassName}
          // options={plateTypeOption}
          value={innerValue.plateTypeId}
          onChange={onPlateTypeChange}
          getTriggerContainer={() => {
            if ('getTriggerContainer' in props) {
              return getTriggerContainer?.() || document.body
            }
            return document.querySelector(`.${prefixCls}`) || document.body
          }}
        // @ts-ignore
        >
          {
            plateTypeOption.map(ele => {
              return <Option key={ele.value} value={ele.value} disabled={isDisableNoLimit && ele.value == -1}>{ele.label}</Option>
            })
          }
        </Select>
      }
      <div className={prefixCls + '-form-input'} id={inputId}>
        <Input
          allowClear={allowClear}
          disabled={disabled}
          ref={inputDomRef}
          placeholder={placeholder}
          value={innerValue.plateNumber}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {
        isShowNoPlate &&
        <span className='no-plate-wrap' onClick={handleRadChange}>
          <Radio.Group disabled={disabled} options={noplateOption} value={innerValue.noplate} />
        </span>
      }

      {
        isShowKeyboard ?
          <PlateKeyboard
            accurate={accurate}
            keyboardClassName={keyboardClassName}
            prefixCls={keyboardprefixCls}
            getPopupContainer={getPopupContainer}
            placement={placement}
            verticalDis={verticalDis}
            horizontalDis={horizontalDis}
            position={inputPosition}
            show={keyboard}
            remind={remind}
            province={province}
            onClick={onPlateSelect}
            onConfirm={onHide}
            onDel={onPlateDel} /> : ''
      }
    </div>
  )
}

export default FormPlate
