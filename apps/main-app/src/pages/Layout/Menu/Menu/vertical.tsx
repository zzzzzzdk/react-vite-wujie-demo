import React, { useContext, useState, useRef } from 'react'
import classNames from 'classnames'
import MenuLink from './MenuLink'
import Trigger from './MenuTrigger'
import MenuContext from './Context'
import DownOutlined from '@yisa/webui/es/Icon/DownOutlined'
import RightOutlined from '@yisa/webui/es/Icon/RightOutlined'
import MenuFoldOutlined from '@yisa/webui/es/Icon/MenuFoldOutlined'
import MenuUnfoldOutlined from '@yisa/webui/es/Icon/MenuUnfoldOutlined'
import FixedOutlined from '@yisa/webui/es/Icon/FixedOutlined'
import ReleaseOutlined from '@yisa/webui/es/Icon/ReleaseOutlined'
import Icon from './Icon'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const Vertical = (props: any) => {

  const {
    onChange,
    onOpen,
    onCollapsedChange,
    hover,
    fixed,
    onFixedChange,
  } = props


  const {
    inlineCollapsed,
    innerOpenKeys,
    data,
    prefixCls,
  } = useContext(MenuContext)

  const nodeRef = useRef<HTMLDivElement>(null);
  const [nowPath, setNowPath] = useState('')

  const onOpenN = (path: string) => {
    setNowPath(path)
    onOpen(path)
    setTimeout(function () {
      setNowPath('')
    }, 300)
  }

  return (
    <>
      <div className={`${prefixCls}-top`} >
        {
          data && data.length ? data.map((item: any, index: number) => {
            if (inlineCollapsed) {
              if (item.children && item.children.length) {
                return (
                  <Trigger
                    key={index}
                    popupAlign={{
                      points: ['tl', 'tr'],
                      offset: [10, -10],
                      overflow: { adjustX: false, adjustY: true },
                    }}
                    popup={
                      <div className={`${prefixCls}-content`}>
                        <MenuLink className={`${prefixCls}-item-title`} type='title' data={item} >
                          <span className='title'>{item.title}</span>
                        </MenuLink>
                        {
                          item.children.map((item2: any, index2: any) => {
                            if (item2.children && item2.children.length) {
                              return <Trigger
                                key={index2}
                                popupAlign={{
                                  points: ['tl', 'tr'],
                                  offset: [1, -10],
                                  overflow: { adjustX: false, adjustY: true },
                                }}
                                popup={
                                  <div className={`${prefixCls}-content`}>
                                    {
                                      item2.children.map((item3: any, index3: any) => {
                                        return <MenuLink level={3} onClick={onChange} data={item3} key={index3} >
                                          <span className='title'>{item3.title}</span>
                                        </MenuLink>
                                      })
                                    }
                                  </div>
                                }>
                                <MenuLink type='menu' level={2} data={item2} >
                                  <span className='title'>{item2.title}</span>
                                  <span className='operation'><RightOutlined /></span>
                                </MenuLink>
                              </Trigger>
                            } else {
                              return <MenuLink level={2} onClick={onChange} data={item2} key={index2} >
                                <span className='title'>{item2.title}</span>
                              </MenuLink>
                            }
                          })
                        }
                      </div>
                    }>
                    <MenuLink type='menu' data={item} >
                      <span className='icon'>
                        {
                          item.icon ? <Icon icon={item.icon} /> : item.title.charAt(0)
                        }
                      </span>
                      <span className='title hide'>{item.title}</span>
                    </MenuLink>
                  </Trigger>
                )
              } else {
                return <Trigger
                  key={index}
                  popupAlign={{
                    points: ['tl', 'tr'],
                    offset: [10, 0],
                    overflow: { adjustX: false, adjustY: true },
                  }}
                  mouseEnterDelay={0}
                  mouseLeaveDelay={0.1}
                  popup={<div className={`${prefixCls}-title`}>{item.title}</div>}>
                  <MenuLink onClick={onChange} data={item} >
                    <span className='icon'>
                      {
                        item.icon ? <Icon icon={item.icon} /> : item.title.charAt(0)
                      }
                    </span>
                    <span className='title hide'>{item.title}</span>
                  </MenuLink>
                </Trigger>
              }
            } else {
              if (item.children && item.children.length) {
                return (
                  <div className={
                    classNames(`${prefixCls}-sub`,
                      innerOpenKeys.indexOf(item.path as never) >= 0 ? `${prefixCls}-sub-open` : '',
                      nowPath == item.path ? `${prefixCls}-animation` : '')
                  }
                    key={index}>
                    <MenuLink type='menu' data={item} onClick={() => { onOpenN(item.path) }} >
                      <span className='icon'><Icon icon={item.icon} /></span>
                      <span className='title show'>{item.title}</span>
                      <span className='operation show'><DownOutlined /></span>
                    </MenuLink>

                    <div
                      className={classNames(`${prefixCls}-sub-list`)}
                      style={{
                        maxHeight: innerOpenKeys.indexOf(item.path as never) >= 0 ? `${item.children.length * 58 + 10}px` : 0,
                        // animation: inlineCollapsed ? 'slideIn 0.4s ease' : 'slideOut 0.4s ease'
                      }} >
                      <TransitionGroup enter={true} appear={true} exit={true}>
                        {
                          item.children.map((item2: any, index2: number) => {
                            if (item2.children && item2.children.length) {
                              return (
                                <Trigger
                                  key={index2}
                                  popupAlign={{
                                    points: ['tl', 'tr'],
                                    offset: [10, -10],
                                    overflow: { adjustX: false, adjustY: true },
                                  }}
                                  popup={
                                    <div className={`${prefixCls}-content`}>
                                      {
                                        item2.children.map((item3: any, index3: any) => {
                                          return <MenuLink level={3} onClick={onChange} data={item3} key={index3} >
                                            <span className='title'>{item3.title}</span>
                                          </MenuLink>
                                        })
                                      }
                                    </div>
                                  }>

                                  <MenuLink type='menu' level={2} data={item2}>
                                    <span className='title'>{item2.title}</span>
                                    <span className='operation'><RightOutlined /></span>
                                  </MenuLink>
                                </Trigger>
                              )
                            } else {
                              return (
                                <CSSTransition
                                  key={index2}
                                  nodeRef={item2.nodeRef}
                                  addEndListener={(done: any) => {
                                    item2.nodeRef.current?.addEventListener("transitionend", done, false);
                                  }}
                                  classNames="menu-item"
                                >
                                  <div ref={item2.nodeRef} className="menu-item">
                                    <MenuLink level={2} onClick={onChange} data={item2} key={index2}>
                                      <span className='title'>{item2.title}</span>
                                    </MenuLink>
                                  </div>
                                </CSSTransition>
                              )
                            }
                          })
                        }
                      </TransitionGroup>
                    </div>
                  </div>
                )
              } else {
                return <MenuLink onClick={onChange} data={item} key={index} >
                  <span className='icon'><Icon icon={item.icon} /></span>
                  <span className='title show'>{item.title}</span>
                </MenuLink>
              }
            }
          }) : null
        }
      </div>
      <div className={`${prefixCls}-bottom`} >
        {
          hover ?
            inlineCollapsed ? null :
              <span onClick={onFixedChange} className={`${prefixCls}-bottom-collapsed`}>
                {
                  fixed ? <ReleaseOutlined /> : <FixedOutlined />
                }
              </span> :
            <span onClick={onCollapsedChange} className={`${prefixCls}-bottom-collapsed`}>
              {
                inlineCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
            </span>
        }
      </div>
    </>
  )
}

export default Vertical
