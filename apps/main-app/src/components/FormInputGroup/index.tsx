import React, { useState, useEffect } from 'react'
import { Input } from '@yisa/webui'
import './index.scss'
const { InputNumber } = Input

interface InputGroupProps {
  className?: string,
  yisaName?: string,
  splitText?: string,
  placeholder?: string[],
  defaultValueMin?: string,
  defaultValueMax?: string,
  onChange: (value: { min: string | number, max: string | number }) => void,
  type?: string,
  defaultMin?: number
  disabled?: boolean
}

function FormInputGroup(props: InputGroupProps) {
  const {
    className = '',
    yisaName = '',
    splitText = '~',
    placeholder = ['请输入', '请输入'],
    defaultValueMin = '',
    defaultValueMax = '',
    onChange,
    type = 'text',
    defaultMin,
    disabled = false
  } = props

  const handleMinChange = (e: any) => {
    const v = type == 'number' ? e : e.target.value
    if (onChange) {
      onChange({
        max: defaultValueMax,
        min: v
      })
    }
  }

  const handleMaxChange = (e: any) => {
    const v = type == 'number' ? e : e.target.value
    if (onChange) {
      onChange({
        min: defaultValueMin,
        max: v
      })
    }
  }


  return (
    <div className={className ? `${className} cc-form-input-groups` : "cc-form-input-groups"}>
      {
        yisaName ?
          <label className="form-input-name">{yisaName}</label>
          :
          null
      }
      <Input.Group compact>
        {type == 'number' ?
          <InputNumber
            placeholder={placeholder[0]}
            value={defaultValueMin}
            onChange={handleMinChange}
            min={defaultMin}
            disabled={disabled}
            formatter={(value) => {
              return String(value)
                .replace(/[^0-9]/g, "")
                .replace(/^0/, "1");
            }}
          />
          :
          <Input placeholder={placeholder[0]} value={defaultValueMin} onChange={handleMinChange} />
        }

        <span className='input-split'>{splitText}</span>
        {type == 'number' ?
          <InputNumber
            placeholder={placeholder[1]}
            value={defaultValueMax}
            onChange={handleMaxChange}
            min={Number(defaultValueMin)}
            disabled={disabled}
            formatter={(value) => {
              return String(value)
                .replace(/[^0-9]/g, "")
                .replace(/^0/, "1");
            }}
          />
          :
          <Input placeholder={placeholder[1]} value={defaultValueMax} onChange={handleMaxChange} />}
      </Input.Group>
    </div>
  )
}

export default FormInputGroup
