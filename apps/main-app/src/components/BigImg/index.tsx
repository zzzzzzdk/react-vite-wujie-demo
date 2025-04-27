import { useEffect, useMemo, useRef, useState } from 'react'
import { ImgPreview } from '@yisa/webui_business'
import { Modal, Space, Tooltip, Loading, Link } from '@yisa/webui'
import { Icon, LeftOutlined, RightOutlined, CloseOutlined } from '@yisa/webui/es/Icon'
import BigImgProps, { QuickLinkItemType, TargetPointType, PointType } from './interface'
import { RefImgPreviewType } from '@yisa/webui_business/es/ImgPreview'
import ImgInfo from './ImgInfo'
import { ResultRowType } from "@/pages/Search/Target/interface"
import ajax from "@/services"
import classNames from 'classnames'
import { FeatureInfo } from '@yisa/webui_business/es/ImgPreview'
import { BigImgContext } from "./context";
import { isEmptyObject, isFunction } from '@/utils/is'
import { ErrorSubmitModal, JoinClue, XgPlayer, ImgCropper } from '@/components'
import { RefXgPlayerType } from '@/components/XgPlayer/index'
import services from '@/services'
import { TargetType } from '@/config/CommonType'
import { logReport } from "@/utils/log";
import './index.scss'
import { useLocation } from 'react-router'
import { isObject } from '@/utils'

const { List } = ImgPreview



