import React, { useEffect, useState, useContext, useRef } from 'react'
import MenuLink from './MenuLink'
import Trigger from './MenuTrigger'
import MenuContext from './Context'
import ResizeObserver from 'resize-observer-polyfill'
import DownOutlined from '@yisa/webui/es/Icon/DownOutlined'
import RightOutlined from '@yisa/webui/es/Icon/RightOutlined'
import EllipsisOutlined from '@yisa/webui/es/Icon/EllipsisOutlined'


const Horizontal = (props: any) => {

  const {
    onChange,
    horizontalData,
    onChangeHorizontalData,
    wapref
  } = props

  const {
    data,
    prefixCls
  } = useContext(MenuContext)

  const timer = useRef<NodeJS.Timeout>()

  const [reset, setReset] = useState(true)

  const first = useRef<boolean>(true)

  const horizontalElsHandle = () => {
    try {
      const data1 = [...data]
      let data2: any[] = []
      let index = 0
      const dom: any = wapref.current
      if (dom.scrollWidth > dom.offsetWidth) {
        const itemList = dom.getElementsByClassName(`${prefixCls}-item`)
        for (let i = 0; i < itemList.length; i++) {
          if (itemList[i].offsetLeft + itemList[i].offsetWidth + 20 + 40 + 10 > dom.offsetWidth) {
            data2 = data1.splice(i, data1.length - 1)
            index = i
            break
          }
        }
        onChangeHorizontalData({
          data1: data1 as any,
          data2: data2 as any,
          enable: true,
          index: index
        })
      } else {
        onChangeHorizontalData({
          data1: [],
          data2: [],
          enable: false,
          index: 0
        })
      }
    } catch (e) {
      // console.log(e)
    }
  }

  useEffect(() => {
    if (reset) {
      horizontalElsHandle()
      setReset(false)
    }
  }, [reset])

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (!first.current) {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          setReset(true)
        }, 300)
      } else {
        first.current = false
      }
    })
    ro.observe(wapref.current)
  }, [])


  let arr = data
  if (!reset && horizontalData.enable) {
    arr = horizontalData.data1
  }

  return <>
    {
      arr && arr.length ? arr.map((item: any, index: number) => {
        if (item.children && item.children.length) {
          return (
            <Trigger
              key={index}
              popupAlign={{
                points: ['tl', 'bl'],
                offset: [2, 10],
                overflow: { adjustX: true, adjustY: false },
              }}
              popup={
                <div className={`${prefixCls}-content`}>
                  {
                    item.children.map((item2: any, index2: any) => {
                      if (item2.children && item2.children.length) {
                        return <Trigger
                          key={index2}
                          popupAlign={{
                            points: ['tl', 'tr'],
                            offset: [0, -10],
                            overflow: { adjustX: true, adjustY: false },
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
                        return <MenuLink level={2} onClick={onChange} data={item2} key={index2}>
                          <span className='title'>{item2.title}</span>
                        </MenuLink>
                      }
                    })
                  }
                </div>
              }>
              <MenuLink type='menu' data={item}>
                <span className='title'>{item.title}</span>
                <span className='operation'><DownOutlined /></span>
              </MenuLink>
            </Trigger>
          )
        } else {
          return <MenuLink onClick={onChange} data={item} key={index} >
            <span className='title'>{item.title}</span>
          </MenuLink>
        }
      }) : null
    }

    {
      horizontalData.enable && horizontalData.data2.length ? <Trigger
        popupAlign={{
          points: ['tl', 'bl'],
          offset: [2, 10],
          overflow: { adjustX: true, adjustY: false },
        }}
        popup={
          <div className={`${prefixCls}-content`}>
            {
              horizontalData.data2.map((item: any, index: number) => {
                if (item.children && item.children.length) {
                  return (
                    <Trigger
                      key={index}
                      popupAlign={{
                        points: ['tl', 'tr'],
                        offset: [0, -10],
                        overflow: { adjustX: true, adjustY: false },
                      }}
                      popup={
                        <div className={`${prefixCls}-content`}>
                          {
                            item.children.map((item2: any, index2: any) => {
                              if (item2.children && item2.children.length) {
                                return <Trigger
                                  key={index2}
                                  popupAlign={{
                                    points: ['tl', 'tr'],
                                    offset: [0, -10],
                                    overflow: { adjustX: true, adjustY: false },
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
                        <span className='title'>{item.title}</span>
                        <span className='operation'><RightOutlined /></span>
                      </MenuLink>
                    </Trigger>
                  )
                } else {
                  return <MenuLink onClick={onChange} data={item} key={index} >
                    <span className='title'>{item.title}</span>
                  </MenuLink>
                }
              })
            }
          </div>
        }>
        <MenuLink className={`${prefixCls}-els`} type='menu' level={4} data={{ path: '__els' }} >
          <span className='title'><EllipsisOutlined /></span>
        </MenuLink>
      </Trigger> : null
    }
  </>
}


export default Horizontal
