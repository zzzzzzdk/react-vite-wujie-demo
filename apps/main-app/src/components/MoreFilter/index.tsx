import React, { useState, useEffect, useRef } from 'react'
import { CaretDownOutlined, CaretUpOutlined } from '@yisa/webui/es/Icon'
import { Form, Select, Input } from '@yisa/webui'
import { FormVehicleModel, FormPlate } from '@/components'
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import dictionary from '@/config/character.config'
import cn from 'classnames'
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import featureData from '@/config/feature.json'
import { PlateValueProps } from "@/components/FormPlate/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { MoreFilterType, MoreFilterFormDataType } from './interface'
import './index.scss'

export const defaultMoreFilterFormData: MoreFilterFormDataType = {
  licensePlate: '',
  plateColorTypeId: -1,
  noplate: '',

  brandId: '',
  modelId: [],
  yearId: [],
  //类别与性质
  vehicleTypeId: [-1],
  vehicleFuncId: [-1],
  //车牌颜色
  colorTypeId: -1,
  //抓拍角度
  objectTypeId: -1,
  //排除车牌
  excludeLicensePlate: {
    licensePlate: "",
    plateColorTypeId: -1,
    noplate: ""
  },

}

export default function (props: MoreFilterType) {
  const {
    showLicensePlate = false,      // 车牌号码
    showFormVehicleModel = true,  // 车辆型号
    showVehicleType = true,       // 车辆类别
    showVehicleFunc = true,      // 使用性质
    showVehicleColor = true,       // 车辆颜色
    showVehicleObjectType = true,       // 抓拍角度
    showExcludeLicensePlate = true,      // 排除车牌
    onChange = () => { },
    labelLeftGap = 0,
  } = props
  const prefix = "more-filter"
  const [toggleVisible, setToggleVisible] = useState(false);   // 是否显示更多可筛选表单
  //表单数据参数
  const [innerFormData, setInnerFormData] = useMergedState<MoreFilterFormDataType>(defaultMoreFilterFormData, {
    value: 'formData' in props ? props.formData : undefined
  })

  //工具函数
  const formatValue = (data: MoreFilterFormDataType) => {
    if (!('formData' in props)) {
      setInnerFormData(data)
    }
    onChange && onChange?.(data)
  }

  const handleChangeVehicleModel = (value: { brandValue: any, modelValue: any, yearValue: any, extra?: any }) => {
    // setInnerFormData({
    //   ...innerFormData,
    //   brandId: value.brandValue,
    //   modelId: value.modelValue,
    //   yearId: value.yearValue
    // })
    formatValue({
      ...innerFormData,
      brandId: value.brandValue,
      modelId: value.modelValue,
      yearId: value.yearValue
    })
  }

  const handleSelectChange = (value: SelectCommonProps['value'], fieldName: string) => {
    let newValue = value
    if (fieldName === 'vehicleTypeId' || fieldName === 'vehicleFuncId') {
      const arr = value as number[]
      // 不限判断
      newValue = arr[arr.length - 1] === -1 ? [-1] : arr.filter(item => item !== -1)
    }
    // setInnerFormData({
    //   ...innerFormData,
    //   [fieldName]: newValue
    // })
    formatValue({
      ...innerFormData,
      [fieldName]: newValue
    })
  }
  const handlePlateChange = ({ plateNumber, plateTypeId, noplate }: PlateValueProps, type: 'licensePlate' | "excludeLicensePlate") => {
    switch (type) {
      case "licensePlate":
        // setInnerFormData({
        //   ...innerFormData,
        //   licensePlate: plateNumber,
        //   plateColorTypeId: plateTypeId,
        //   noplate: noplate,
        // })
        formatValue({
          ...innerFormData,
          licensePlate: plateNumber,
          plateColorTypeId: plateTypeId,
          noplate: noplate,
        })
        break;
      case "excludeLicensePlate":
        // setInnerFormData({
        //   ...innerFormData,
        //   excludeLicensePlate: {
        //     licensePlate: plateNumber,
        //     plateColorTypeId: plateTypeId,
        //     noplate
        //   }
        // })
        formatValue({
          ...innerFormData,
          excludeLicensePlate: {
            licensePlate: plateNumber,
            plateColorTypeId: plateTypeId,
            noplate
          }
        })
        break;
      default:
        break;
    }
  }

  // useEffect(() => {
  //   onChange?.(innerFormData)
  // }, [innerFormData])

  const renderMoreFilterTemplate = (<Form colon={false} labelAlign="left">
    {
      showLicensePlate && <Form.Item colon={false} label={<span style={{ marginLeft: labelLeftGap }}>车牌号码</span>}>
        <FormPlate
          allowClear
          isShowKeyboard
          value={{
            plateNumber: innerFormData.excludeLicensePlate.licensePlate,
            plateTypeId: innerFormData.excludeLicensePlate.plateColorTypeId,
            noplate: (innerFormData.noplate as 'noplate' | '')
          }}
          onChange={(value) => { handlePlateChange(value, "licensePlate") }}
        />
      </Form.Item>
    }

    {
      showVehicleType && <Form.Item
        label={<span style={{ marginLeft: labelLeftGap }}>车辆类别</span>}
        className="vehicle-form-item"
        colon={false}
      >
        <Select
          allowClear
          defaultValue={featureData['car']['vehicleTypeId']['value'][0]['value']}
          options={featureData['car']['vehicleTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
          onChange={(value) => handleSelectChange(value, 'vehicleTypeId')}
          value={innerFormData.vehicleTypeId}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
        //@ts-ignore
        getTriggerContainer={(triggerNode) => triggerNode.parentNode}
        />
      </Form.Item>
    }
    {
      showVehicleFunc && <Form.Item
        label={<span style={{ marginLeft: labelLeftGap }}>使用性质</span>}
        className="vehicle-form-item"
        colon={false}
      >
        <Select
          allowClear
          defaultValue={featureData['car']['vehicleFuncId']['value'][0]['value']}
          options={featureData['car']['vehicleFuncId']['value'].map(item => ({ label: item.text, value: item.value }))}
          onChange={(value) => handleSelectChange(value, 'vehicleFuncId')}
          value={innerFormData.vehicleFuncId}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
        //@ts-ignore
        getTriggerContainer={(triggerNode) => triggerNode.parentNode}

        />
      </Form.Item>
    }
    {
      showVehicleColor && <Form.Item
        label={<span style={{ marginLeft: labelLeftGap }}>车辆颜色</span>}
        className="vehicle-form-item"
        colon={false}
      >
        <Select
          allowClear
          defaultValue={featureData['car']['colorTypeId']['value'][0]['value']}
          options={featureData['car']['colorTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
          onChange={(value) => handleSelectChange(value, 'colorTypeId')}
          value={innerFormData.colorTypeId}
          showSearch={true}
        //@ts-ignore
        getTriggerContainer={(triggerNode) => triggerNode.parentNode}
        />
      </Form.Item>
    }
    {
      showVehicleObjectType && <Form.Item
        label={<span style={{ marginLeft: labelLeftGap }}>抓拍角度</span>}
        className="vehicle-form-item"
        colon={false}
      >
        <Select
          allowClear
          defaultValue={featureData['car']['objectTypeId']['value'][0]['value']}
          options={featureData['car']['objectTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
          onChange={(value) => handleSelectChange(value, 'objectTypeId')}
          value={innerFormData.objectTypeId}
          showSearch={true}
        //@ts-ignore
        getTriggerContainer={(triggerNode) => triggerNode.parentNode}
        />
      </Form.Item>
    }
    {
      showFormVehicleModel && <FormVehicleModel
        // getTriggerContainer={() => document.querySelector(".left-search-wrapper") || document.body}
        getTriggerContainer={() => document.body}
        onChange={handleChangeVehicleModel}
        brandValue={innerFormData.brandId}
        modelValue={innerFormData.modelId}
        yearValue={innerFormData.yearId}
        formItemProps={{ label: <span style={{ marginLeft: labelLeftGap }}>车辆型号</span> }}

      />
    }
    {
      showExcludeLicensePlate && <Form.Item colon={false} label={<span style={{ marginLeft: labelLeftGap }}>排除车牌</span>}>
        <FormPlate
          allowClear
          placement="top"
          isShowKeyboard
          isShowNoPlate
          value={{
            plateNumber: innerFormData.excludeLicensePlate.licensePlate,
            plateTypeId: innerFormData.excludeLicensePlate.plateColorTypeId,
            noplate: (innerFormData.noplate as 'noplate' | '')
          }}
          onChange={(value) => { handlePlateChange(value, "excludeLicensePlate") }}
        />
      </Form.Item>
    }
  </Form>)

  return (<div className={cn(`${prefix}`, { toggle: toggleVisible })}>
    {/* 做成表单切换是为了根据样式变量统一更改间距 */}
    <Form>
      <Form.Item
        label=""
        colon={false}
        className={`${prefix}-btn`}
      >
        <div className={`${prefix}-btn-toggle`}>
          {toggleVisible ?
            <span onClick={() => { setToggleVisible(!toggleVisible) }}>收起更多可筛选选项<CaretUpOutlined /></span>
            :
            <span onClick={() => { setToggleVisible(!toggleVisible) }}>更多可筛选选项<CaretDownOutlined /></span>
          }
        </div>
      </Form.Item>
    </Form>
    {/* {toggleVisible && renderMoreFilterTemplate} */}
    {renderMoreFilterTemplate}
  </div>
  )
}

