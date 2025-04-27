import React, { useMemo, useState } from 'react'
import { Message, Popover, Link, Tooltip } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import { FooterLinksProps, LinkType } from './interface'
import More from './More'
import { quickLinks, validatePlate } from '@/utils'
import { ResultRowType } from "@/pages/Search/Target/interface";
import { logReport } from "@/utils/log";
import './index.scss'
import { JoinClue } from '@/components'

const MoreOuter = () => <Icon type="gengduozhanshi" />

function FooterLinks(props: FooterLinksProps) {
  const {
    eleClick = () => { },
    cardData,
  } = props
  //加入线索库
  const [showClue, setShowClue] = useState(false)
  const [checkedList, setCheckedList] = useState<any[]>([])

  const handleJump = (elem: LinkType) => {
    if (elem.link === 'joinClue') {
      setShowClue(true)
      setCheckedList([cardData])
    } else {
      const desc = cardData?.['source'] === 'sameScene' ?
        `图片1 - 大图弹窗 - 同画面分析 - 图片2 -【快捷操作：${elem.text}】`
        :
        `图片【1】-【快捷操作：${elem.text}】`

      logReport({
        type: elem.text === '步态检索' ? 'gait' : 'none',
        data: {
          desc,
          data: cardData as any
        }
      })
      window.open(elem.link)
    }


  }

  return (
    <div className="card-footer">
      {quickLinks(cardData as ResultRowType).map((elem: LinkType, index: number) => {
        if (elem.children) {
          return (
            <span className='more-links-wrap-wrap' key={index}>
              <More
                eleClick={eleClick}
                triggerRender={MoreOuter}
                className="card-footer-more"
                cardData={cardData}
                moreData={elem.children}
                placement="rightTop"
              />
            </span>
          )
        } else {
          // if (!elem.link) {
          //   return <Link key={index} className='no-link' onClick={() => { Message.warning(`检测到未部署${elem.sysText || ''}，该功能暂时无法使用。如需帮助，请联系以萨工作人员。`) }}>{elem.text}</Link>
          // } else {
          return (
            // <Link key={index} href={elem.link} target="_blank" disabled={!elem.link}>{elem.text}</Link>

            elem.link?.startsWith("#/real-time-tracking") && cardData?.targetType === "vehicle" && ["无牌", "无车牌", "未识别", "未知"].includes(cardData.licensePlate2) ?
              <Tooltip title="该车辆无二次识别车牌" placement="top" key={index}>
                <span className='ysd-link ysd-link-disabled' key={index}>{elem.text}</span>
              </Tooltip>
              :
              <span className='ysd-link ysd-link-default' onClick={() => handleJump(elem)} key={index}>{elem.text}</span>
          )
          // }
        }

      })}
      <JoinClue
        cardData={cardData}
        visible={showClue}
        clueDetails={checkedList}
        onOk={() => { setShowClue(false) }}
        onCancel={() => { setShowClue(false) }}
      />

    </div>
  )
}

export default FooterLinks
