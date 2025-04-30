import React, { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Layout, WaterMark, Modal } from '@yisa/webui';
import { useDispatch, useSelector } from '@/store';
import { setSidebarWidth } from '@/store/slices/comment';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import Menu from './Menu';
import RightTools from './RightTools';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import './index.scss'
// import { RealtimeMessage } from '@/components'

import { useBlocker } from 'react-router-dom';
import { cancelAllRequests } from '@/utils/axios.config';

function Page() {

  const timer = useRef(0)

  const layout = useSelector((state) => {
    return state.comment.layout
  })

  const userInfo = useSelector((state) => {
    return state.user.userInfo
  });

  const dispatch = useDispatch()

  const [inlineCollapsed, setInlineCollapsed] = useState(false)

  const [width, setWidth] = useState('268px')

  const [hovering, setHovering] = useState(false)

  const nodeRef = useRef(null);

  const onCollapsed = (value) => {

    setInlineCollapsed(value)
  }

  const onHoverChange = (value) => {
    setHovering(value)
  }

  const resize = () => {
    let width = document.body.clientWidth
    if (width > 1440) {
      setWidth('268px')
    } else {
      setWidth('220px')
    }
  }

  const onMouseEnter = (event) => {
    // console.log(event)
    // const relatedTarget = event.relatedTarget
    // const menuElement = document.querySelector('.ysd-layout-vertical-top-left-menu')
    // console.log("menuElement.contains(relatedTarget) || menuElement === relatedTarget", menuElement.contains(relatedTarget) || menuElement === relatedTarget)
    // if (menuElement.contains(relatedTarget) || menuElement === relatedTarget) {
    //   return
    // }
    setHovering(true)
    // setInlineCollapsed(false)
  }

  const onMouseLeave = () => {
    if (!hovering) return;
    setHovering(false)
    // setInlineCollapsed(true)
  }

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      dispatch(setSidebarWidth())
    }, 300)
  }, [layout, inlineCollapsed, width])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => {
      clearTimeout(timer.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // 路由拦截，请求过程中给出提示
  const blocker = useBlocker(!!window.cancelTokens.length);
  useEffect(() => {
    if (blocker.state === "blocked") {
      Modal.confirm({
        title: '切换路由',
        content: "存在接口请求未完成，确认切换路由吗？",
        onOk: () => {
          cancelAllRequests()
          blocker.proceed?.();
        },
        onCancel: () => {
          blocker.reset?.();
        },
      });
    }
  }, [blocker])

  return <Layout
    type={layout}
    leftWidth={inlineCollapsed || layout === 'horizontal' ? width : '60px'}
    logo={
      <Link
        className='layout-brand'
        to='/home'
        title={YISACONF.sys_text}
        style={{ width: (hovering || inlineCollapsed || layout === 'horizontal') ? width : '60px' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <img alt='logo' className='logo' src='./static/images/gongan.png' />
        {
          layout === 'vertical' ?
            <SwitchTransition>
              <CSSTransition
                key={!inlineCollapsed && !hovering}
                nodeRef={nodeRef}
                addEndListener={(done) => {
                  nodeRef.current.addEventListener("transitionend", done, false);
                }}
                classNames="fade"
              >
                <div ref={nodeRef} className='sys-text'>
                  {
                    !inlineCollapsed && !hovering ?
                      "" :
                      <span>{YISACONF.sys_text}</span>
                  }
                </div>
              </CSSTransition>
            </SwitchTransition>
            :
            <div ref={nodeRef} className='sys-text'><span>{YISACONF.sys_text}</span></div>
        }
      </Link>}
    menu={(
      <Menu
        onCollapsed={onCollapsed}
        type={layout}
        collapsed={inlineCollapsed}
        hovering={hovering}
        onHoverChange={onHoverChange}
        width={width}
      />
    )}
    rightTools={<RightTools />}
    footer={<Footer />}
    breadcrumb={<Breadcrumb />}
  >
    <Outlet />
    <WaterMark content={[userInfo.name, userInfo.phone]} />
    {/* <RealtimeMessage /> */}
  </Layout>
}


export default Page
