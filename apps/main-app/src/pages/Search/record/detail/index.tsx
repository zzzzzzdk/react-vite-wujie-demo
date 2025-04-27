import './index.scss'
import { Image, Modal, Button, Input, Message, Loading, Radio } from '@yisa/webui'
import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { Icon } from '@yisa/webui/es/Icon'
import {
  BaseInfo,
  Behavior,
  Portrait,
  RelateAnalysis,
  RelationPerson,
  Trace,
  RelationGraph,
  RelateInfo,
  OptionLog,
  RecordNav
} from './components'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'
import services from "@/services";
import LabelOperation from '../../record/VehicleDetails/components/LabelOperation'
import { useSelector } from 'react-redux'
import { RootState } from "@/store";
import { PersonInfoData, LabelData, NumDataType, PortraitClusterCountType } from './interface'
import dictionary from '@/config/character.config'

const RecordDetail = () => {
  const prefixCls = 'record-detail'
  const navigate = useNavigate()
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-detail-person'] || {}
  });

  // 已实名已聚类实名详情列表
  const realInfoTab = [
    { value: 'baseInfo', label: '基本信息' },
    // { value: 'relation', label: '关系人' },

    { value: 'behavior', label: '行为画像' },
    // { value: 'analysis', label: '关系分析' },
    { value: 'portrait', label: '抓拍图像' },
    { value: 'trace', label: '行为轨迹' },
    // { value: 'graph', label: '关系图谱' },
  ]
  // 已实名未聚类实名详情列表
  const realNoCluterInfoTab = [
    { value: 'baseInfo', label: '基本信息' },
    // { value: 'relation', label: '关系人' },
    // { value: 'analysis', label: '关系分析' },
    // { value: 'portrait', label: '抓拍图像' },
    { value: 'trace', label: '行为轨迹' },
    // { value: 'graph', label: '关系图谱' },
  ]
  // 未实名已聚类详情列表
  const unrealInfoTab = [
    // { value: 'baseInfo', label: '基本信息' },
    { value: 'relateInfo', label: '关联人员' },
    // { value: 'relation', label: '关系人' },
    // { value: 'analysis', label: '关系分析' },

    { value: 'behavior', label: '行为画像' },
    { value: 'portrait', label: '抓拍图像' },
    { value: 'trace', label: '行为轨迹' },
    // { value: 'graph', label: '关系图谱' },
  ]

  const logTab = { value: 'optionLog', label: '操作日志' }
  // 操作日志权限
  const [isAuthLog, setIsAUthLog] = useState(false)
  const location = useLocation()
  // url携带数据
  const [personData, setPersonData] = useState(JSON.parse(decodeURIComponent(location.search?.split('?')[1])))
  // console.log(JSON.parse(decodeURIComponent(location.search?.split('?')[1])), 'location');
  // 导航显示数量数据
  const [numData, setNumData] = useState<NumDataType>({
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
  //抓拍图像统计数字
  const [portraitClusterCount, setPortraitClusterCount] = useState<PortraitClusterCountType>({
    face: 0,
    pedestrian: 0,
    gait: 0,
    vehicle: 0,
    bicycle: 0,
    tricycle: 0,
  })
  // 获取groupId和groupPlateId
  const getResultData = () => {
    services.record.getArchivesResultData<any, any>({
      searchType: '1',
      idNumber: personData.idNumber || '',
      idType: personData.idType || '111',
      groupId: personData.groupId || [],
      groupPlateId: personData.groupPlateId || [],
      action: 'get'
    })
      .then(res => {
        if (res.data) {
          if (res.data.person && res.data.person.length) {
            setPersonData(Object.assign({}, personData, {
              groupId: res.data.person[0].groupId,
              groupPlateId: res.data.person[0].groupPlateId,
              photoUrl: res.data.person[0].photoUrl || personInfoData.photoUrl,
            }))
            //当前页面用户信息展示
            let newPersonInfoData = Object.assign({}, personInfoData, {
              idNumber: res.data.person[0].idNumber || personInfoData.idNumber,
              idType: res.data.person[0].idType || personInfoData.idType,
              name: res.data.person[0].name || personInfoData.name,
              labels: res.data.person[0].labels || personInfoData.labels,
              labelIds: res.data.person[0].labelIds || personInfoData.labelIds,
              photoUrl: res.data.person[0].photoUrl || personInfoData.photoUrl,
            })
            setPersonInfoData(newPersonInfoData)
            personInfoDataRef.current = newPersonInfoData

            // 获取是否有查看改详情权限-未实名均有权限
            getDetailAuth(res.data.person[0].name || personInfoData.name)
          } else {
            setDetailAuth(true)
          }
        }
      })
      .catch(err => {
      })
  }

  // 查询基本信息是否是编辑状态
  const editStatus = useSelector<RootState, boolean>(
    (state) => state.editStatus.status
  );

  // 是否有查看详情权限
  const [detailAuth, setDetailAuth] = useState<boolean>(false)
  const getDetailAuth = (name: string) => {
    if (!personData.idNumber) return
    services.record.getDetailAuth<any, boolean>({ ...personData })
      .then(res => {
        setDetailAuth(res.data || false)
        if (!res.data) {
          navigate(`/auth-approve?${encodeURIComponent(JSON.stringify({ ...personData, queryInfo: `${name}-${personData.idNumber}` }))}`)
        }
      })
  }
  // 基本信息数据
  const [personInfoData, setPersonInfoData] = useState<PersonInfoData>({
    name: '未知',
    idNumber: '',
    idType: '111',
    labels: [],
    labelIds: [],
    photoUrl: ''
  })

  // 跳转到抓拍图像携带数据
  const [searchData, setSearchData] = useState({})

  // 右侧信息展示tab key
  const [activeTabKey, setActiveTabKey] = useState(personData.idNumber ? 'baseInfo' : 'relateInfo')
  //左侧nav栏
  const [activeSubNavKey, setActiveSubNavKey] = useState(personData.idNumber ? "personInfo" : "relateInfo");

  const handleChangeTabKey = (key: string, data?: any) => {
    if (editStatus) {
      Message.warning('请对编辑信息进行保存！')
      return
    }
    // setActiveTabData()
    setActiveTabKey(key)
    console.log(key, dictionary.recordNav[key]?.children?.[0]?.name)
    setActiveSubNavKey(dictionary.recordNav[key]?.children?.[0]?.name)

    // 处理跳转到抓拍图像携带的数据
    setSearchData(data ? data : {})
  }

  const handleTargetTypeChange = (activeNavKey: string) => {
    setActiveSubNavKey(activeNavKey)
  }

  const contentData = {
    'baseInfo': <BaseInfo isReal={personData.idNumber ? true : false} data={personData} handleChangeTabKey={handleChangeTabKey} handleChangePerson={(data: PersonInfoData) => setPersonInfoData(data)} personInfoData={personInfoData} />,
    'behavior': <Behavior data={personData} handleChangeTabKey={handleChangeTabKey} />,
    'relateInfo': <RelateInfo data={personData} />,
    "analysis": <RelateAnalysis data={personData} />,
    'portrait': <Portrait
      data={personData}
      searchData={searchData}
      portraitClusterCount={portraitClusterCount}
      activeTargetType={activeSubNavKey}
      onTargetTypeChange={handleTargetTypeChange}

    />,
    'trace': <Trace data={personData} />,
    "relation": <RelationPerson data={personData} />,
    'graph': <RelationGraph data={personData} />,
    'optionLog': <OptionLog data={personData} />,
  }
  // 右侧信息展示数据
  const activeTabData = contentData[activeTabKey]
  const [ajaxLoading, setAjaxLoading] = useState(false)
  // 缓存初始人员数据
  const personInfoDataRef = useRef<PersonInfoData>({
    name: '',
    idNumber: '',
    idType: '111',
    labels: [],
    labelIds: [],
    photoUrl: ''
  })

  // 获取基本信息
  const getPersonInfoData = () => {
    setAjaxLoading(true)
    services.record.getDetailBaseInfo<{ idNumber?: string, groupId?: string }, PersonInfoData[]>(personData)
      .then(res => {
        setAjaxLoading(false)
        if (res.data && res.data.length) {
          setPersonInfoData(res.data[0])
          personInfoDataRef.current = res.data[0]
          // 获取是否有查看改详情权限-未实名均有权限
          getDetailAuth(res.data[0]?.name)
        } else {
          setDetailAuth(true)
        }
      })
      .catch(err => {
        setAjaxLoading(false)
        setDetailAuth(true)
        setPersonInfoData(personInfoDataRef.current)
      })
  }

  // 编辑基本信息
  const changeDetailBaseInfo = () => {

    setAjaxLoading(true)
    setIsEdit(false)

    // 删除标签集合
    // let deleteLabels: string[] = []
    // personInfoDataRef.current.labelIds.map(ele => {
    //   if (!personInfoData.labelIds.includes(ele)) {
    //     deleteLabels.push(ele)
    //   }
    // })
    // TODO:保存信息
    // services.record.changeDetailBaseInfo<{ updateData: { deleteLabels: string[], isLabelUpdate: number, action: string } & PersonInfoData }, PersonInfoData[]>({
    //   updateData: {
    //     ...personInfoData,
    //     deleteLabels,
    //     isLabelUpdate: deleteLabels.length || personInfoDataRef.current.labelIds.length !== personInfoData.labelIds.length ? 1 : 0,
    //     action: 'update'
    //   }
    // })
    services.record.changePersonLabel<any, { name: string, labels: string[], photoUrl?: string }>({
      idNumber: personInfoData.idNumber,
      idType: personInfoData.idType,
      groupId: personData.groupId,
      groupPlateId: personData.groupPlateId,
      labelsId: personInfoData.labelIds,
      name: personInfoData.name,
      oldName: personInfoDataRef.current.name,
      imgUrl: personInfoData.photoUrl
    })
      .then(res => {
        setAjaxLoading(false)
        Message.success('编辑成功')
        // getPersonInfoData()
        if (res.data) {
          let newPersonInfoData = Object.assign({}, personInfoData, {
            name: res.data?.name || personInfoData.name,
            labels: res.data?.labels || personInfoData.labels,
            photoUrl: res.data?.photoUrl || personInfoData.photoUrl,
          })
          setPersonInfoData(newPersonInfoData)
          personInfoDataRef.current = newPersonInfoData
        }
      })
      .catch(err => {
        setAjaxLoading(false)
        setPersonInfoData(personInfoDataRef.current)
        console.log(err);
      })
  }

  // 人员标签
  const [labelData, setLabelData] = useState<LabelData[]>([])
  useEffect(() => {
    // 跳转到详情 聚类id 也许获取不到 需要重新获取
    getResultData()
    // 获取用户是否处于黑名单中-未实名
    if (!personData.idNumber) {
      getPersonIsBlack()
      setDetailAuth(true)
    } else {
      // 获取基本信息
      // getPersonInfoData()
    }
    //获取标签
    services.record.getPersonLabel<{ labelTypeId: "vehicle" | "personnel" }, LabelData[]>({ labelTypeId: "personnel" })
      .then(res => {
        // console.log(res);
        if (res.data) {
          setLabelData(res.data)
        }
      })
    // 获取用户是否有操作日志权限
    services.record.getAdminAuth<any, boolean>()
      .then(res => {
        if (res.data) {
          setIsAUthLog(res.data)
        }
      })
  }, [])

  // 是否编辑基本信息
  const [isEdit, setIsEdit] = useState<boolean>(false)
  // 保存编辑人员信息
  const handleSave = () => {
    changeDetailBaseInfo()
  }

  const handleCancel = () => {
    setIsEdit(false)
    setPersonInfoData(personInfoDataRef.current)
  }

  const handleEdit = () => {
    setIsEdit(true)
  }

  // 修改姓名
  const handleChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonInfoData(Object.assign({}, personInfoData, {
      name: e.target.value
    }))
  }, [personInfoData])

  // 修改标签
  const handleChangeSelect = useCallback((v: SelectCommonProps['value'], option: any) => {
    setPersonInfoData(Object.assign({}, personInfoData, {
      labelIds: v
    }))
  }, [personInfoData])

  const filterTreeNode = useCallback((inputText: string, node: any) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  }, [])

  // 判断该用户是否是黑名单
  const getPersonIsBlack = () => {
    services.record.getPersonIsBlack<{ groupId: string[], groupPlateId: string[] }, { ids: string }>({ groupId: personData.groupId || [], groupPlateId: personData.groupPlateId || [] })
      .then(res => {
        if (res.data && res.data.ids) {
          setBlackId(res.data?.ids)
          setIsBlack(true)
          window.sessionStorage.setItem('isBlack', res.data?.ids || '')
        }
      })
  }

  // 加入黑名单的id
  const [blackId, setBlackId] = useState('')
  // 加入黑名单弹窗
  const [blackVisible, setBlackVisible] = useState<boolean>(false)
  // 是否已经加入黑名单
  const [isBlack, setIsBlack] = useState<boolean>(false)
  //加入黑名单 -未实名已聚类
  const handleAddBlackList = useCallback(() => {
    setBlackVisible(false)
    if (!isBlack) {
      services.record.addBlackLists<{ groupId: string[], groupPlateId: string[] }, { ids: string }>({ groupId: personData.groupId || [], groupPlateId: personData.groupPlateId || [] })
        .then(res => {
          console.log(res);
          if (res.data) setBlackId(res.data?.ids)
          window.sessionStorage.setItem('isBlack', res.data?.ids || '')
          Message.success(res.message || '')
          setIsBlack(!isBlack)
        })
    } else {
      services.record.delBlackLists<{ ids: string }, any>({ ids: blackId })
        .then(res => {
          console.log(res);
          window.sessionStorage.setItem('isBlack', '')
          Message.success(res.message || '')
          setIsBlack(!isBlack)
        })
    }
  }, [isBlack, personData, blackId])

  const handleActiveRecordNavKey = (parentkey: string, childkey: string) => {
    if (editStatus) {
      Message.warning('请对编辑信息进行保存！')
      return
    }
    cancelScroll.current = true;
    setActiveTabKey(parentkey)
    console.log(childkey)
    setActiveSubNavKey(childkey)
    // document.querySelector(`#${childkey}`)?.scrollIntoView({
    //   behavior: "smooth",
    //   block: "nearest",
    // });
    if (!document.querySelector(`.record-detail-baseinfo #${childkey}`)) return
    const targetOffsetTop = (document.querySelector(`.record-detail-baseinfo #${childkey}`) as HTMLDivElement)?.offsetTop
    // 获取当前 offsetTop
    let scrollTop = activeTabDataRef.current?.scrollTop || 0;
    // 定义一次跳 50 个像素，数字越大跳得越快，但是会有掉帧得感觉，步子迈大了会扯到蛋
    const STEP = 50;
    // 判断是往下滑还是往上滑
    if (scrollTop > targetOffsetTop) {
      // 往上滑
      smoothUp();
    } else {
      // 往下滑
      smoothDown();
    }
    // 定义往下滑函数
    function smoothDown() {
      // 如果当前 scrollTop 小于 targetOffsetTop 说明视口还没滑到指定位置
      if (scrollTop < targetOffsetTop) {
        // 如果和目标相差距离大于等于 STEP 就跳 STEP
        // 否则直接跳到目标点，目标是为了防止跳过了。
        if (targetOffsetTop - scrollTop >= STEP) {
          scrollTop += STEP;
        } else {
          scrollTop = targetOffsetTop;
        }
        activeTabDataRef.current!.scrollTop = scrollTop;
        // 关于 requestAnimationFrame 可以自己查一下，在这种场景下，相比 setInterval 性价比更高
        requestAnimationFrame(smoothDown);
      }
    }
    // 定义往上滑函数
    function smoothUp() {
      if (scrollTop > targetOffsetTop) {
        if (scrollTop - targetOffsetTop >= STEP) {
          scrollTop -= STEP;
        } else {
          scrollTop = targetOffsetTop;
        }
        activeTabDataRef.current!.scrollTop = scrollTop;
        requestAnimationFrame(smoothUp);
      }
    }
    setTimeout(() => {
      cancelScroll.current = false;
    }, Math.abs(scrollTop - targetOffsetTop) / STEP * 17)
  }
  //tab栏渲染的结果
  const radioGroup = useMemo(() => {
    let result = []
    if (personData.groupPlateId?.length || personData.groupId?.length) {
      if (personData.idNumber) {
        result = isAuthLog ? [...realInfoTab, logTab] : realInfoTab
      } else {
        result = isAuthLog ? [...unrealInfoTab, logTab] : unrealInfoTab
      }
    } else {
      result = isAuthLog ? [...realNoCluterInfoTab, logTab] : realNoCluterInfoTab;
    }
    return result
  }, [isAuthLog, personData])
  //接口请求
  useEffect(() => {
    // 基本信息数字
    services.record.getBasicNum(personData)
      .then(res => {
        if (res.data) setNumData(res.data as NumDataType)
      })
    // 抓拍图像数字
    services.record.getPortraitClusterCount(personData)
      .then(res => {
        if (res.data) setPortraitClusterCount(res.data as PortraitClusterCountType)
      })
  }, [])

  const activeTabDataRef = useRef<HTMLDivElement>(null);
  const cancelScroll = useRef(false);
  //滚动监听
  useEffect(() => {
    if (!detailAuth) return
    const onScroll = () => {
      if (cancelScroll.current || !document.querySelector(".record-detail-baseinfo")) return;
      const offsetTopArr = Array.from(document.querySelectorAll<HTMLDivElement>(".record-detail-baseinfo .item")).filter(item => item.children.length).map(item => ({ id: item.id, offsetTop: item.offsetTop }))
      const scrollTop = activeTabDataRef.current?.scrollTop || 0;
      // 定义当前点亮的导航下标
      let navId = "";
      for (let n = 0; n < offsetTopArr.length; n++) {
        // 如果 scrollTop 大于等于第n个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
        // 那么此时导航索引就应该是n了
        // -100 是因为让上一个元素还没有完全消失就却切换到下一个tnav
        if (scrollTop >= offsetTopArr[n].offsetTop - 100) {
          navId = offsetTopArr[n].id;
        }
      }
      // if (scrollTop >= offsetTopArr[offsetTopArr.length - 2].offsetTop && scrollTop + (activeTabDataRef.current?.clientHeight || 0) - offsetTopArr[offsetTopArr.length - 1].offsetTop <= 1) {
      //   setActiveSubNavKey(offsetTopArr[offsetTopArr.length - 1].id);
      // } else {
      setActiveSubNavKey(navId);
      // }
    };
    if (activeTabDataRef.current && activeTabKey === "baseInfo") {
      activeTabDataRef.current.addEventListener("scroll", onScroll);
    }
    return () => {
      activeTabDataRef.current?.removeEventListener("scroll", onScroll);
    };
  }, [activeTabKey, detailAuth]);
  //滚动适当次数，判断用户想往下滚，切换tab
  const wheelCount = useRef(0)
  const portraitCount = useRef(0)
  const DEFAULTCOUNT = 4
  const DEFAULTPORTRAITCOUNT = 2
  useEffect(() => {
    if (!detailAuth || activeTabKey === "optionLog") return
    wheelCount.current = 0
    portraitCount.current = 0
    const onWheel = (ev: any) => {
      if (activeTabDataRef.current) {
        if (activeTabDataRef.current.scrollHeight - activeTabDataRef.current.scrollTop - activeTabDataRef.current.offsetHeight <= 2) {
          wheelCount.current++
          portraitCount.current++
        }
      }
      //针对抓拍图像，只有滚动底部分页区域才翻页
      if ((activeTabKey === "portrait" || activeTabKey === "analysis") && portraitCount.current > DEFAULTPORTRAITCOUNT) {
        if (ev.target === activeTabDataRef.current?.querySelector(".record-detail-portrait-pagination")) {
          if (activeSubNavKey !== "gait") {
            const index = dictionary.targetTypes.findIndex(item => item.value === activeSubNavKey)
            const targetTypes = dictionary.hasGait ? dictionary.targetTypes.concat({ label: `步态`, value: "gait" }) : dictionary.targetTypes
            handleTargetTypeChange(targetTypes[(index < 0 ? 0 : index) + 1]?.value)
          } else {
            const tabIndex = radioGroup.findIndex(item => item.value === "portrait")
            handleChangeTabKey(radioGroup[(tabIndex < 0 ? 0 : tabIndex) + 1].value)
          }
        }
      } else if (wheelCount.current > DEFAULTCOUNT) {
        const index = radioGroup.findIndex(item => item.value === activeTabKey)
        handleChangeTabKey(radioGroup[(index < 0 ? 0 : index) + 1].value)
      }
    }
    // activeTabDataRef.current?.addEventListener("wheel", onWheel);
    return () => {
      // activeTabDataRef.current?.removeEventListener("wheel", onWheel);
    };
  }, [activeTabKey, detailAuth, activeSubNavKey]);


  return <div className={`${prefixCls}`}>
    {
      detailAuth ? <>
        <div className={`${prefixCls}-person-info`}>
          <div className="info-header">人员信息
            <div className="title-right">
              {
                isBlack ? '' :
                  personData.idNumber ?
                    isEdit
                      ? <>
                        <div className="btn save-btn" onClick={handleSave}>保存</div>
                        <div className="btn cancel-btn" onClick={handleCancel}>取消</div>
                      </>
                      : <div className="btn edit-btn" onClick={handleEdit}>编辑</div>
                    : ''
              }
            </div>
          </div>
          {
            ajaxLoading ? <div className="info-loading">
              <Loading spinning={true} />
            </div>
              :
              <>
                <div className="info-content">
                  <Image src={personInfoData.photoUrl} />
                  <div className="person-name">
                    {
                      personData.idNumber && isEdit ? <Input value={personInfoData.name} onChange={handleChangeInput} maxLength={25} showWordLimit />
                        : <span title={personInfoData.name}>{personInfoData.name}</span>
                    }
                  </div>
                  <div className="person-idcard">{personInfoData.idNumber}</div>
                  <ul className="person-label">
                    <LabelOperation
                      isEdit={isEdit}
                      tagNum={10}
                      labelData={labelData}
                      value={personInfoData.labelIds}
                      labels={personInfoData.labels}
                      handleChangeSelect={handleChangeSelect}
                    />
                  </ul>
                </div>
                <div className="info-nav">
                  <RecordNav
                    navData={radioGroup}
                    numData={numData}
                    PortraitClusterCount={portraitClusterCount}
                    activeKey={activeSubNavKey}
                    onChangeActiveKey={handleActiveRecordNavKey}
                  />
                </div>
              </>
          }
          {
            (!personData.idNumber && personData.groupId) && isAuthLog ?
              <div className="add-black-list">
                <Button type={`${!isBlack ? 'default' : 'danger'}`} onClick={() => setBlackVisible(true)}>{!isBlack ? '加入黑名单' : '移出黑名单'}</Button>
              </div>
              : null
          }
          {
            isBlack ? <div className="black-info">
              {/* <div>已加入黑名单</div> */}
            </div>
              : null
          }
        </div>
        <div className={`${prefixCls}-person-content`}>
          <Radio.Group
            buttonGap
            optionType="button"
            options={radioGroup}
            onChange={(e: any) => {
              handleChangeTabKey(e.target.value)
            }}
            className={`${prefixCls}-radio`}
            value={activeTabKey}
          />
          {/* <Tabs
            type='line'
            defaultActiveKey={activeTabKey}
            activeKey={activeTabKey}
            onChange={() => { }}
            className={`${prefixCls}-tab`}
            data={(personData.groupPlateId?.length || personData.groupId?.length)
              ? personData.idNumber
                ? isAuthLog ? [...realInfoTab, logTab] : realInfoTab
                : isAuthLog ? [...unrealInfoTab, logTab] : unrealInfoTab
              : isAuthLog ? [...realNoCluterInfoTab, logTab] : realNoCluterInfoTab
              // isAuthLog ? [...realInfoTab, logTab] : realInfoTab : isAuthLog ? [...unrealInfoTab, logTab] : unrealInfoTab
            }
          /> */}
          <div className="active-data" ref={activeTabDataRef}>
            {activeTabData}
          </div>
        </div>
      </>
        : <div className={`${prefixCls}-no-auth-content`}>
          <Loading spinning={true} />
        </div>
    }
    <Modal
      visible={blackVisible}
      title="黑名单"
      onCancel={() => { setBlackVisible(false) }}
      onOk={handleAddBlackList}
      className={`${prefixCls}-black-modal`}
    >
      <div className="relate-introduce">
        <span><Icon type="tishi" /></span> 请确认是否{`${isBlack ? '移出' : '加入'}`}黑名单?
      </div>
    </Modal>
  </div>
}

export default RecordDetail
