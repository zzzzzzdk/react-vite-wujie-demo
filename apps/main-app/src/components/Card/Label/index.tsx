import React, { useState } from "react";
import NormalProps from "./interface";
import { AspectRatioBox, ImgZoom } from '@/components'
import { Image, Tooltip, Checkbox, Message, PopConfirm, Button } from '@yisa/webui'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { Icon, DeleteOutlined } from '@yisa/webui/es/Icon'
// import { ImgZoom } from '@yisa/webui_business'
import classNames from 'classnames'
import { isFunction, jumpRecordVehicle } from "@/utils";
import FooterLinks from "../FooterLinks";
import './index.scss'
import { LabelSetType } from "@/pages/Search/record/LabelManage/components/LabelSetModal/interface";
import { useNavigate } from 'react-router'

function CardNormal(props: NormalProps) {
  const {
    className,
    cardData = {},
    onCardClick,
    checked = false,
    onChange,
    onAddTargetChange,
    onLabelChange,
    onDelChange
  } = props
  const navigate = useNavigate();
  const [stateChecked, setStateChecked] = useState(checked)
  const isChecked = 'checked' in props ? checked : stateChecked
  const handleCheckedChange = (event: CheckboxChangeEvent) => {
    // console.log(event.target.checked)
    if (!('checked' in props)) {
      setStateChecked(event.target.checked)
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        cardData: cardData,
        checked: event.target.checked
      })
    }
  }

  const handleCardClick = (event: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(event)
    }
  }
  const handleAddTargetChange = () => {
    if (onAddTargetChange) {
      onAddTargetChange(cardData)
    }
  }

  const handleLabelChange = (type: LabelSetType = 'edit') => {
    if (onLabelChange) {
      onLabelChange(cardData, type)
    }
  }

  return (
    <div
      className={classNames("card-label-item", className, {
        'checked': isChecked
      })}
      onClick={handleCardClick}
    >
      <div className="card-title">
        <span className="card-title-text" onClick={() => handleLabelChange('view')} title={cardData.labelName}>{cardData.labelName || '--'}</span>
        <span className="card-title-time">{cardData.updateTime || '--'} 更新</span>
      </div>
      <div className="card-con">
        <div className="card-info">
          <div className="card-info-label">目标总数：</div>
          <div
            className={classNames("card-info-content")}
          >{cardData.labelCount || 0}</div>
        </div>
        <div className="card-info">
          <div className="card-info-label">是否可布控：</div>
          <div
            className={classNames("card-info-content")}
          >{(cardData.canDeploy || '--') == 'yes' ? '是' : '否'}</div>
        </div>
        <div className="card-info">
          <div className="card-info-label">备注：</div>
          <div
            className={classNames("card-info-content")}
            title={cardData.remarks}
          >{cardData.remarks || '--'}</div>
        </div>
        <div className="card-info">
          <div className="card-info-label">创建人：</div>
          <div
            className={classNames("card-info-content")}
          >{cardData.creator || '--'}</div>
        </div>
      </div>
      <div className="card-label-footer">
        <Button onClick={() => {
          const dataType = cardData.labelTypeId
          window.open(`#/record-list?${encodeURIComponent(JSON.stringify({
            text: `${dataType === 'vehicle' ? '车辆' : '人员'}标签(1个)`,//写死就行
            searchType: dataType === 'vehicle' ? '2' : '1',//精确检索类型
            data: {
              ...(dataType === 'vehicle' ? {
                vehicleLabels: [cardData.labelId],
                idNumber: "",
                idType: "111",
                licensePlate: "",
                personName: "",
                plateColor: -1
              } : {
                label: [cardData.labelId],
                profileType: "3",
                age: ["", ""],
                captureCount: ["", ""]
              }),
            }
          }))}`)
        }} >查看</Button>
        {
          cardData.isSystem !== 1 && cardData.authority && cardData.authority === 'manage' ?
            <>
              <Button onClick={() => handleLabelChange('edit')}>编辑</Button>
              <Button onClick={handleAddTargetChange}>添加目标</Button>
              <PopConfirm
                title="确认要删除这条内容吗？"
                onConfirm={() => onDelChange?.(cardData)}
              >
                <Button type='danger'>
                  删除
                </Button>
              </PopConfirm>
            </>
            :
            <></>
        }
      </div>
    </div >
  )
}

export default CardNormal
