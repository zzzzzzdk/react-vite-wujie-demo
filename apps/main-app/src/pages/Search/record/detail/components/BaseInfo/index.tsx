
import './index.scss'
import {
  CarList,
  CaseList,
  PersonInfo,
  PersonPhotoList,
  TabelInfo,
  TabTableInfo,
  PeerCluster
} from './components'
import { Icon } from '@yisa/webui/es/Icon'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import services from "@/services";
import { useSelector, RootState } from '@/store';
import { Props } from '../../interface'
import dayjs from 'dayjs'
const BaseInfo = (props: Props) => {
  const {
    isReal,
    data,
    handleChangeTabKey,
    handleChangePerson,
    personInfoData
  } = props
  const prefixCls = 'record-detail-baseinfo'

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-detail-person'] || {}
  });
  const menuList = [
    {
      id: '1',
      name: 'personInfo',
      text: '基本信息',
      remarks: '',
      comp: <PersonInfo data={data} handleChangePerson={handleChangePerson} personInfoData={personInfoData} />,
      icon: 'jibenxinxi',
      activeIcon: 'xuanzhongjibenxinxi',
    },
    {
      id: '2',
      name: 'contactInfo',
      text: '联系方式',
      remarks: '',
      comp: <TabelInfo title="联系方式" data={data} personInfoData={personInfoData} getUrl="/v1/personArchives/phoneInfo" changeUrl="/v1/personArchives/updatePhone" />,
      icon: 'lianxifangshi',
      activeIcon: 'xuanzhonglianxifangshi',
    },
    {
      id: '3',
      name: 'addressInfo',
      text: '地址信息',
      remarks: '',
      comp: <TabelInfo type="address" title="地址信息" data={data} personInfoData={personInfoData} getUrl="/v1/personArchives/address" changeUrl="/v1/personArchives/updateAddress" />,
      icon: 'dizhixinxi',
      activeIcon: 'xuanzhongdizhixinxi',
    },
    {
      id: '4',
      name: 'photoInfo',
      text: '证件照',
      remarks: '',
      comp: <PersonPhotoList title="证件照" data={data} personInfoData={personInfoData} />,
      icon: 'zhengjianzhao',
      activeIcon: 'xuanzhongzhengjianzhao',
    },
    // {
    //   id: '13',
    //   name: 'peerCluster',
    //   text: '同行人脸',
    //   comp: <PeerCluster title="同行人脸聚类" data={data} hasEditBtn={false} />,
    //   icon: 'mingxiacheliang',
    //   activeIcon: 'xuanzhongmingxiacheliang',
    // },
    {
      id: '5',
      name: 'carInfo',
      text: '名下车辆',
      remarks: '',
      comp: <CarList title="名下车辆" data={data} type="under" showPagination={false} personInfoData={personInfoData} />,
      icon: 'mingxiacheliang',
      activeIcon: 'xuanzhongmingxiacheliang',
    },
    // {
    //   id: '6',
    //   name: 'driveInfo',
    //   text: '驾乘车辆',
    //   remarks: '',
    //   comp: <CarList title="驾乘车辆" hasEditBtn={false} type="transport" data={data} handleChangeTabKey={handleChangeTabKey} />,
    //   icon: 'jiachengcheliang',
    //   activeIcon: 'xuanzhongjiachengcheliang',
    // },
    {
      id: '7',
      name: 'illegalInfo',
      text: '违法车辆',
      remarks: '',
      // comp: <CarList title="处理交通违法车辆" hasEditBtn={false} data={data} type="illegal" />,
      comp: <TabelInfo type="illegalInfo" title="处理交通违法车辆" data={data} getUrl="/v1/personArchives/violation" hasEditBtn={false}/>,
      icon: 'weifacheliang',
      activeIcon: 'xuanzhongweifacheliang',
    },
    {
      id: '8',
      name: 'caseInfo',
      text: '案件/警情',
      remarks: '',
      comp: <CaseList hasEditBtn={false} title="案件/警情" data={data} />,
      icon: 'anjianjingqing',
      activeIcon: 'xuanzhonganjianjingqing',
    },
    // {
    //   id: '9',
    //   name: 'relationInfo',
    //   text: '关系人',
    //   remarks: '',
    //   comp: <TabTableInfo />
    // },
    {
      id: '10',
      name: 'travelInfo',
      text: '出行信息',
      remarks: '',
      comp: <TabTableInfo title="出行信息" hasEditBtn={false} data={data} />,
      icon: 'chuhangxinxi',
      activeIcon: 'xuanzhongchuhangxinxi',
    },
    {
      id: '11',
      name: 'hotelInfo',
      text: '宾馆住宿',
      remarks: '',
      comp: <TabelInfo hasEditBtn={false} title="宾馆住宿" type="hotel" data={data} getUrl="/v1/personArchives/hotel" />,
      icon: 'binguanzhusu',
      activeIcon: 'xuanzhongbinguanzhusu',
    },
    {
      id: '12',
      name: 'interInfo',
      text: '网吧记录',
      remarks: '',
      comp: <TabelInfo hasEditBtn={false} title="网吧上网记录" type="intel" data={data} getUrl="/v1/personArchives/internet" />,
      icon: 'wangbajilu',
      activeIcon: 'xuanzhongwangbajilu',
    },
  ]
  const unrealMenuList = [
    {
      id: '6',
      name: 'driveInfo',
      text: '驾乘车辆',
      remarks: '',
      comp: <CarList title="驾乘车辆" hasEditBtn={false} type="transport" data={data} />,
      icon: 'jiachengcheliang',
      activeIcon: 'xuanzhongjiachengcheliang',
    },
    // {
    //   id: '13',
    //   name: 'peerCluster',
    //   text: '同行人脸',
    //   comp: <PeerCluster title="同行人脸聚类" data={data} hasEditBtn={false} />,
    //   icon: 'mingxiacheliang',
    //   activeIcon: 'xuanzhongmingxiacheliang',
    // },
  ]
  // 当前导航
  const [activeMenuIndex, setActiveIndex] = useState(0)
  // 是否展开收起导航
  const [isExpend, setIsExpend] = useState(false)
  // 导航显示数量数据
  const [numData, setNumData]: any = useState({
    personInfo: 0,
    contactInfo: 0,
    addressInfo: 0,
    photoInfo: 0,
    // peerCluster: 0,
    carInfo: 0,
    // driveInfo: 0,
    illegalInfo: 0,
    caseInfo: 0,
    travelInfo: 0,
    hotelInfo: 0,
    interInfo: 0,
  })
  const menu = isReal ? menuList : unrealMenuList;
  const requestMenu = isReal ? ['personInfo', 'contactInfo', 'addressInfo', 'photoInfo', 'carInfo'] : []
  // useEffect(() => {
  //   let timeData = {
  //     beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  //     endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  //     peerBeginDate: dayjs().subtract(Number(pageConfig.peerTimeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  //     peerEndDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  //   }
  //   // 格式化参数
  //   services.record.getBasicNum({
  //     ...data,
  //     peerCount: pageConfig.peerSpot?.default || '1',
  //     peerTime: pageConfig.interval?.default || '30',
  //     peerCaptureTime: { times: [timeData.peerBeginDate, timeData.peerEndDate] },
  //     driverCaptureTime: { times: [timeData.beginDate, timeData.endDate] }
  //   })
  //     .then(res => {
  //       if (res.data) setNumData(res.data)
  //     })
  // }, [])
  return <div className={`${prefixCls}`}>
    {
      menu.map((item: any) => {
        return (
          <div className="item" id={`${item.name}`} key={item.id}>
            <Fragment>
              {item.comp ? item.comp : null}
            </Fragment>
          </div>)
      })
    }
    {/* <div className="anchor">
      {
        isExpend && menu.map((item: any, index: number) => {
          if (numData[item.name] || requestMenu.includes(item.name)) {
            return <div
              key={item.name}
              className={`anchor-item ${activeMenuIndex == index ? 'active-item' : ''}`}
              onClick={() => {
                setActiveIndex(index)
                document.getElementById(item.name)?.scrollIntoView({
                  behavior: 'auto',
                  block: 'nearest',
                  inline: 'center'
                })
              }}>
              <Icon type={activeMenuIndex == index ? item.activeIcon : item.icon} />
              <div>  {item.text}   </div>
              {
                numData[item.name] ?
                  <div className="logo-num">  {numData[item.name]} </div>
                  : null
              }
            </div>
          }
        })
      }
      <div
        className={`anchor-item menu-expend ${isExpend ? '' : 'menu-retract'}`}
        onClick={() => {
          setIsExpend(!isExpend)
        }}>
        <Icon type={isExpend ? 'shouqidaohang' : 'zhankaidaohang'} />
        {isExpend ? '收起' : '展开'}导航
      </div>
    </div> */}
  </div >
}
export default BaseInfo
