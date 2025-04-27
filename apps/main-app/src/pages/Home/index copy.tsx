import React, { useState, useEffect, useMemo } from 'react'
import { Message, Popover, Space, Loading } from "@yisa/webui";
import { useSelector, RootState } from "@/store";
import { removeToken } from '@/utils'
import { Icon } from '@yisa/webui/es/Icon';
import { Link } from 'react-router-dom'
import noDataDark from '@/assets/images/image/search-nodata-dark.png'
import noDataLight from '@/assets/images/image/search-nodata-light.png'
import headerLeft from "@/assets/images/home/header-left.png"
import bgVideoSmall from "@/assets/images/home/home-head.gif"
import { ItemMenu } from "@/store/slices/user"

import './index.scss'
function Home() {
  const userInfo = useSelector((state: any) => {
    return state.user.userInfo
  });

  const menuData = useSelector((state: RootState) => {
    return state.user.menu
  })
  const { skin } = useSelector((state: RootState) => {
    return state.comment
  })
  const [moduleLoading, setModuleLoading] = useState(false) // moduleloading

  console.log(menuData.filter(item => item.text == '车辆研判')[0])

  const contentUser = (
    <div className='info'>
      <div className='username'>
        <span>用户ID：</span>
        <span className='name'>{userInfo.name}</span>
      </div>
      <div className='role'>
        <span className='label' >角色：</span>
        <Space className='role-list' size={6} wrap={true}>
          {
            userInfo.role && userInfo.role.length && userInfo.role.map((item: string, index: number) => {
              return <span key={index} className='role-name'>{item}</span>
            })
          }
        </Space>
      </div>
    </div>
  );

  const logout = () => {
    removeToken()
    window.location.replace(window.YISACONF.logout_url)
  }

  // url判断
  const testUrl = (url: string) => {
    return /^https?:/.test(url)
  }

  // 渲染模块路由
  const renderModuleItem = (item: { children: ItemMenu[], text: string }, classname = "",) => {
    let nodes = item?.children && item?.children.length ? item.children : []
    return (
      <div className={"module-item " + classname}>
        <div className="module-title">
          <div className="line"></div>
          <img src={headerLeft} alt="" />
          {item?.text ? item.text : "-- "}
        </div>
        <div className="module-con">
          <Loading spinning={moduleLoading}>
            {
              moduleLoading ? "" :
                nodes.length ?
                  item.children.map((elem, index) => {

                    return (
                      !elem.path ?
                        <div className="link-item" key={index}>
                          <div className="link-icon">
                            <Icon type={elem.icon} />
                          </div>
                          <div className="link-text">{elem.text}</div>
                        </div>
                        :
                        testUrl(elem.path) ?
                          <a className="link-item" key={index} href={elem.path || ""} target="_blank">
                            <div className="link-icon">
                              <Icon type={elem.icon} />
                            </div>
                            <div className="link-text">{elem.text}</div>
                          </a>
                          :
                          <Link className="link-item" key={index} to={elem.path || ""} target="_blank">
                            <div className="link-icon">
                              <Icon type={elem.icon} />
                            </div>
                            <div className="link-text">{elem.text}</div>
                          </Link>
                    )
                  })
                  :
                  <div className="no-data">
                    <img alt="" src={skin === "dark" ? noDataDark : noDataLight} />
                    <p>暂无数据</p>
                  </div>
            }
          </Loading>
        </div>
      </div>
    )
  }

  useEffect(() => {
    document.getElementsByTagName('html')[0].style.fontSize = 'calc(100vw/19.2)'
    return () => {
      document.getElementsByTagName('html')[0].style.fontSize = '14px'
    }
  }, [])


  return <div className="home-page">
    <div className="plat-header" >
      <div className="right-tools">
        <a title="线索库" href={window.YISACONF.shelvesUrl} target="_blank">
          <Icon type="zancunjia" />
        </a>
        <a title="IAM" href={window.YISACONF.iam_url} target="_blank">
          <Icon type="iam" />
        </a>
        <a href={window.YISACONF.pdm_host + '/pdm'} target='_blank' title='运维管理'>
          <Icon type='houtai' />
        </a>

        <Popover overlayClassName='user-info' content={contentUser} placement="bottom">
          <span><Icon type='yonghu' /></span>
        </Popover>

        <span onClick={logout} title='退出' className='log-out'>
          <Icon type='tuichu' />
        </span>
      </div>
    </div>
    <div className="home-page-content">
      <div className='lefte'>
        {renderModuleItem((menuData.filter(item => item?.text == '神眼搜车')[0]) as { children: ItemMenu[], text: string }, 'long')}
        {renderModuleItem((menuData.filter(item => item?.text == '车辆研判')[0]) as { children: ItemMenu[], text: string }, 'long')}
      </div>

      {renderModuleItem((menuData.filter(item => item?.text == '布控稽查')[0]) as { children: ItemMenu[], text: string }, 'short')}
    </div>
  </div >
}


export default Home
