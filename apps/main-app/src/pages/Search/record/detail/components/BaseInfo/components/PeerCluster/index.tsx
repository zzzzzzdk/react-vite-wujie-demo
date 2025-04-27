
import Title from '../Title'
import { Card, BigImg } from '@/components'
import { Loading } from '@yisa/webui'
import { ErrorImage } from '@yisa/webui_business'
import React, { useState, useEffect, ReactNode } from 'react'
import services, { ApiResponse } from "@/services";
import { Icon, } from '@yisa/webui/es/Icon'
import { BaseInfoProps } from '../interface'
import type { ImgListDataType } from '@yisa/webui_business/es/ImgPreview'
import ImgInfoCard from '../../../../../../../VehicleAnalysis/Peer/components/ImgInfoCard'
import { Panel } from '@/components'
import { PeerResultType, DetailResultType, PeerFormDataType } from '../../../../../../../VehicleAnalysis/Peer/interface'
import { ResultRowType } from "@/pages/Search/Target/interface";
import { useSelector, RootState } from '@/store';
import dayjs from 'dayjs'
import './index.scss'
const PeerCluster = (props: BaseInfoProps) => {
  const {
    title = '基本信息',
    type = 'phone',
    hasEditBtn = true,
    data = { idNumber: '' }
  } = props

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-detail-person'] || {}
  });

  const prefixCls = 'baseinfo-peerCluter'

  //同行人数据
  const [peerData, setPeerData] = useState<ApiResponse<PeerResultType>>({})
  //同行人轨迹详情数据
  const [detailData, setDetailData] = useState<ApiResponse<DetailResultType>>({})

  // 获取同行人聚类
  const getPeerCluterLists = () => {
    let timeData = {
      beginDate: dayjs().subtract(Number(pageConfig.peerTimeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    setAjaxLoading(true)
    let formData: any = {
      "clusterData": [{
        feature: "",
        personBasicInfo: {
          name: "",
          sex: "",
          age: 0,
          nation: "",
          idcard: "",
          idType: "",
          groupId: "",
          idcardUrl: "",
        },
        personTags: [],
        targetImage: '',
        targetType: 'face',
        group: ''
      }],
      interval: pageConfig.interval?.default || '30',
      peerSpot: pageConfig.peerSpot?.default || '1',
      timeRange: { times: [timeData.beginDate, timeData.endDate] }
    }
    services.record.getPeerCluterLists<any, PeerResultType>({
      ...formData,
      idcard: data?.idNumber || ''
    })
      .then(res => {
        setAjaxLoading(false)
        setPeerData(res)

        // setResultData(res)
      })
  }
  const getDetailPeerData = (index: number, fuc: () => void) => {
    let formData: PeerFormDataType = {
      "clusterData": [],
      interval: '30',
      minCount: '1',
    }
    const cacheId = peerData.data?.cacheId
    const { licensePlate2, elementId } = peerData.data?.peers[index] || {}
    services.peer.getPeerDetail<any, DetailResultType>({
      ...formData,
      idcard: data?.idNumber || '',
      cacheId,
      peerPlate: licensePlate2,//车辆
      elementId   //人员
    }, 'face')
      .then(res => {
        setDetailData({
          ...res,
          data: res.data?.filter(item => item.target.lngLat.lat && item.target.lngLat.lng).map((item, index) => ({ ...item, index: (res.data?.length || 0) - index }))
        })
        fuc()
      })
  }
  useEffect(() => {
    getPeerCluterLists()
  }, [])

  const handlePeerClick = (data: ResultRowType, index: number) => {
    getDetailPeerData(index, () => {
      setBigImgModal({
        visible: true,
        currentIndex: 0
      })
    })
  }

  const [ajaxLoading, setAjaxLoading] = useState<boolean>(false)

  // 动态展示每行数据
  const [listCount, setListCount] = useState(7)
  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 208
      const width = (document.querySelector('.photo-lists')?.clientWidth || 0) - 126 // 126为总间距
      const count = Math.floor(width / itemWidth)
      if (count >= 7 || count <= 2) {
        setListCount(count < 0 ? 7 : count)
      } else {
        const diff = width - itemWidth * count + 18 * (count - 1)
        if (diff >= itemWidth * (count / (count + 1))) {
          setListCount(count + 1)
        } else {
          setListCount(count)
        }
      }
    }
    calcListCount()
    window.addEventListener('resize', calcListCount)

    return () => {
      window.removeEventListener('resize', calcListCount)
    }
  }, [])
  // 渲染证件照卡片
  const handleRenderCard = () => {
    const data = peerData.data?.peers || []
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          _template.push(
            <Card.Normal
              key={data[j].infoId}
              cardData={{
                targetImage: data[j].targetImage,
                personBasicInfo: data[j].personBasicInfo,
                peerNum: data[j].peerSpot,
              }}
              showChecked={false}
              onPeerClick={(e) => handlePeerClick(data[j], j)}
            />
          )
        } else {
          _template.push(<div className="card-item-flex" key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })
  //根据详情数据计算出大图数据
  const bigImgData = detailData.data?.map(item => [{ ...item.target, htmlIndex: item.index }, item.peer]).flat()
  const cardTitles: [ReactNode, ReactNode] = ["同行人", "查询人"]

  const handleTrackCardClick = (index: number) => {
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }
  const BigImgInfoRender = (data: ResultRowType, currentIndex: number) => {
    let targetData = {} as ResultRowType, peerData = {} as ResultRowType
    if (bigImgData && currentIndex % 2 === 1) {
      targetData = bigImgData[currentIndex - 1]
      peerData = data
    } else if (bigImgData && currentIndex % 2 === 0) {
      targetData = data
      peerData = bigImgData[currentIndex + 1]
    }
    return <div className="peer-img-right-info">
      <Panel title="人员信息">
        <div className="person-card-wrapper">
          <Card.Normal
            cardData={targetData}
            hasfooter={false}
            showChecked={false}
            cardTitle={cardTitles[1]}
          />
          <Card.Normal
            cardData={peerData}
            hasfooter={false}
            showChecked={false}
            cardTitle={cardTitles[0]}
          />
        </div>
      </Panel>
      <Panel title="轨迹列表" className="track-panel">
        <div className="track-container">
          {
            bigImgData?.map((item, index) => <ImgInfoCard
              key={item.infoId}
              type="trackInfo"
              data={item}
              trackIndex={item.htmlIndex}
              sign={index % 2 ? cardTitles[0] : cardTitles[1]}
              active={index === currentIndex}
              onTrackCardClick={() => { handleTrackCardClick(index) }}
            />)
          }
        </div>
      </Panel>
    </div>
  }

  const listItemRender = (data: ImgListDataType, index: number) => {
    const { targetImage } = data
    return <div className="peer-list-item-card">
      <span className="sign">{index % 2 ? cardTitles[0] : cardTitles[1]}</span>
      <ErrorImage
        src={targetImage}
      />
    </div>
  }

  //事件处理
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }
  if (!peerData.data?.peers?.length) {
    return null
  }
  return <div className={`${prefixCls}`}>
    <Title
      title={title}
      hasEditBtn={hasEditBtn}
    />
    <div className="peer-lists">
      {
        ajaxLoading
          ? <div className="ajax-loading">
            <Loading spinning={true} />
          </div>
          : (peerData.totalRecords)
            ? handleRenderCard()
            : <div className="result-nodata">
              <Icon type="zanwushujuqianse" />
              <div> 这里什么都没有......</div>
            </div>
      }
    </div>
    <BigImg
      modalProps={{
        visible: bigImgModal.visible,
        onCancel: handleCloseBigImg
      }}
      currentIndex={bigImgModal.currentIndex}
      onIndexChange={(index) => {
        setBigImgModal({
          visible: true,
          currentIndex: index
        })
      }}
      data={bigImgData || []}
      imgInfoRender={BigImgInfoRender}
      disabledAssociateTarget={true}
      listItemRender={listItemRender}
    />
  </div>
}
export default PeerCluster
