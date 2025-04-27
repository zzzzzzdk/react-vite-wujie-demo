import React, { useEffect, useState } from 'react'
import { Form } from '@yisa/webui'
import { VehicleModel } from '@/components'
import FormVehicleModelProps from './interface'
import classNames from 'classnames'
import { isFunction } from '@/utils'
import ajax from '@/services'
import './index.scss'

const FormVehicleModel = (props: FormVehicleModelProps) => {
  const {
    style,
    className,
    formItemProps = { label: '车辆型号' },
    onChange,
    getTriggerContainer
  } = props

  const [brandObj, setBrandObj] = useState({})
  const [allBrandObj, setAllBrandObj] = useState([])
  const [hotBrandObj, setHotBrandObj] = useState([])
  const [modelObj, setModelObj] = useState({})
  const [yearObj, setYearObj] = useState({})

  const [stateValue, setStateValue] = useState({
    brandValue: '',
    modelValue: [],
    yearValue: []
  })

  const value = {
    brandValue: 'brandValue' in props ? props.brandValue : stateValue.brandValue,
    modelValue: 'modelValue' in props ? props.modelValue : stateValue.modelValue,
    yearValue: 'yearValue' in props ? props.yearValue : stateValue.yearValue
  }

  const handleChange = (brand: any, model: any, year: any, extra: any) => {
    if (!('brandValue' in props) && !('modelValue' in props) && !('yearValue' in props)) {
      setStateValue({
        brandValue: brand,
        modelValue: model,
        yearValue: year
      })
    }
    if (onChange && isFunction(onChange)) {
      onChange({
        brandValue: brand,
        modelValue: model,
        yearValue: year,
        extra: extra
      })
    }
  }

  const getData = async () => {
    ajax.getBMY().then(res => {
      let { brand, model, year } = res.data as any
      setBrandObj(brand)
      setModelObj(model || {})
      setYearObj(year || {})
    })
    ajax.getHotBrands().then(res => {
      let { brands, hotBrands } = res.data as any
      setHotBrandObj(hotBrands)
      setAllBrandObj(brands || {})
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Form.Item
      className={classNames('form-vehicle-modal', className)}
      colon={false}
      {...formItemProps}
      style={style}
    >
      <VehicleModel
        allowClear
        brandData={brandObj}
        allBrandData={allBrandObj}
        hotBrands={hotBrandObj}
        modelData={modelObj}
        yearData={yearObj}
        destroyPopupOnHide={true}
        onChange={handleChange}
        brandValue={value.brandValue}
        modelValue={value.modelValue}
        yearValue={value.yearValue}
        getTriggerContainer={() => getTriggerContainer?.() || document.querySelector('.form-vehicle-modal') as HTMLElement}
      />
    </Form.Item>
  )
}

export default FormVehicleModel
