import React, { useEffect, useState, useRef } from "react";
import { FormPlateMultiProps, PlateNumberItemType } from "./interface";
import classNames from 'classnames'
import { FormPlate } from '@/components'
import { PlateValueProps, PlateTypeId } from '@/components/FormPlate/interface'
import { Button, Upload, Form, Modal, Message, Loading } from '@yisa/webui'
import { UploadItem } from '@yisa/webui/es/Upload/interface'
import { Icon, ExclamationCircleFilled } from '@yisa/webui/es/Icon'
import { isArray, isFunction } from "@/utils";
import cookie from "@/utils/cookie";
import { unstable_useBlocker as useBlocker } from "react-router-dom";
import './index.scss'

const FormPlateMulti = (props: FormPlateMultiProps) => {
  const {
    className,
    style,
    limit = 2,
    onChange,
    formItemProps,
    remind
  } = props

  const [stateValue, setStateValue] = useState<PlateNumberItemType[]>([{ plateColorTypeId: 5, licensePlate: '' }])
  const plateData = 'value' in props ? (props.value || []) : stateValue

  const handlePlateChange = ({ plateNumber, plateTypeId, noplate }: PlateValueProps, index: number) => {
    const newValue = plateData || []
    newValue[index] = {
      licensePlate: plateNumber,
      plateColorTypeId: plateTypeId,
      noplate
    }
    if (!('value' in props)) {
      setStateValue(newValue)
    }

    if (onChange && isFunction(onChange)) {
      onChange(newValue)
    }
  }

  const deleteItem = (index: number) => {
    let arr = [...plateData];
    if (arr.length == 1) {
      Message.warning("至少保留一个");
      return false;
    }
    arr.splice(index, 1);
    if (!('value' in props)) {
      setStateValue(arr)
    }

    if (onChange && isFunction(onChange)) {
      onChange(arr)
    }
  }

  const addItem = (index: number) => {
    let arr = [...plateData];
    if (arr.length == limit) {
      Message.warning(`最多添加${limit}个`);
      return false;
    }
    arr.push({ plateColorTypeId: 5, licensePlate: '' });

    if (!('value' in props)) {
      setStateValue(arr)
    }

    if (onChange && isFunction(onChange)) {
      onChange(arr)
    }
  }

  return (
    <Form.Item
      className={classNames("form-plate-multi", className)}
      colon={false}
      label="车牌号码"
      required={true}
      {...formItemProps}
      style={style}
    >
      <div>
        {
          plateData && isArray(plateData) ?
            plateData.map((item, index) => {
              return (
                <div className="plate-item" key={index}>
                  <FormPlate
                    accurate
                    isShowKeyboard
                    onChange={(v) => handlePlateChange(v, index)}
                    value={{
                      plateTypeId: (item.plateColorTypeId || 5),
                      plateNumber: item.licensePlate || '',
                      noplate: ''
                    }}
                    remind={remind}
                    isShowNoLimit={false}
                  />
                  <div className="item-btn">
                    {(plateData.length == index + 1 && plateData.length < limit) && (
                      <div
                        onClick={() => addItem(index)}
                        className="add"
                      >
                        <Icon type="xinzeng1"></Icon>
                      </div>
                    )}
                    {plateData.length > 1 && (
                      <div
                        onClick={() => {
                          deleteItem(index);
                        }}
                        className="del"
                      >
                        <Icon type="shanchu2"></Icon>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
            : ''
        }
      </div>
    </Form.Item>
  )
}

export default FormPlateMulti