const BigImg = (props: BigImgProps) => {
  const {
    wrapClassName,
    data = [],
    onIndexChange,
    connectDataTarget,
    currentIndex = 0,
    modalProps = { visible: false },
    showRightInfo = true,
    disabledAssociateTarget = false,
    imgInfoRender,
    listRender,
    listItemRender,
    showInfoMap,
    showtab = true,
    isShowVideo = false,
    onConnectItemClick,
    showConnect,
    mapId,
    matchesDesc,
    resultDesc
  } = props

  //加入线索库
  const [showClue, setShowClue] = useState(false)
  const [clueList, setClueList] = useState<ResultRowType[]>([])
  const location = useLocation();
  const previewRef = useRef<RefImgPreviewType>(null)
  const [defaultCurrentIndex, setDefaultCurrentIndex] = useState(currentIndex)
  const [disabled, setDisabled] = useState({
    zoomInDisabled: true,
    zoomOutDisabled: true,
    resetDisabled: true,
    adaptDisabled: true
  })

  const [imgLoading, setImgLoading] = useState(false)

  // 关联目标相关
  // 关联目标
  const [connectData, setConnectData] = useState<ResultRowType[]>([])
  const [movePath, setMovePath] = useState<PointType[]>([])
  const [targetPoint, setTargetPoint] = useState<TargetPointType[]>([])
  const [showInnerConnect, setshowInnerConnect] = useState(false) // 显示关联目标数据
  const [showCData, setShowCData] = useState<ResultRowType>() // 当前大图展示区域人体

  const [prevData, setPrevData] = useState<ResultRowType>()
  const currentData = showInnerConnect ? showCData :
    Array.isArray(data) && data[defaultCurrentIndex] ? data[defaultCurrentIndex] : {}
  // 目标框, 在切换同画面分析时会变
  const [featureData, setFeatureData] = useState(currentData.detection ? [currentData.detection] : [])
  const [selectedFeatureData, setSelectedFeatureData] = useState<FeatureInfo[]>([])

  // 截图使用的所有目标框
  const [allFeatureData, setAllFeatureData] = useState<any[]>([])

  const [hideFeature, setHideFeature] = useState(false)

  // 录像回放
  const videoPlayer = useRef<RefXgPlayerType>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorData, setErrorData] = useState<ResultRowType>(null!)

  // 截图检索
  const [isIntercept, setIsIntercept] = useState(false)
  const isInterceptRef = useRef(isIntercept)
  isInterceptRef.current = isIntercept


  const tools = [
    {
      text: '放大',
      icon: 'fangda',
      disabled: disabled.zoomInDisabled || isIntercept,
      onClick: () => previewRef.current?.zoomIn()
    },
    {
      text: '缩小',
      icon: 'suoxiao',
      disabled: disabled.zoomOutDisabled || isIntercept,
      onClick: () => previewRef.current?.zoomOut()
    },
    {
      text: '原始尺寸',
      icon: 'yuanshichicun',
      disabled: disabled.resetDisabled || isIntercept,
      onClick: () => previewRef.current?.reset()
    },
    {
      text: '适应屏幕',
      icon: 'pingmufangda',
      disabled: disabled.adaptDisabled || isIntercept,
      onClick: () => previewRef.current?.adapt()
    },
    {
      text: hideFeature ? '显示选框' : '隐藏选框',
      icon: 'xuankuang',
      disabled: isIntercept,
      onClick: () => setHideFeature(!hideFeature)
    },
    {
      text: '下载图片',
      icon: 'xiazai',
      disabled: ('downloadUrl' in currentData && currentData.downloadUrl ? false : true) || isIntercept,
      onClick: () => handleDownLoad()
    },
    {
      text: '加入线索库',
      icon: 'zancunjia',
      // disabled: true,
      onClick: () => {
        setShowClue(true)
        setClueList([currentData])
        console.log(selectedFeatureData, "当前选中");
      },
      disabled: (location.pathname === "/cluebank" || location.pathname === '/deploy-detail' ? true : false) || isIntercept
    }
  ]


  // 快捷链接生成link
  const generateLink = (path: string, type: 'vehicle' | 'image' | 'gait' | 'featureList' = 'image') => {
    let featureData = {
      feature: currentData.feature,
      targetType: currentData.targetType,
      targetImage: currentData.targetImage,
      detection: currentData.detection,
      gaitFeature: currentData.gaitFeature,
      infoId: currentData.infoId,
      windowFeature: currentData.windowFeature || ""
    }
    let params = ``
    if (type === 'vehicle') {
      params = `licensePlate=${currentData.licensePlate2 || currentData.licensePlate1 || currentData.licensePlate}&plateColorTypeId=${currentData.plateColorTypeId2 || currentData.plateColorTypeId1 || currentData.plateColorTypeId}&brandId=${currentData.brandId}&modelId=${currentData.modelId}&yearId=${currentData.yearId}&vehicleTypeId=${currentData.vehicleTypeId}`
    } else if (type === 'gait') {
      params = `featureList=${encodeURIComponent(JSON.stringify([{ ...featureData, isGait: true }]))}&isGait=1`
    } else if (type === 'featureList') {
      params = `featureList=${encodeURIComponent(JSON.stringify([{
        feature: currentData.feature,
        targetType: currentData.targetType,
        targetImage: currentData.targetImage,
        detection: currentData.detection,
        gaitFeature: currentData.gaitFeature,
        infoId: currentData.infoId,
        windowFeature: currentData.windowFeature || "",
        bigImage: currentData.bigImage,
        licensePlate2: currentData.licensePlate2,
        plateColorTypeId2: currentData.plateColorTypeId2,
      }]))}`
    } else {
      params = `bigImage=${encodeURIComponent(currentData.bigImage)}`
    }

    return `#${path}?${params}`
  }

  // 快捷链接
  const quickLinks = useMemo(() => {
    let gaitQuickLinks: QuickLinkItemType[] = [
      // {
      //   text: '步态检索',
      //   link: generateLink('/image', 'gait'),
      //   icon: 'yitujiansuo'
      // },
    ]

    let deployQuickLink = [
      ...(currentData.targetType === 'face' ? [{
        text: '人脸布控',
        icon: 'yitubukong',
        link: generateLink('/deploy', 'featureList'),
      }] : []),
      ...(currentData.targetType === 'vehicle' ? [{
        text: '车辆布控',
        icon: 'anchexingbukong',
        link: generateLink('/deploy', 'vehicle')
      }] : [])
    ]

    let personQuickLinks: QuickLinkItemType[] = [
      {
        text: '轨迹重现',
        link: generateLink('/person-track'),
      },
      {
        text: '同行分析',
        link: generateLink('/face-peer'),
      },
      {
        text: '落脚点分析',
        link: generateLink('/foothold-person'),
      },
    ]

    let vechileQuickLinks: QuickLinkItemType[] = [
      {
        text: '轨迹重现',
        link: generateLink('/vehicle-track', 'vehicle'),
      },
      {
        text: '同行分析',
        link: generateLink('/vehicle-peer', 'vehicle'),
      },
      {
        text: '落脚点分析',
        link: generateLink('/foothold-vehicle', 'vehicle'),
      },
      // {
      //   text: '初次入城',
      //   link: generateLink('/initial', 'vehicle'),
      // },
      // {
      //   text: '昼伏夜出',
      //   link: generateLink('/active-night', 'vehicle'),
      // },
      // {
      //   text: '频繁过车',
      //   link: generateLink('/frepass', 'vehicle'),
      // },
      // {
      //   text: '多点碰撞',
      //   link: generateLink('/vehicle-multipoint', 'vehicle'),
      // },
    ]

    // 系统权限控制跳转链接
    if (window.YISACONF.systemControl) {
      const systemType = window.YISACONF.systemControl.type

      if (systemType === 'vehicle') {
        deployQuickLink = deployQuickLink.filter(item => item.text === '车辆布控')
        personQuickLinks = []
      }

      if (systemType !== 'fusion3') {
        gaitQuickLinks = []
      }
    }

    const links: QuickLinkItemType[] = [
      {
        text: '截图检索',
        link: 'isIntercept',
        icon: 'kuangxuanicon',
      },
      {
        text: '以图检索',
        link: generateLink('/image', 'featureList'),
        icon: 'yitujiansuo',
      },
      ...(currentData.targetType === 'face' || currentData.targetType === 'pedestrian' ? [{
        text: '身份落地',
        link: generateLink('/image', 'featureList'),
        icon: 'yitujiansuo'
      }] : []),
      ...(currentData.gaitFeature && currentData.targetType === 'pedestrian' ? gaitQuickLinks : []),
      ...deployQuickLink,
      ...(currentData.targetType === 'face' || currentData.targetType === 'vehicle' ? [{
        link: generateLink('/real-time-tracking', 'featureList'),
        text: "实时跨镜追踪",
        icon: 'kuajingzhuizong',
      }] : []),
      {
        text: showVideo ? "查看场景图" : '录像回放',
        link: 'videoPlay',
        icon: showVideo ? 'danganshangchuantupian' : 'shipinhuifang',
        // disabled: true
      },
      {
        text: '查看更多',
        icon: "chakangengduo",
        children: [
          ...(currentData.targetType === 'face' ? personQuickLinks : []),
          ...(currentData.targetType === 'vehicle' ? vechileQuickLinks : []),
          {
            text: '纠错',
            link: "errorCorrection",
          }
        ]
      }
    ]

    return links
  }, [currentData, showVideo])

  // 取消纠错
  const handleErrorModalCancel = () => {
    setErrorModalVisible(false)
  }
  // 提交纠错
  const errorSubmitPost = () => {
    setErrorModalVisible(false)
  }
  const handleDownLoad = () => {
    const { downloadUrl } = currentData
    if (downloadUrl) {
      let link = document.createElement('a')
      link.href = downloadUrl
      link.click()
    }
  }

  const handeChangeCurrent = (type: 'prev' | 'next') => {
    if (type === 'prev' && defaultCurrentIndex > 0) {
      onIndexChange && onIndexChange?.(defaultCurrentIndex - 1)
      setDefaultCurrentIndex(defaultCurrentIndex - 1)
    }
    if (type === 'next' && defaultCurrentIndex < data.length - 1) {
      onIndexChange && onIndexChange?.(defaultCurrentIndex + 1)
      setDefaultCurrentIndex(defaultCurrentIndex + 1)
    }
    handleCancelshowInnerConnect()
  }

  const handleListChange = (index: number) => {
    if (index >= 0 || index <= data.length) {
      onIndexChange && onIndexChange?.(index)
      setDefaultCurrentIndex(index)
    }
    handleCancelshowInnerConnect()
  }

  // 关联目标数据
  const loadConnectData = (params: ResultRowType, target?: ResultRowType) => {
    if (disabledAssociateTarget) return
    ajax.getConnectData<{}, ResultRowType[]>({
      infoId: target?.infoId || params?.infoId,
      targetType: target?.targetType || params?.targetType
    }).then(res => {
      // console.log(res)
      setMovePath(res.track || [])
      setTargetPoint(res.targetPoint || [])
      setConnectData(res.data || [])
      if (target && target.targetType === "face") {
        setShowCData(target)
        setshowInnerConnect(true)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const handleCancelshowInnerConnect = () => {
    if (showInnerConnect) {
      setshowInnerConnect(false)
    }
  }

  const handleConnectItemClick = (item: ResultRowType) => {
    if (isIntercept) {
      cancelIntercept()
    }
    loadConnectData(item)
    setShowCData(item)
    setFeatureData(item.detection ? [item.detection] : [])
    setshowInnerConnect(true)
    // onConnectItemClick?.(item)
    if (showVideo) {
      handleCloseVideo()
    }
  }

  // 对图片进行重新识别，获取所有特征位置
  const imgIdentify = (index: number) => {
    const curdata  = Array.isArray(data) && data[index] ? data[index] : {}
    ajax.uploadImg<any, ResultRowType[]>({
      imageUrl: curdata.bigImage,
      analysisType: 'full'
    }).then(res => {
      const { data = [], bigImage, dataGroup = [] } = res
      const result = data.map(item => (Object.assign({}, item, {
        bigImage: bigImage,
      })))
      // 合并特征值等字段
      setAllFeatureData(result.map(item => ({
        ...item,
        ...(item.detection || {}),
      })))
    }).catch(err => { })
  }

  useEffect(() => {
    setDefaultCurrentIndex(currentIndex)
    if (modalProps.visible) {
      setPrevData(currentData)

      imgIdentify(currentIndex)
    }

    if (isShowVideo && modalProps.visible) {
      handleVideoPlay()
      return
    }
    if (showVideo) {
      handleCloseVideo()
    }

    if (!modalProps.visible) {
      // 如果在截取状态，取消
      if (isIntercept) {
        cancelIntercept()
      }
    }
  }, [currentIndex, modalProps.visible])

  useEffect(() => {
    //fix: 修复布控明细-以图（多图）布控，查看时，特征框不变的问题，bugId:66591
    // if (!showRightInfo) {
    //   return
    // }
    if (isIntercept) {
      cancelIntercept()
    }
    const feartureItem = showInnerConnect ? showCData :
      Array.isArray(data) && data[currentIndex] ? data[currentIndex] : {}
    setFeatureData(feartureItem.detection ? [feartureItem.detection] : [])
    setSelectedFeatureData([])
    if (modalProps.visible) {
      loadConnectData(data[currentIndex], connectDataTarget)
    } else {
      handleCancelshowInnerConnect()
    }

  }, [modalProps.visible, currentIndex, connectDataTarget, showInnerConnect])

  const handleJump = (elem: QuickLinkItemType) => {
    logReport({
      type: elem.text === '步态检索' ? 'gait' : 'none',
      data: {
        desc: `图片【1】-【快捷操作：${elem.text}】`,
        data: currentData
      }
    })
    window.open(elem.link)
  }

  // 快捷链接渲染
  const renderQuickLinkItem = (item: QuickLinkItemType) => {
    const hasChild = item.children
    const linkIsHref = item.link && item.link.indexOf('/') > -1
    // const canClick=item.onClick&&isFunction(item.onClick)

    // const paramas = pick(currentData, ['bigImage', 'feature', 'targetImage', 'targetType'])
    // console.log(paramas)
    return (
      <div
        key={item.text}
        className={classNames(`quick-links-item`, {
          disabled: item.disabled
        })}
      >
        {
          hasChild ?
            <Tooltip
              placement="right"
              light={true}
              title={item.children?.map(item => renderQuickLinkItem(item))}
              overlayClassName="quick-links-tooltip"
            // getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
            >
              <div>
                {item.icon && <Icon type={item.icon} />}
                {item.text}
              </div>
            </Tooltip>
            :
            linkIsHref ?
              // <Link href={item.link as string} target="_blank">
              //   {item.icon && <Icon type={item.icon} />}
              //   {item.text}
              // </Link>
              <span className='ysd-link ysd-link-default' onClick={() => handleJump(item)}>
                {item.icon && <Icon type={item.icon} />}
                {item.text}
              </span>
              :
              <div
                className={`${item.link === 'errorCorrection' ? 'error-text' : ''}`}
                onClick={() => handleQuickLinksClick(item)}
              >
                {item.icon && <Icon type={item.icon} />}
                {item.text}
              </div>
        }
      </div>
    )
  }

  const handleQuickLinksClick = (item: QuickLinkItemType) => {
    if (item.link === 'videoPlay') {
      handleVideoPlay()
      logReport({
        type: 'none',
        data: {
          desc: `图片【1】-【快捷操作：${item.text}】`,
        }
      })
    }
    if (item.link === 'errorCorrection') {
      handleErrorCorrection()
    }
    if (item.link === 'isIntercept') {
      handleShowIntercept()
    }
  }

  const hanelSameScenceChange = (sameScencedata: ResultRowType[], reset?: boolean) => {
    setSelectedFeatureData([])
    if (reset) {
      const feartureItem = showInnerConnect ? showCData :
        Array.isArray(data) && data[defaultCurrentIndex] ? data[defaultCurrentIndex] : null
      console.log(feartureItem)
      setFeatureData(feartureItem && feartureItem.detection ? [feartureItem.detection] : [])
      return
    }
    // 合并特征值等字段
    setFeatureData(sameScencedata.map(item => ({
      ...item,
      ...(item.detection || {}),
    })))
  }

  // 切换录像回放状态
  const handleVideoPlay = () => {
    if (!isShowVideo && showVideo) {
      handleCloseVideo()
    } else {
      // 默认播放视频时 防止ImgPreview组件找不到容器报错
      setTimeout(() => {
        setShowVideo(true)
      }, 0)
      // 请求视频播放地址
      setVideoLoading(true)

      services.getVideo<{}, string>({
        infoId: currentData.infoId,
        targetType: currentData.targetType,
        locationId: currentData.locationId,
        captureTime: currentData.captureTime
      }).then(res => {
        console.log(res)
        setVideoLoading(false)
        if (res.data) {
          videoPlayer.current?.playVideo(res.data)
        } else {
          videoPlayer.current?.playVideo("error")
        }
      }).catch(err => {
        setVideoLoading(false)
        videoPlayer.current?.playVideo("error")
        console.log(err)
      })
    }
  }

  const handleCloseVideo = () => {
    videoPlayer.current?.destroyVideo()
    setShowVideo(false)
  }

  const handleErrorCorrection = () => {
    setErrorModalVisible(true)
    // setClueList([currentData])
    setErrorData(currentData)
  }

  const handleFeatureChange = (features: FeatureInfo[]) => {
    // console.log(features)
    setSelectedFeatureData(features)
  }

  const BigImgContextValue = {
    selectedFeatureData,
    handleFeatureChange
  }

  useEffect(() => {
    // 如果切换两张图片相同，不用设置loading状态
    const sameImage = prevData && isObject(prevData) && prevData.bigImage === currentData.bigImage

    if (!imgLoading && !sameImage && !isEmptyObject(prevData)) {
      setImgLoading(true)
    }
    setPrevData(currentData)
  }, [defaultCurrentIndex])

  // 右键事件
  const handleTextMenu = (e: any) => {
    // console.log('右键点击：' + e)
    e.preventDefault()
    e.stopPropagation()
    // 设置imgloading，重新请求
    if (!imgLoading && isIntercept) {
      setImgLoading(true)
    }
    cancelIntercept()

  }

  // 展示截取状态
  const handleShowIntercept = () => {
    setIsIntercept(true)
  }

  // 取消截取状态
  const cancelIntercept = () => {
    // formRadioButtonChange('all')
    setIsIntercept(false)
  }

  useEffect(() => {
    // ESC监听关闭截取状态
    function listenCancel(e: KeyboardEvent) {
      e.preventDefault()
      e.stopPropagation()
      if (e.keyCode == 27 && isInterceptRef.current) {
        cancelIntercept()
        // 设置imgloading，重新请求
        if (!imgLoading) {
          setImgLoading(true)
        }
      }
    }
    document.addEventListener('keyup', listenCancel)

    return () => {
      document.removeEventListener('keyup', listenCancel)
    }
  }, [])

  return (
    <>
      <BigImgContext.Provider
        value={BigImgContextValue}
      >
        <Modal
          title="查看大图"
          {...(modalProps || {})}
          className={classNames("big-img-modal", showRightInfo ? 'has-right-info' : '')}
          footer={null}
          wrapClassName={`big-img-modal-wrap ${wrapClassName}`}
          //Tabs组件非受控
          unmountOnExit
          escToExit={false}
        >
          <div className="big-img-left">
            <div className="big-img-left-content">
              {
                showVideo ?
                  <div className="video-con">
                    <Loading spinning={videoLoading}>
                      <XgPlayer ref={videoPlayer} />
                    </Loading>
                    <div className="close-btn" onClick={handleCloseVideo}>
                      {/* <Icon type="quxiao" /> */}
                      <CloseOutlined />
                    </div>
                  </div>
                  :
                  <div className='image-con'>
                    <Space className="big-img-tools" split={<span className="tools-split">|</span>}>
                      {
                        tools.map(tool => {
                          const { text, icon, disabled, onClick } = tool
                          return <div
                            className={disabled ? "big-img-tools-item big-img-tools-item-disabled" : "big-img-tools-item"}
                            key={icon}
                            {...disabled ? {} : {
                              onClick
                            }}
                          >
                            {text}
                            <Icon type={icon} />
                          </div>
                        })
                      }
                    </Space>
                    <div className="big-img-preview" onContextMenu={handleTextMenu}>
                      {
                        isIntercept ?
                          <>
                            <ImgCropper
                              pic={currentData.bigImage || ''}
                              applicationType="bigImg"
                              pageType='yitu'
                              picData={{
                                bigImage: currentData.bigImage || '',
                                data: [...allFeatureData]
                              }}
                              jumpArr={[
                                {
                                  text: "局部检索",
                                  url: "#/image?",
                                  mode: 'feature'
                                },
                              ]}
                            />
                          </>
                          :
                          <Loading spinning={imgLoading}>
                            <ImgPreview
                              ref={previewRef}
                              src={currentData.bigImage || ''}
                              featureData={hideFeature ? [] : featureData}
                              onChange={setDisabled}
                              btns={{
                                left: <div
                                  className={defaultCurrentIndex === 0 ? "btn-switch btn-switch-disabled" : "btn-switch"}
                                  onClick={() => handeChangeCurrent('prev')}
                                >
                                  <LeftOutlined />
                                </div>,
                                right: <div
                                  className={defaultCurrentIndex === data.length - 1 ? "btn-switch btn-switch-disabled" : "btn-switch"}
                                  onClick={() => handeChangeCurrent('next')}
                                >
                                  <RightOutlined />
                                </div>
                              }}
                              minScale={0.5}
                              mode="multiple"
                              selectedFeatureData={selectedFeatureData}
                              // onFeatureChange={handleFeatureChange}
                              onLoad={() => { setImgLoading(false) }}
                              onError={() => {
                                setImgLoading(false)
                                console.log("图片加载失败")
                              }}
                            />
                          </Loading>
                      }
                    </div>
                  </div>
              }
              <div className={classNames("quick-links", {
                "hide": showVideo || isIntercept
              })}>
                <Space split="|" size={24}>
                  {
                    quickLinks.map(item => renderQuickLinkItem(item))
                  }
                </Space>
              </div>
            </div>
            <div className="big-img-list">
              {
                listRender && isFunction(listRender) ? listRender()
                  : <List
                    data={data}
                    currentIndex={defaultCurrentIndex}
                    fieldNames={{
                      // key: 'infoId', // 内部采用默认的index作为key
                      src: 'targetImage'
                    }}
                    onChange={handleListChange}
                    itemRender={listItemRender}
                  />
              }
            </div>
          </div>
          {
            showRightInfo && modalProps.visible ?
              <div className="big-img-right">
                <ImgInfo
                  currentIndex={defaultCurrentIndex}
                  data={data}
                  showInfoMap={showInfoMap}
                  imgInfoRender={imgInfoRender}
                  onConnectItemClick={handleConnectItemClick}
                  connectData={connectData}
                  showConnect={showConnect}
                  showCData={showCData}
                  showtab={showtab}
                  onSameScenceChange={hanelSameScenceChange}
                  mapId={mapId || `mapAround-${currentData.infoId}-${currentData.feature}`}
                  matchesDesc={matchesDesc}
                  resultDesc={resultDesc}
                  movePath={movePath}
                  targetPoint={targetPoint}
                />
              </div>
              : ""
          }
        </Modal>
        <JoinClue
          visible={showClue}
          clueDetails={clueList}
          onOk={() => { setShowClue(false) }}
          onCancel={() => { setShowClue(false) }}
        />
        <ErrorSubmitModal
          carryData={errorData}
          modalVisible={errorModalVisible}
          onCancel={handleErrorModalCancel}
          onOk={errorSubmitPost}
        // zIndex={1020}
        />
      </BigImgContext.Provider>
    </>
  )
}

export default BigImg
