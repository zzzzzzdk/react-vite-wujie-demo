import React, { useMemo, useEffect, useState, useRef } from 'react'
import { LeftFilled } from '@yisa/webui/es/Icon';
import ModalBody from './ModalBody'
import { PlateKeyboardProps } from './interface'
import classNames from 'classnames'

let data = [
  ['京', '沪', '津', '渝', '黑', '吉', '辽', '蒙', '冀', '新', '甘', '青', '陕', '宁', '豫', '鲁', '晋', '皖', '鄂', '湘', '苏', '川', '贵', '云', '桂', '藏', '浙', '赣', '粤', '闽', '琼', '广', '港', '澳'],
  ['WJ', '军', '空', '警', '学', '挂'],
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  ['*', '?']
]

function PlateKeyboard(props: PlateKeyboardProps) {
  const {
    onClick = () => { },
    onDel = () => { },
    onConfirm = () => { },
    remind,
    province,
    position,
    show = false,
    placement,
    verticalDis,
    horizontalDis,
    prefixCls,
    getPopupContainer,
    keyboardClassName,
    accurate = false
  } = props



  const cn = classNames(
    keyboardClassName,
    prefixCls
  )

  const domRef = useRef<any>(null)

  const [platePosition, setPlatePosition] = useState({
    top: 0,
    left: 0
  })

  const keyboardPositionH = () => {
    let obj: any = {
      opacity: 1
    }
    switch (placement) {
      case "bottom":
        obj.left = position.left - 9 + horizontalDis
        obj.top = position.bottom + 2 + verticalDis
        break;
      case "top":
        obj.left = position.left - 9 + horizontalDis
        obj.top = position.top - 2 - domRef.current.offsetHeight - verticalDis
        break;
      case "left":
        obj.left = position.left - domRef.current.offsetWidth - 9 - horizontalDis
        obj.top = position.top - 2 + verticalDis
        break;
      case "right":
        obj.left = position.right + 9 + horizontalDis
        obj.top = position.top - 2 + verticalDis
        break;
    }
    setPlatePosition(obj)
  }

  const paltedata = useMemo(() => {
    let arrt = JSON.parse(JSON.stringify(data))
    // 如果是精确，删除*和？
    if (accurate) {
      arrt.pop()
    }
    if (arrt && arrt.length && arrt[0].length) {
      let arr: string[] = []
      arrt[0].map((item: string) => {
        if (item == province) {
          arr.unshift(item)
        } else {
          arr.push(item)
        }
      })
      arrt[0] = arr
    }
    return arrt
  }, [data, province])


  useEffect(() => {
    if (show) {
      keyboardPositionH()
    }
  }, [show])



  return (
    <ModalBody getPopupContainer={getPopupContainer}>
      <div className={cn} ref={domRef} style={{ ...platePosition, display: show ? 'block' : 'none' }}>
        {
          paltedata.map((item: any, index: number) => {
            return (
              <span className={'keyboard-item ' + 'keyboard-item' + (index + 1)} key={index + 1}>
                {
                  item.map((item2: string) => {
                    return <span className="keyboard-item-n"
                      onClick={() => { onClick(item2) }}
                      key={item2}>
                      {item2}
                    </span>
                  })
                }
              </span>
            )
          })
        }
        <span className="keyboard-del-button" onClick={onDel} style={{ marginLeft: accurate ? '78px' : '2px' }}>
          <LeftFilled />
        </span>
        <span className="keyboard-del-button keyboard-confirm" onClick={onConfirm}>确定</span>
        <div className="keyboard-remind-text">
          {remind}
        </div>
      </div>
    </ModalBody >
  )
}

export default PlateKeyboard
