import React, { useContext } from 'react'
import classNames from 'classnames'
import MenuContext from './Context'

const MenuLink = (props: any) => {

  const {
    data,
    level = 1,
    className,
    onClick,
    type = 'link',
    children,
    ...other
  } = props

  const { link, activeKey, activePath, prefixCls } = useContext(MenuContext)

  const Link: any = link

  const testUrl = (path: string) => {
    return /^https?:/.test(path)
  }

  const cn = classNames(
    `${prefixCls}-item`,
    className,
    {
      [`${prefixCls}-item-active`]: activeKey == data.path,
      [`${prefixCls}-select`]: type == 'menu' && activePath[level - 1] == data.path,
    }
  )

  return (
    <div
      onClick={() => { if (onClick) onClick(data.path) }}
      className={cn}
      {...other}>
      {
        type == 'menu' || type == 'title' ?
          <div className={`${prefixCls}-item-content`}>
            {children}
          </div> :
          Link && !testUrl(data.path) ?
            <Link
              className={`${prefixCls}-item-content`}
              target={data.target || '_self'}
              to={data.path}>
              {children}
            </Link> :
            <a
              className={`${prefixCls}-item-content`}
              target={data.target || '_blank'}
              href={data.path}
            >
              {children}
            </a>
      }
    </div>
  )
}


export default MenuLink
