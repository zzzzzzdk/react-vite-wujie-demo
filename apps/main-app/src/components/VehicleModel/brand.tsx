import { useState, useContext, useMemo, useRef, MouseEvent, useEffect } from 'react'
import { VehicleModelContext } from './context'
import { Input, Scrollbar } from '@yisa/webui'
import { brandListProps, value } from './interface'
import classNames from 'classnames'
import { isArray, isNumber } from '@/utils/is'

type itemData = {
  v?: string,
  k?: string,
  isLetter?: Boolean,
}

function Brand(props: brandListProps) {
  const {
    isMultiple,
    prefixCls
  } = props
  const {
    maxHeight,
    noData,
    searchPlaceholder,
    brandData,
    brandValue,
    onChange
  } = useContext(VehicleModelContext)

  const placeholder = isArray(searchPlaceholder) ? searchPlaceholder[0] || '搜索' : searchPlaceholder
  const values = isArray(brandValue) ? brandValue : [brandValue].filter(Boolean)
  const animationIds = useRef<Map<HTMLElement, number>>(new Map())
  const scrollRef = useRef<any>(null)
  const letterRefs = useRef<Map<value, HTMLElement | null>>(new Map())
  const itemRefs = useRef<Map<value, HTMLElement | null>>(new Map())
  const [activeLetter, setActiveLetter] = useState<value>('热门')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    if (values.length) {
      const value = values[0]
      const top = itemRefs.current.get(value!)?.offsetTop
      if (top) {
        scrollToCb(top, 0)
      }
    }
  }, [])

  const [letterData, allData] = useMemo(() => {
    const data = Object.entries(brandData || {})
    const letterData: itemData[] = []
    const allData: itemData[] = []
    data.forEach(elem => {
      const [key, item] = elem
      const { nodes = [] } = item
      const filterNodes = nodes.filter(elem => `${elem?.v}`.toLowerCase().includes(filterText.toLowerCase()))
      letterData.push({
        v: key,
        k: key
      })
      if (filterNodes.length) {
        allData.push({
          v: key,
          k: key,
          isLetter: true
        })
        filterNodes.forEach(node => {
          const { v, k } = node
          allData.push({
            v,
            k,
            isLetter: false
          })
        })
      }
    })
    return [letterData, allData]
  }, [brandData, filterText])

  const scrollToCb = (to: number, duration: number) => {
    if (animationIds.current.get(scrollRef.current)) {
      cancelAnimationFrame(animationIds.current.get(scrollRef.current)!)
    }

    if (duration <= 0) {
      animationIds.current.set(scrollRef.current, requestAnimationFrame(() => {
        scrollRef.current.setScrollTop(to)
      }))

      return
    }

    const diff = to - scrollRef.current.getScrollTop()
    const perTick = (diff / duration) * 10

    animationIds.current.set(scrollRef.current, requestAnimationFrame(() => {
      const top = scrollRef.current.getScrollTop()
      scrollRef.current.setScrollTop(top + perTick)
      if (top !== to) {
        scrollToCb(to, duration - 10)
      }
    }))
  }

  const handleScrollBrand = (values: any) => {
    const { scrollTop } = values
    let _activeLetter: value = ''
    letterRefs.current.forEach((item, key) => {
      const top = item?.offsetTop
      if (scrollTop >= (top || 0)) {
        _activeLetter = key
      }
    })
    if (activeLetter) {
      setActiveLetter(_activeLetter)
    }
  }

  const handleStopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const handleChangeActiveLetter = (letter: value) => {
    setActiveLetter(letter)
    let top = letterRefs.current.get(letter)?.offsetTop
    isNumber(top) && scrollToCb(top, 160)
  }

  const handleChangeFilterText = (e: any) => {
    setFilterText(e.target.value)
  }

  const handleChangeBrand = (value: value) => {
    const isActive = !values.includes(value)
    let _brandValue: any[] = values
    if (isActive) {
      onChange && onChange(isMultiple ? [..._brandValue, value] : value, [], [])
    } else {
      onChange && onChange(isMultiple ? _brandValue.filter(elem => elem !== value) : undefined, [], [])
    }
  }

  const handleRenderLetter = () => {
    return <div className={`${prefixCls}-letter`}>
      <Scrollbar
        trackSize={2}
        autoHeight
        autoHeightMax={maxHeight}
      >
        {
          letterData.map(elem => {
            const { v, k } = elem
            return <div
              key={k}
              className={classNames(
                `${prefixCls}-letter-item`,
                {
                  [`${prefixCls}-letter-item-active`]: activeLetter === k
                }
              )}
              onClick={() => handleChangeActiveLetter(k!)}
            >
              {v}
            </div>
          })
        }
      </Scrollbar>
    </div>
  }

  const handleRenderBrand = () => {
    return <div className={`${prefixCls}-column`}>
      <div className={`${prefixCls}-search`}>
        <Input
          size="mini"
          placeholder={placeholder}
          value={filterText}
          onChange={handleChangeFilterText}
        />
      </div>
      <div className={`${prefixCls}-column-list`}>
        <Scrollbar
          ref={scrollRef}
          trackSize={2}
          autoHeight
          autoHeightMax={(maxHeight || 540) - 30}
          onScrollFram={handleScrollBrand}
        >
          {
            allData.map((elem, index) => {
              const { v, k, isLetter } = elem
              return <div
                ref={element => {
                  if (isLetter) {
                    letterRefs.current.set(k!, element)
                  } else {
                    itemRefs.current.set(k!, element)
                  }
                }}
                key={`${k}_${index}`}
                className={classNames(
                  `${prefixCls}-column-item`,
                  {
                    [`${prefixCls}-column-item-letter`]: isLetter,
                    [`${prefixCls}-column-item-active`]: values.includes(k)
                  }
                )}
                title={v?.toString()}
                {...(!isLetter && {
                  onClick: () => handleChangeBrand(k!)
                })}
              >
                {v}
              </div>
            })
          }
          {
            !allData.length && noData
          }
        </Scrollbar>
      </div>
    </div>
  }

  return (
    <div
      className={`${prefixCls}-list ${prefixCls}-list-brand`}
      onClick={handleStopPropagation}
    >
      {handleRenderLetter()}
      {handleRenderBrand()}
    </div>
  )
}

export default Brand
