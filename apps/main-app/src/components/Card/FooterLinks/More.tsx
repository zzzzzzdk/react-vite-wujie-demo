import React, { useEffect, useState } from 'react'
import { Popover, Message, Link } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import { FooterLinksMoreProps, LinkType } from './interface';
import { ErrorSubmitModal, JoinClue } from '@/components'
import './more.scss'
import { isFunction } from '@/utils';
import { logReport } from "@/utils/log";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { TargetFeatureItem } from '@/config/CommonType';
import classNames from 'classnames'

function More(props: FooterLinksMoreProps) {
  const {
    triggerRender,
    eleClick = () => { },
    cardData,
    moreData = [],
    placement = 'right',
    className,
    style
  } = props

  const [visible, setVisible] = useState(false)
  //加入线索库
  const [showClue, setShowClue] = useState(false)
  //纠错
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [checkedList, setCheckedList] = useState<any[]>([])


  const hideVisible = () => {
    setVisible(false)
  };

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible)
  };


  const handleEleClick = (childElem: LinkType) => {
    if (eleClick && isFunction(eleClick)) {
      eleClick(childElem, cardData)
    }

    if (childElem.link === 'joinClue') {
      setShowClue(true)
      setCheckedList([cardData])
    }

    if (childElem.link === 'errorSubmit') {
      setErrorModalVisible(true)
      setCheckedList([cardData])
    }
  }

  // 取消纠错
  const handleErrorModalCancel = () => {
    setErrorModalVisible(false)
  }
  // 提交纠错
  const errorSubmitPost = () => {
    setErrorModalVisible(false)
  }

  const handleJump = (elem: LinkType, data: TargetFeatureItem) => {
    logReport({
      type: elem.text === '步态检索' ? 'gait' : 'none',
      data: {
        desc: `图片【1】-【快捷操作：${elem.text}】`,
        data: data
      }
    })
    window.open(elem.link)
  }

  return (
    <Popover
      style={style}
      visible={visible}
      onVisibleChange={handleVisibleChange}
      overlayClassName="card-more-popover"
      placement={placement}
      getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
      content={
        moreData
          ?
          moreData.map((childElem, childIndex) => {
            return <div className="role-p" key={childIndex} onClick={hideVisible}>
              {
                childElem.isClick
                  ?
                  <span className={childElem.className} onClick={() => { handleEleClick(childElem) }}>{childElem.text}</span>
                  :
                  !!childElem.link
                    ?
                    // <Link href={childElem.link} target="_blank">{childElem.text}</Link>
                    <span
                      className={classNames('ysd-link ysd-link-default', {
                        "ysd-link-disabled": childElem.disabled
                      })}
                      onClick={childElem.disabled ? () => { } : () => handleJump(childElem, cardData)}
                    >{childElem.text}</span>
                    :
                    <span className='no-link' onClick={() => { Message.warning(`该功能暂时无法使用。如需帮助，请联系以萨工作人员。`) }}>{childElem.text}</span>
              }
            </div>
          })
          :
          <></>
      }
    >
      <span className={`more-links-wrap ${className ? className : ''}`}>
        {
          triggerRender
            ?
            triggerRender()
            :
            <Icon type="gengduozhanshi" />
        }
      </span>
      <JoinClue
        cardData={cardData}
        visible={showClue}
        clueDetails={checkedList}
        onOk={() => { setShowClue(false) }}
        onCancel={() => { setShowClue(false) }}
      />
      <ErrorSubmitModal
        carryData={checkedList[0]}
        modalVisible={errorModalVisible}
        onCancel={handleErrorModalCancel}
        onOk={errorSubmitPost}
      />
    </Popover>
  )
}

export default More
