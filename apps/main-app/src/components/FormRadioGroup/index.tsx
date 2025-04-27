import React, { useState, useEffect } from 'react'
import { Radio, Button } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import { FormRadioGroupType } from './interface'
import './index.scss'
import { SortField, SortOrder } from '@/config/CommonType'

function FormRadioGroup(props: FormRadioGroupType) {
  const {
    style,
    className = '',
    disabled = false,
    isSort = false,       // 是否为排序
    defaultOrder = 'desc',        // 排序方式 asc: 升序；desc: 降序
    defaultValue = "",   // 默认值
    yisaData = [],       // 数据数组
    onChange,
  } = props

  const [order, setOrder] = useState(defaultOrder)      // asc: 升序；desc: 降序
  const [value, setValue] = useState(defaultValue)

  const changeValue = (e: RadioChangeEvent) => {    // 冒泡，后触发
    // if (onChange) {
    //   setValue(e.target.value)
    if (isSort) {
      onChange(e.target.value, order)
    } else {
      onChange(e.target.value)
    }
    // }
  }

  const changeOrder = (_value: SortField | string) => {   // 先触发
    if (isSort && _value === value) {
      let _order: SortOrder = order === 'asc' ? 'desc' : "asc"
      // setOrder(_order)
      if (onChange) {
        onChange(value, _order)
      }
    }
  }

  useEffect(() => {
    if (defaultValue !== value) {
      setValue(defaultValue)
    }
    if (defaultOrder !== order) {
      setOrder(defaultOrder)
    }
  }, [defaultValue, defaultOrder])

  return (
    <Radio.Group
      onChange={changeValue}
      value={value}
      className={className ? `${className} form-radio-group` : "form-radio-group"}
      optionType="button"
      style={style}
    >
      {
        yisaData.map((item, index) => {
          return (
            <Radio.Button
              disabled={disabled}
              value={item.value}
              key={item.value}
              onClick={() => { changeOrder(item.value) }}
            >
              {
                isSort ?
                  <>
                    <span>{item.label}</span>

                    <Icon
                      type="daoxu"
                      className={value === item.value && order === 'asc' ? " active" : ""}
                    />
                    <Icon
                      type="zhengxu"
                      className={value === item.value && order === 'desc' ? "active" : ""}
                    />
                  </>
                  :
                  <span>{item.label}</span>
              }
            </Radio.Button>
          )
        })
      }
    </Radio.Group>
  )
}

export default FormRadioGroup
