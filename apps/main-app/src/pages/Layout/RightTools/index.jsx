import React, { useState } from 'react'
import { useDispatch, useSelector } from '@/store';
import { removeToken } from '@/utils'
import character from "@/config/character.config"
import { setSkin, setLayout } from '@/store/slices/comment';
import { Message, Popover, Space } from "@yisa/webui";
import { CheckCircleFilled, Icon, QuestionCircleOutlined } from '@yisa/webui/es/Icon';
import ajax from '@/services'
import c from '../images/c.png'
import h from '../images/h.png'
import { Link } from 'react-router-dom';
import { ModalFeedBack } from '@/components'

import './index.scss'

const layoutData = [
  {
    layout: 'vertical',
    img: c,
    text: '侧导航',
  },
  {
    layout: 'horizontal',
    img: h,
    text: '顶导航'
  },
]

export default (pros) => {
  const [yijian, setYijian] = useState(false)
  const skin = useSelector((state) => {
    return state.comment.skin
  });

  const layout = useSelector((state) => {
    return state.comment.layout
  });

  const userInfo = useSelector((state) => {
    return state.user.userInfo
  });

  const dispatch = useDispatch();


  const layoutChange = (layout) => {
    dispatch(setLayout(layout))
    ajax.changeStyle({
      color: skin,
      layout: layout,
    }).catch(err => console.log(err))
  }

  const skinChange = (skin) => {
    dispatch(setSkin(skin))
    ajax.changeStyle({
      color: skin,
      layout: layout,
    }).catch(err => console.log(err))
  }

  const logout = () => {
    // ajax.logout().then((res) => {
    removeToken()
    window.location.replace(YISACONF.logout_url)
    // }).catch((err) => {
    //   Message.error(err.message)
    // });
  }



  const content = (
    <>
      <div className='title'>
        导航设置
      </div>

      <Space className='list' size={50}>
        {
          layoutData.map((item, index) => {
            return <div
              key={index}
              onClick={() => {
                layoutChange(item.layout)
              }}
              className={layout === item.layout ? 'active' : ''}>
              <img src={item.img} alt="" />
              <div>{item.text}</div>
              <CheckCircleFilled />
            </div>
          })
        }
      </Space>

      <div className='title'>
        主题设置
      </div>

      <Space className='list' size={50} wrap>
        {
          character.skinData.map((item, index) => {
            return <div
              key={index}
              onClick={() => {
                skinChange(item.skin)
              }}
              className={skin === item.skin ? 'active' : ''}>
              <img src={item.img} alt="" />
              <div>{item.text}</div>
              <CheckCircleFilled />
            </div>
          })
        }
      </Space>
    </>
  );

  const contentUser = (
    <div className='info'>
      <div className='username'>
        <span>用户ID：</span>
        <span className='name'>{userInfo.name}</span>
      </div>
      <div className='role'>
        <span className='label' >角色：</span>
        <Space className='role-list' size={6} wrap='wrap'>
          {
            userInfo.role && userInfo.role.length && userInfo.role.map((item, index) => {
              return <span key={index} className='role-name'>{item}</span>
            })
          }
        </Space>
      </div>
    </div>
  );

  return <div className="right-tools">
    {
      YISACONF && YISACONF.help_url ?
        <a className='help' href={YISACONF.help_url} target='_blank' title='帮助文档'>
          帮助文档
          <QuestionCircleOutlined />
        </a> :
        null
    }

    <Link to='/cluebank' title={'线索库'} ><Icon type='zancunjia' ></Icon></Link>
    <span onClick={() => setYijian(true)} title="意见反馈">
      <Icon type='yijianfankui'></Icon>
    </span>
    {
      process.env.NODE_ENV === "development" ?
        <Popover overlayClassName='pifu-setting' content={content} placement="bottom" overlayStyle={{ width: '350px' }}>
          <span id='pifu-setting' ><Icon type='huanfu' /></span>
        </Popover>
        :
        ""
    }

    {/* <span title='消息通知'>
      <Icon type='xiaoxi' />
    </span> */}

    {/* <span title='工作动态'>
      <Icon type='yijianfankui' />
    </span> */}

    <a href={YISACONF.iam_url} target='_blank' title='IAM'>
      <Icon type="iam" />
    </a>

    <a href={YISACONF.pdm_host + '/pdm'} target='_blank' title='运维管理'>
      <Icon type='houtai' />
    </a>

    <Popover overlayClassName='user-info' content={contentUser} placement="bottom">
      <span><Icon type='yonghu' /></span>
    </Popover>
    <span onClick={logout} title='退出' className="exit">
      <Icon type='tuichu' />
    </span>
    <ModalFeedBack visible={yijian} handleFeedBackCancel={() => {
      setYijian(false)
    }} uid={userInfo.id}></ModalFeedBack>
  </div>
}
