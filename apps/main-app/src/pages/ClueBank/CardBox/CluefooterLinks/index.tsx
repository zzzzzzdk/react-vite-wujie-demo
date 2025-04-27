import React from 'react'
import { Message, Popover, Link } from '@yisa/webui'
import { MoreOutlined } from '@yisa/webui/es/Icon'
import './index.scss'
import More from '@/components/Card/FooterLinks/More'
const MoreOuter = () => <MoreOutlined />
function CluefooterLinks(props:any) {
    const {
        eleClick = () => { },
        cardData,
      } = props
    
      const links = [
        {
          link: cardData ? `#/image?bigImage=${cardData.bigImage}` : '',
          text: "以图检索"
        },
        {
          // link: '1',
          text: "跨镜追踪"
        },
        {
          children: [
            {
              // link: '1',
              text: "跨镜追踪"
            },
            {
              // link: '1',
              text: "加入线索库"
            },
            {
              // link: '1',
              text: "纠错"
            },
          ]
        }
      ]
    
      return (
        
        <div className="cluecard-footer">
          {links.map((elem: any, index: number) => {
            if (elem.children) {
              return (
                <More
                  key={index}
                  eleClick={eleClick}
                  triggerRender={MoreOuter}
                  className="card-footer-more"
                  cardData={cardData}
                  moreData={elem.children}
                  placement="rightTop"
                />
              )
            } else {
              // if (!elem.link) {
              //   return <Link key={index} className='no-link' onClick={() => { Message.warning(`检测到未部署${elem.sysText || ''}，该功能暂时无法使用。如需帮助，请联系以萨工作人员。`) }}>{elem.text}</Link>
              // } else {
              return <Link key={index} href={elem.link} target="_blank" disabled={!elem.link}>{elem.text}</Link>
              // }
            }
    
          })}
        </div>
      )
}


export default CluefooterLinks
