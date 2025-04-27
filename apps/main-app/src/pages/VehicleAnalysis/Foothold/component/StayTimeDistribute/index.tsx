import React, { useEffect, useState, useRef } from 'react'
import './index.scss'
import classnames from 'classnames'
import { ChartData, ChartDataArr } from '../../interface';
import { StayTimeDistributeProps } from './interface';

function StayTimeDistribute(props: StayTimeDistributeProps) {
  const itemHeigth = 26; // 每个元素的高度
  const boxHeigth = 130; // 盒子的高度

  const listBoxRef = useRef<any>(null)
  const listRef = useRef<any>(null)
  const { chartData } = props
  const [allData, setAllData] = useState<ChartDataArr[]>([])
  const [topMore, setTopMore] = useState(false)
  const [bottomMore, setBottomMore] = useState(false)
  const [newchartData, setNewchartdata] = useState(chartData)
  const [needhidden, setNeedhidden] = useState<('days' | 'short' | 'night')[]>([])

  useEffect(() => {
    setAllData([...chartData])
    setNeedhidden([])
    let minHeight = listRef.current.clientHeight
    let realHeight = chartData.length * itemHeigth
    if (realHeight > minHeight) {
      setBottomMore(true)
    }
    if (listBoxRef.current) {
      // 将区域滚动到有数据的第一条
      const scrollIndex = chartData.findIndex(obj => Array.isArray(obj.data) && obj.data.length > 0);
      listBoxRef.current.scrollTop = (scrollIndex) * itemHeigth
    }
  }, [chartData])

  const computedStyle = (elem: ChartData) => {
    // 计算起始点与宽度
    const boxWidth = 24
    let curLeft = '', curWidth = ''
    let slot = elem.value ? elem.value : []
    let start = Number(slot[0].split(':').join("."))
    let end = Number(slot[1].split(":").join("."))
    // start = Number(start)
    // end = Number(end)
    let leftNum = start / boxWidth * 100
    let widthNum = (end / boxWidth * 100) - (start / boxWidth * 100)
    curLeft = leftNum + "%"
    curWidth = widthNum + "%"
    // 顶边没有圆角
    let radiusObj = {}
    if (start == 0) {
      radiusObj = Object.assign({}, radiusObj, {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      })
    }
    if (leftNum + widthNum == 100) {
      radiusObj = Object.assign({}, radiusObj, {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      })
    }

    return Object.assign({}, radiusObj, {
      left: curLeft,
      width: curWidth
    })
  }

  // 向上翻页
  const handleScrollPrev = () => {
    let curTop = listBoxRef.current.scrollTop
    curTop = curTop - itemHeigth < 0 ? 0 : curTop - itemHeigth
    listBoxRef.current.scrollTop = curTop
  }
  // 向下翻页
  const handleScrollNext = () => {
    let curTop = listBoxRef.current.scrollTop
    curTop = curTop + itemHeigth > allData.length * itemHeigth ? allData.length * itemHeigth : curTop + itemHeigth
    listBoxRef.current.scrollTop = curTop
  }

  let scrollTimer: NodeJS.Timeout;
  const handleOnScroll = () => {
    // console.log('滚动中：' + listBoxRef.current.scrollTop)
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      // todo something scroll end
      let curTop = listBoxRef.current.scrollTop
      let remainder = curTop % itemHeigth // 余数
      // 计算当前滚动的高度是否是单个元素的倍数，如果是直接滚动到当前位置；如果不是，计算余数大于或小于一边的高度，小于往上一个定位，大于往下一个定位
      let resetTop = remainder > 0 ? remainder < 13 ? Math.floor(curTop / itemHeigth) * itemHeigth : Math.floor(curTop / itemHeigth) * itemHeigth + itemHeigth : curTop
      listBoxRef.current.scrollTop = resetTop
      // console.log(resetTop)
      // 设置按钮状态
      if (resetTop > 0) {
        setTopMore(true)
      } else {
        setTopMore(false)
      }
      let surplusHeight = allData.length * itemHeigth - resetTop
      if (surplusHeight <= boxHeigth) {
        setBottomMore(false)
      } else {
        setBottomMore(true)
      }
    }, 300);
  }

  const tipclick = (type: 'days' | 'short' | 'night') => {
    if (needhidden.indexOf(type) === (-1)) {
      setNeedhidden([...needhidden, type])
    }
    else {
      let newneedhidden = needhidden.filter((item) => {
        return item != type
      })
      setNeedhidden(newneedhidden)
    }
  }
  return (
    <div className="stay-time-distribute-wrap">
      <div className="stay-time-title">
        <div className="title"></div>
        <div className="tip-show">
          <div className="tip-item" onClick={() => { tipclick('short') }}>
            <span className="tip-short"></span>短暂
          </div>
          <div className="tip-item" onClick={() => { tipclick('night') }}>
            <span className="tip-night"></span>过夜
          </div>
          <div className="tip-item" onClick={() => { tipclick('days') }}>
            <span className="tip-days"></span>多日
          </div>
        </div>
      </div>
      <div className="stay-time-con">
        <div onClick={handleScrollPrev} className={classnames(`btn-prev`, {
          'has-more': topMore
        })}></div>
        <div onClick={handleScrollNext} className={classnames(`btn-next`, {
          'has-more': bottomMore
        })}></div>
        <div className="stay-time-scroll-wrap" ref={listBoxRef} onScroll={handleOnScroll}>
          <div className="stay-time-scroll" ref={listRef}>
            {
              allData && allData.length ?
                allData.map((item: ChartDataArr, index: number) => {
                  return <div className="stay-time-item" key={index}>
                    <div className="left-date">{item.time}</div>
                    <div className="right-con">
                      {
                        item.data && item.data.length ?
                          item.data.map((elem: ChartData, i: number) => {
                            return <div
                              key={i}
                              // className={`time-slot ${elem.type} ${charttype.indexOf(elem.type)===(-1)?'hid':''}`} 
                              className={`time-slot ${elem.type} ${needhidden.indexOf(elem.type) !== (-1) ? 'hid' : ''}`}
                              style={computedStyle(elem)}
                            ></div>
                          })
                          :
                          ""
                      }
                    </div>
                  </div>
                })
                :
                null
            }
          </div>
        </div>
        <div className="stay-time-bg">
          <div className="lines">
            <div className="line"><span>00:00</span></div>
            <div className="line"><span>04:00</span></div>
            <div className="line"><span>08:00</span></div>
            <div className="line"><span>12:00</span></div>
            <div className="line"><span>16:00</span></div>
            <div className="line"><span>20:00</span></div>
            <div className="line"><span>24:00</span></div>
          </div>
          <div className="times">
            <span></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StayTimeDistribute