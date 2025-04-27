import React, { useState, useEffect } from 'react'
import { getPrefixCls } from '@/config'
import classNames from 'classnames'
import './index.scss'

type PageType = '403' | '404'

interface ErrorPageProps {

  /**
   * 类名
   */
  className?: string;

  /**
   * 是否跳转
   */
  showJump?: boolean;

  /**
   * 跳转回调
   */
  jumpPage?: () => void;

  /**
    * 倒计时 多少s
    */
  countDown?: number;


  /**
   * 页面类型  '403' | '404'
   */
  type?: PageType;

}

function ErrorPage(props: ErrorPageProps) {

  const {
    className,
    showJump = false,
    jumpPage,
    countDown = 10,
    type = '403'
  } = props

  const prefixCls = getPrefixCls('error-page')

  const cn = classNames(
    className,
    `${prefixCls}-${type}`
  )

  const [num, setNum] = useState(countDown)


  const goPage = () => {
    jumpPage && jumpPage()
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showJump) {
      if (num === 1) {
        goPage()
      } else {
        timer = setTimeout(() => {
          setNum(num - 1)
        }, 1000)
      }
    }
    return () => {
      clearTimeout(timer)
    }
  }, [num])


  return (
    <div className={cn}>
      <div className={prefixCls + '-image'}></div>
      <div className={prefixCls + '-button'}>
        {
          showJump ?
            type == '404' ?
              <>页面不存在，{num}s后自动返回<span onClick={goPage}>首页</span>。</> :
              <>无权限，{num}s后自动返回<span onClick={goPage}>首页</span>。</>
            :
            null
        }
      </div>
    </div>
  )
}

export default ErrorPage
