import React, { useMemo, useState, useRef, useEffect, ReactNode } from 'react'
import { Button, Message, Select, Loading, Divider, Table, Space } from '@yisa/webui'
import { Icon, UndoOutlined } from '@yisa/webui/es/Icon'
import { ErrorImage, ResultBox } from '@yisa/webui_business'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { CityMassMarker, BoxDrawer, DoubleDrawer, BigImg, Track, Panel, Card, Export as ExportBtn, GlobalMeaasge } from '@/components'
import { PeerCard, DetailCard, TargetCard, ImgInfoCard, LeftSearchForm } from './components'
import { useLocation, useNavigate } from 'react-router'
import { LeafletEvent } from "leaflet"
import dayjs from 'dayjs'
import dictionary from '@/config/character.config'
import ajax, { ApiResponse } from '@/services'
import { getLogData } from '@/utils/log'
import { formatTimeComponentToForm, getMapProps, getParams, formatTimeFormToComponent } from '@/utils'
import { isEmptyObject, isObject } from '@/utils/is'
import omit from '@/utils/omit'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { validateFormData } from './validate'
import type { SelectCommonProps } from '@yisa/webui/es/Select/interface'
import type { DrawType } from '@/components/LocationMapList/interface'
import type { DataItemType } from '@/pages/Search/Cross/interface'
import type { PeerFormDataType, PeerResultType, DetailResultType } from './interface'
import type { ResultRowType } from '@/pages/Search/Target/interface'
import type { RefTrack } from '@/components/Map/Track/interface'
import type { ImgListDataType } from '@yisa/webui_business/es/ImgPreview'
import type { VehicleFormDataType, PersonFormDataType } from './components/LeftSearchForm/interface'
import type { RefImgUploadType } from '@/components/ImgUpload/interface'
import { TargetFeatureItem } from '@/config/CommonType'
import { ColumnProps } from '@yisa/webui/es/Table/interface'
import { isFunction, jumpRecordVehicle } from "@/utils";
import { useResetState } from "ahooks";
import './index.scss'

const defaultPageConfig = {}
/**
 *
 * @module Peer （车辆，人员）同行分析
 */
export default function Peer(props: { module: "vehicle" | "face" }) {
  //#region 数据
  const prefixCls = "vehicle-peer"
  const dynamicParams = props
  const location = useLocation()
  const navigate = useNavigate()
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig["face-peer"] || defaultPageConfig
  });
  const vehiclePageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig["vehicle-peer"] || defaultPageConfig
  });
  const isBatchPeer = getParams(location.search).type === "batch"
  const { scaleZoom, zoom } = window.YISACONF.map
  const [mapZoom, setMapZoom] = useState(zoom || 13)
  const { mapProps, tileLayerProps } = useMemo(() => {
    const { mapProps, tileLayerProps } = getMapProps('VehicleAnalisisMap')
    return {
      mapProps: {
        ...mapProps,
        onZoomStart: (e: LeafletEvent) => {
        },
        onZoomEnd: (e: LeafletEvent) => {
          const afterZoom = e.target.getZoom()
          if (afterZoom < scaleZoom) {
            setCityMassMarker({ showCityMarker: true, showMassMarker: false })
          } else {
            setCityMassMarker({ showCityMarker: false, showMassMarker: true })
          }
          setMapZoom(afterZoom)
        }
      },
      tileLayerProps
    }
  }, [])
  const [firstLoading, setFirstLoading] = useState(true)
  const [leftLoading, setLeftLoading] = useState(false)
  const [rightLoading, setRightLoading] = useState(false)
  const [targetLoading, setTargetLoading] = useState(false)
  const [tokenLoading, setTokenLoading] = useState(false)
  const [peerData, setPeerData] = useState<ApiResponse<PeerResultType>>({})
  const [detailData, setDetailData] = useState<ApiResponse<DetailResultType>>({})
  const [curPeerDataIndex, setCurPeerDataIndex] = useState(0)
  const [curPeerDataInfoId, setCurPeerDataInfoId] = useState<(ResultRowType & {
    elementId?: string;
  }) | null>(null)
  const [checkedList, setCheckedList] = useState<ResultRowType[]>([])
  const [curDetailDataIndex, setCurDetailDataIndex] = useState<number | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  const [doubleDrawerVisible, setDoubleDrawerVisible] = useState<[boolean, boolean]>([true, true])
  const [drawType, setDrawType] = useState<DrawType>("default")
  const [cityMassMarker, setCityMassMarker] = useState({
    showCityMarker: !isBatchPeer,
    showMassMarker: false,
  })
  const trackRef = useRef<RefTrack>(null)
  const defaultTrackParams: {
    data: DataItemType[],
    startTime: string,
    endTime: string
  } = {
    data: [],
    startTime: '',
    endTime: ''
  }
  const [trackParams, setTrackParams] = useState(defaultTrackParams)
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })

  const vehicleDefaultFormData: VehicleFormDataType = {
    timeType: 'time',
    beginDate: dayjs().subtract(Number(vehiclePageConfig?.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    brandId: '',
    modelId: [],
    yearId: [],
    licensePlate: '',
    plateColorTypeId: 5,
    noplate: '',
    objectTypeId: -1,
    vehicleTypeId: [-1],
    vehicleFuncId: [-1],
    excludeLicensePlate: {
      licensePlate: "",
      plateColorTypeId: 5
    },
    interval: vehiclePageConfig?.interval?.default || "", //跟车时长
    minCount: vehiclePageConfig?.minCount?.default || "",//同行点位
    peerSpot: vehiclePageConfig?.peerSpot?.default || "",//同行次数
    displaySort: dictionary.sortList[0].value,
    displayTimeSort: dictionary.captureSortList[0].value,
    peerPlate: "",//同行车牌
    cacheId: "", //缓存Id
  }
  const personDefaultFormData: PersonFormDataType = {
    clusterData: null,
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig?.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    interval: pageConfig?.interval?.default || "", //跟随间隔
    peerSpot: pageConfig?.peerSpot?.default || "",//同行次数
    displaySort: dictionary.sortList[0].value,
    displayTimeSort: dictionary.captureSortList[0].value,
    elementId: "",//同行人特征
    cacheId: "", //缓存Id
  }
  const imgUploadRef = useRef<RefImgUploadType>(null)
  //表单数据参数
  const [formData, setFormData, resetFormData] = useResetState<PeerFormDataType>(dynamicParams.module === "vehicle" ? vehicleDefaultFormData : personDefaultFormData)
  //重置表单数据
  const resetSliceFormData = {
    displaySort: dictionary.sortList[0].value,
    displayTimeSort: dictionary.captureSortList[0].value,
    peerPlate: "", //同行车牌
    elementId: "" //同行人特征，暂定
  }
  const searchFormDataRef = useRef({
    ...formData
  })
  const bigImgData = detailData.data?.map(item => [{ ...item.target, htmlIndex: item.index }, item.peer]).flat()
  const doubleDrawerTitles: [ReactNode, ReactNode] = dynamicParams.module === "vehicle" ? ["同行车辆信息", "查询车辆信息"] : ["同行人员信息", "查询人员信息"]
  const cardTitles: [ReactNode, ReactNode] = dynamicParams.module === "vehicle" ? ["同行车辆", "查询车辆"] : ["同行人", "查询人"]
  //#endregion

  //#region 事件处理
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }

  const handleSearchBtnClick = () => {
    if (!validateFormData(formData, dynamicParams.module || "vehicle", dynamicParams.module === "vehicle" ? vehiclePageConfig : pageConfig)) return
    const _ajaxFormData = { ...formData, ...resetSliceFormData }
    setFormData(_ajaxFormData)
    searchFormDataRef.current = _ajaxFormData
    setFirstLoading(false)
    setLeftDrawerVisible(false)
    setCurPeerDataIndex(0)
    setCurPeerDataInfoId(null)
    setCurDetailDataIndex(null)
    setCheckedList([])
    setTrackParams(defaultTrackParams)
    search(_ajaxFormData)
  }
  //格式化请求参数
  const formFormat = (form: PeerFormDataType) => {
    let newForm = { ...form }
    newForm['timeRange'] = formatTimeComponentToForm(newForm)
    // 点位和任务ids
    // newForm['locationIds'] = [...(form.locationIds || []), ...(form.locationGroupIds || [])]
    //排序
    if (form.displaySort) {
      const _sort = form.displaySort.split("-")
      newForm["sort"] = { field: _sort[0], order: _sort[1] }
    }
    if (form.displayTimeSort) {
      const _sort = form.displayTimeSort.split("-")
      newForm["timeSort"] = { field: _sort[0], order: _sort[1] }
    }
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "noplate", "displaySort", "displayTimeSort"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }
  const detailDataFormat = (timeSort: string, res: ApiResponse<DetailResultType>) => {
    if (res.data?.length) {
      //fix：由于轨迹开始时间和结束时间未对数据做经纬度过滤处理
      const _trackData = res.data.map(item => item.peer).filter(item => item?.lngLat?.lat && item?.lngLat?.lng)
      if (timeSort === "captureTime-desc") {
        setDetailData({
          ...res,
          data: res.data.map((item, index) => ({ ...item, index: (res.data?.length || 0) - index }))
        })
        if (_trackData.length) {
          setTrackParams({
            data: res.data
              .map((item, index) => ({ ...item.peer, index: (res.data?.length || 0) - index }))
              .reverse() as unknown as DataItemType[],
            startTime: _trackData[_trackData.length - 1]?.captureTime,
            endTime: _trackData[0]?.captureTime
          })
        }
      } else if (timeSort === "captureTime-asc") {
        setDetailData({
          ...res,
          data: res.data.map((item, index) => ({ ...item, index: index + 1 }))
        })
        // setCurDetailDataIndex(1)
        if (_trackData.length) {
          setTrackParams({
            data: res.data?.map((item, index) => ({ ...item.peer, index: index + 1 })) as unknown as DataItemType[],
            startTime: _trackData[0]?.captureTime,
            endTime: _trackData[_trackData.length - 1]?.captureTime
          })
        }
      } else {
        Message.warning("格式错误")
      }
    } else {
      setDetailData({})
      setTrackParams(defaultTrackParams)
    }
  }
  //ajax请求
  const search = async (newForm: PeerFormDataType, targetLoading: boolean = true, selfSort: boolean = false) => {
    const _newForm = formFormat(newForm)
    try {
      setTargetLoading(targetLoading)
      setLeftLoading(true)
      setRightLoading(true)
      setDoubleDrawerVisible([true, true])
      //人员同行分析自己排序
      if (peerData.data && selfSort) {
        const { cacheId, target, peers } = peerData.data
        setPeerData({ ...peerData, data: { cacheId, target, peers: peers.reverse() } })
        try {
          const res2 = await ajax.peer.getPeerDetail<PeerFormDataType, DetailResultType>({
            ..._newForm,
            elementId: peers[0].elementId
          }, dynamicParams.module)
          searchFormDataRef.current = {
            ...searchFormDataRef.current,
            elementId: peers[0].elementId
          }
          const _timeSort = searchFormDataRef.current.displayTimeSort
          detailDataFormat(_timeSort || "", res2)
          setTargetLoading(false)
          setLeftLoading(false)
          setRightLoading(false)
        } catch (error) {
        }
        return
      }
      const res = await ajax.peer.getPeerList<PeerFormDataType, PeerResultType>(
        omit(_newForm, ["peerPlate", "timeSort", "cacheId", "elementId"]),
        dynamicParams.module,
        (loading: boolean) => loading ? GlobalMeaasge.showLoading() : GlobalMeaasge.hideLoading()
      )
      if (res.data?.peers?.length) {
        const activeItem = res.data?.peers.sort((a, b) => Number(b.peerSpot || 0) - Number(a.peerSpot || 0))[0]
        setCurPeerDataInfoId(activeItem)
        const { cacheId, exportCacheId = "" } = res.data
        const { licensePlate2, elementId } = activeItem
        const res2 = await ajax.peer.getPeerDetail<PeerFormDataType, DetailResultType>({
          ..._newForm,
          cacheId,
          peerPlate: licensePlate2,//车辆
          elementId   //人员
        }, dynamicParams.module)
        searchFormDataRef.current = {
          ...searchFormDataRef.current,
          cacheId,
          exportCacheId,
          peerPlate: licensePlate2,
          elementId
        }
        const _timeSort = searchFormDataRef.current.displayTimeSort
        detailDataFormat(_timeSort || "", res2)
      } else {
        setDetailData({})
        setTrackParams(defaultTrackParams)
      }
      setPeerData(res)
      setTargetLoading(false)
      setLeftLoading(false)
      setRightLoading(false)
    } catch (error) {
      setPeerData({})
      setDetailData({})
      setTrackParams(defaultTrackParams)
      setTargetLoading(false)
      setLeftLoading(false)
      setRightLoading(false)
    }
  }
  //左侧详情页的请求（单独）
  const searchDetails = async (newForm: PeerFormDataType) => {
    const _newForm = formFormat(newForm)
    try {
      setLeftLoading(true)
      const res = await ajax.peer.getPeerDetail<PeerFormDataType, DetailResultType>(_newForm, dynamicParams.module)
      const _timeSort = newForm.displayTimeSort
      detailDataFormat(_timeSort || "", res)
      setLeftLoading(false)
    } catch (error) {
      setLeftLoading(false)
    }
  }

  const handleDrawerChange = () => {
    const visible = doubleDrawerVisible.every(Boolean), hidden = doubleDrawerVisible.every(item => item === false), leftVisible = doubleDrawerVisible[0] && !visible[1]
    if (visible) {
      setDoubleDrawerVisible([false, true])
    } else if (hidden) {
      setDoubleDrawerVisible([true, true])
    } else if (!leftVisible) {
      setDoubleDrawerVisible([false, false])
    }
  }
  const handleChangeCaptureSort = (v: SelectCommonProps["value"], type: "detail" | "peer") => {
    switch (type) {
      case "peer":
        setFormData({ ...formData, ...resetSliceFormData, displaySort: v as string })
        searchFormDataRef.current = { ...searchFormDataRef.current, ...resetSliceFormData, displaySort: v as string }
        setCurPeerDataIndex(0)
        setCurDetailDataIndex(null)
        setCheckedList([])
        setTrackParams(defaultTrackParams)
        search(searchFormDataRef.current, false, dynamicParams.module === "face")
        break;
      case "detail":
        setFormData({ ...formData, displayTimeSort: v as string })
        searchFormDataRef.current = { ...searchFormDataRef.current, displayTimeSort: v as string }
        searchDetails(searchFormDataRef.current)
        break;
      default:
        Message.warning(`未知的type${type}`)
        break;
    }
  }
  //右侧卡片点击
  const handlePeerCardClick = (index: number, item: ResultRowType & { elementId?: string }) => {
    if (curPeerDataIndex === index) return
    setCurPeerDataIndex(index)
    setCurPeerDataInfoId(item)
    setCurDetailDataIndex(null)
    setTrackParams(defaultTrackParams)
    const { licensePlate2, elementId } = item
    const sliceForm = {
      ...resetSliceFormData,
      displaySort: formData.displaySort,
      peerPlate: licensePlate2, //车辆
      elementId //人员
    }
    setFormData({ ...formData, ...sliceForm })
    searchFormDataRef.current = { ...searchFormDataRef.current, ...sliceForm }
    searchDetails(searchFormDataRef.current)
  }
  const handleDetailCardClick = (cardData: { target: ResultRowType, peer: ResultRowType }, index?: number) => {
    setCurDetailDataIndex(index || 0)
  }
  const handleDetailImgClick = ({ cardData, index, type }:
    {
      cardData: { target: ResultRowType, peer: ResultRowType },
      index?: number,
      type?: "target" | "peer"
    }) => {
    // setCurDetailDataIndex(index || 0)
    let bigImgCurrentIndex = type === "target" ? (index || 0) * 2 : (index || 0) * 2 + 1
    //目标卡片被点击
    // if (type === "target") {
    // setCurBigImgData(detailData.data?.map(item => item.target) || [])
    // } else if (type === "peer") {
    // setCurBigImgData(detailData.data?.map(item => item.peer) || [])
    // }

    setBigImgModal({
      visible: true,
      currentIndex: bigImgCurrentIndex
    })

  }
  const handleChangeChecked = ({ cardData, checked }: { cardData: any, checked: boolean }) => {
    const isExist = checkedList.filter(item => item.infoId === cardData.infoId).length
    let newCheckedData = []
    if (isExist) {
      newCheckedData = checkedList.filter(item => item.infoId !== cardData.infoId)
    } else {
      newCheckedData = checkedList.concat([cardData])
    }
    setCheckedList(newCheckedData)
  }
  const handleSelectedChange = (index: number | null) => {
    setCurDetailDataIndex(index)
  }

  const handleTrackCardClick = (index: number) => {
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }

  const handleChangeForm = (form: VehicleFormDataType) => {
    setFormData({ ...formData, ...form })
  }

  const handleChangePersonForm = (form: PersonFormDataType) => {
    console.log(form)
    setFormData({ ...formData, ...form })
  }
  const getFormatTokenParams = (token: string, type: "vehicle" | "face" = "vehicle") => {
    getLogData({ token }).then(res => {
      const { data } = res as any
      if (data && isObject(data)) {
        try {
          if (data.timeRange) {
            formatTimeFormToComponent(data.timeRange, data)
          }
          setFormData({ ...(type === "vehicle" ? vehicleDefaultFormData : personDefaultFormData), ...data })
        } catch (error) {
          Message.error(`数据解析失败`)
        }
      }
    })
  }
  //跳转参数
  const handleParamsData = () => {
    const searchData = getParams(location.search)
    let params: any = {}
    if (dynamicParams.module === "face") {
      if (searchData.bigImage) {
        imgUploadRef.current?.handleAutoUpload?.({ bigImage: searchData.bigImage })
      } else if (searchData.token) {
        getFormatTokenParams(searchData.token, dynamicParams.module)
      } else if (searchData.featureList) {
        const featureList: TargetFeatureItem[] = JSON.parse(decodeURIComponent(searchData.featureList))
        imgUploadRef.current?.handleSearchCluster?.(featureList)
      }
    } else if (dynamicParams.module === "vehicle") {
      if (searchData.token) {
        getFormatTokenParams(searchData.token, dynamicParams.module)
      } else {
        searchData?.plateColorTypeId && (params.plateColorTypeId = Number(searchData?.plateColorTypeId))
        searchData?.licensePlate && (params.licensePlate = searchData?.licensePlate)
        // searchData?.brandId && (params.brandId = searchData?.brandId)
        // searchData?.modelId && (params.modelId = searchData?.modelId?.split(","))
        // searchData?.yearId && (params.yearId = searchData?.yearId?.split(","))
        // searchData?.vehicleTypeId && (params.vehicleTypeId = searchData?.vehicleTypeId.split(",").map(item => Number(item)))
        setFormData({ ...formData, ...params })
      }
    }
  }

  const handleReset =() => {
    resetFormData()
  }

  //#endregion

  //#region 函数结构
  const leftSearchForm = () => {
    return (
      <div className="left-search">
        {dynamicParams.module === "vehicle" && <LeftSearchForm
          formData={formData as VehicleFormDataType}
          onChange={handleChangeForm}
        />}
        {dynamicParams.module === "face" && <LeftSearchForm.Person
          ref={imgUploadRef}
          showJump={isBatchPeer}
          jumpLoading={tokenLoading}
          formData={formData as PersonFormDataType}
          onChange={handleChangePersonForm}
        />}
        <div className="left-search-btn">
          <Space size={10}>
            <Button
              disabled={leftLoading || rightLoading}
              onClick={handleReset}
              type='default'
              className="reset-btn"
              icon={<UndoOutlined />}
            >重置</Button>
            <Button loading={leftLoading || rightLoading} onClick={() => { handleSearchBtnClick() }} type='primary'>查询</Button>

          </Space>
        </div>
      </div>
    )
  }

  const leftContent = () => {
    return (<div className="left-content">
      {
        dynamicParams.module === "face" && <div className="person-card">
          {
            leftLoading ?
              <Loading spinning={true} tip={dictionary.loadingTip} />
              :
              !isEmptyObject(peerData.data?.peers?.[curPeerDataIndex] || {}) &&
              <>
                <PeerCard
                  type="personDetail"
                  showChecked={false}
                  locationCanClick={false}
                  cardData={peerData.data?.peers?.[curPeerDataIndex] || {} as ResultRowType}
                  onImgClick={() => {
                    const { personBasicInfo: { idcard = "", idType = "", groupId = "", groupPlateId = '' } = {}, feature = '' } = peerData.data?.peers?.[curPeerDataIndex] || {}
                    window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
                      idNumber: idcard === '未知' ? '' : idcard,
                      groupId: groupId ? groupId : [],
                      groupPlateId: groupPlateId ? groupPlateId : [],
                      idType: idType || '111',
                      feature: feature || ''
                    }))}`)
                  }}
                />
                <Divider />
              </>
          }
        </div>
      }
      <div className="common-record left">
        <span>共<em>{detailData.totalRecords || 0}</em>条轨迹信息</span>
        {/* <ExportBtn
          total={detailData.totalRecords || 0}
          url={dynamicParams.module === "vehicle" ? `/v1/judgement/accomplices/vehicle/detail/export` : '/v1/judgement/accomplices/face/detail/export'}
          formData={{
            ...formFormat(searchFormDataRef.current),
            pageNo: 1,
            pageSize: detailData.totalRecords || 0
          }}
        /> */}
        <Select
          disabled={leftLoading || !detailData.data?.length}
          options={dictionary.captureSortList}
          value={formData.displayTimeSort}
          onChange={(v) => { handleChangeCaptureSort(v, "detail") }}
        />
      </div>
      <div className="common-list">
        <ResultBox
          loading={leftLoading}
          nodata={!detailData?.data?.length}
        >
          {
            detailData?.data?.map((item, index) => (<div className="common-list-item" key={item.target.infoId}>
              <DetailCard
                showImgZooms={[true, true]}
                cardData={item}
                onCardClick={(data) => { handleDetailCardClick(data, item.index) }}
                onImgClick={(data) => { handleDetailImgClick({ ...data, index }) }}
                active={curDetailDataIndex === item.index}
                signs={[cardTitles[1], cardTitles[0]]}
              />
            </div>))
          }
        </ResultBox>
      </div>
    </div>)
  }

  const columns: ColumnProps<ResultRowType>[] = [
    {
      title: "车牌号",
      dataIndex: "licensePlate2",
      render: (text, record) => {
        return (
          record.licensePlate2 == '未识别' ?
            <span className={`plate2-text plate-bg plate-color-8`}></span> :
            // (
            <a target="_blank" href={jumpRecordVehicle(record.licensePlate2, record?.plateColorTypeId2)} className={`plate2-text plate-bg plate-color-${record.plateColorTypeId2}`}>
              {record.licensePlate2}
            </a>
        )
      }
    },
    {
      title: "同行次数",
      dataIndex: "peerSpot",
      sorter: (a, b) => Number(a.peerSpot || 0) - Number(b.peerSpot || 0),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "descend",
    },
    {
      title: "点位数",
      dataIndex: "minCount",
      sorter: (a, b) => Number(a.minCount || 0) - Number(b.minCount || 0),
      sortDirections: ["ascend", "descend", "ascend"],
      // defaultSortOrder: "ascend",
    },
  ]

  const rightContent = () => {
    return (<div className="right-content">
      <div className="target-content">
        {
          targetLoading ?
            <Loading spinning={true} tip={dictionary.loadingTip} />
            :
            dynamicParams.module === "vehicle"
              ?
              <TargetCard cardData={peerData.data?.target} />
              :
              <PeerCard
                type="personTarget"
                cardData={peerData.data?.target || {} as ResultRowType}
                showChecked={false}
                locationCanClick={false}
                onImgClick={() => {
                  const { personBasicInfo: { idcard = "", idType = "", groupId = "", groupPlateId = '' } = {}, feature = '' } = peerData.data?.target || {}
                  window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
                    idNumber: idcard === '未知' ? '' : idcard,
                    groupId: groupId ? groupId : [],
                    groupPlateId: groupPlateId ? groupPlateId : [],
                    idType: idType || '111',
                    feature: feature || ''
                  }))}`)
                }}
              />
        }
        <Divider />
      </div>
      <div className="common-record">
        <span>共<em>{peerData.totalRecords || 0}</em>条{dynamicParams.module === "vehicle" ? "轨迹" : "同行"}信息</span>
        <ExportBtn
          disable={!peerData.totalRecords}
          hasAll={false}
          total={peerData.totalRecords || 0}
          url={dynamicParams.module === "vehicle" ? `/v1/judgement/accomplices/vehicle/export` : '/v1/judgement/accomplices/face/export'}
          formData={{
            ...omit(formFormat(searchFormDataRef.current), ["elementId", "cacheId", "exportCacheId"]),
            detailCacheId: searchFormDataRef.current.cacheId,
            listCacheId: searchFormDataRef.current.exportCacheId,
            pageNo: 1,
            pageSize: peerData.totalRecords || 0
          }}
        />
        {
          dynamicParams.module === "face" &&
          <Select
            disabled={leftLoading || rightLoading || !peerData.data?.peers?.length}
            options={dictionary.sortList.slice(0, 2)}
            value={formData.displaySort}
            onChange={(v) => { handleChangeCaptureSort(v, "peer") }}
          />

        }
      </div>
      <div className="common-list">
        <ResultBox
          loading={rightLoading}
          nodata={!peerData?.data?.peers?.length}
        >
          {
            dynamicParams.module === "vehicle" ?
              <Table
                columns={columns}
                data={peerData?.data?.peers || []}
                virtualized
                // scroll={{x: 378, y: 372}}
                onRow={(record, index) => {
                  return {
                    onClick(event) {
                      handlePeerCardClick(index, record);
                    },
                  };
                }}
                rowClassName={(record, index) => record.infoId === curPeerDataInfoId?.infoId ? 'active' : ''}
              />
              :
              peerData?.data?.peers?.map((item, index) => (<div className="common-list-item" key={item.infoId}>
                <PeerCard
                  // checkedList={checkedList}
                  showChecked={false}
                  type={dynamicParams.module === "vehicle" ? "vehicle" : "person"}
                  checked={checkedList.findIndex(it => it.infoId === item.infoId) > -1}
                  onChange={handleChangeChecked}
                  cardData={item}
                  active={index === curPeerDataIndex}
                  showImgZoom={true}
                  onCardClick={() => { handlePeerCardClick(index, item) }}
                  locationCanClick={false}
                />
              </div>))
          }
        </ResultBox>
      </div>
    </div>)
  }

  const trackContentCb = (elem: ResultRowType) => {
    return (
      <div className="track-popver-content">
        <div className="track-popver-content-card">
          <div className="card-img">
            <ErrorImage src={elem.targetImage} />
          </div>
          <div className="card-info"><Icon type="shijian" />{elem.captureTime}</div>
          <div className="card-info" title={elem.locationName}><Icon type="didian" />{elem.locationName}</div>
        </div>
      </div>
    )
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
      {
        dynamicParams.module === "vehicle" && <>
          <Panel title="查询车辆信息">
            <ImgInfoCard data={targetData} />
          </Panel>
          <Panel title="同行车辆信息">
            <ImgInfoCard data={peerData} />
          </Panel>
        </>
      }
      {
        dynamicParams.module === "face" && <Panel title="人员信息">
          <div className="person-card-wrapper">
            <Card.Normal
              cardData={targetData}
              hasfooter={false}
              showChecked={false}
              cardTitle={cardTitles[1]}
              peerFlag={true}
            />
            <Card.Normal
              cardData={peerData}
              hasfooter={false}
              showChecked={false}
              cardTitle={cardTitles[0]}
              peerFlag={true}
            />
          </div>
        </Panel>
      }
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
              onTrackCardClick={(data) => { handleTrackCardClick(index) }}
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
  //#endregion
  useEffect(() => {
    if (dynamicParams.module === "face") {
      const searchData = getParams(location.search)
      if (searchData.type === "batch" && searchData.id) {
        setTokenLoading(true)
        ajax.getTokenParams<{ token: string }, { peerData: ResultRowType[] }>({
          token: searchData.id
        }).then(res => {
          setTokenLoading(false)
          if (res.data) {
            try {
              const _data: any[] = res.data?.peerData?.map((item) => ({
                ...item,
                personBasicInfo: {
                  name: "未知",
                  age: "未知",
                  idcard: "未知"
                }
              }))
              setFormData({ ...formData, clusterData: _data })
            } catch (error) {
              Message.error(`数据解析失败`)
            }
          }
        }).catch(err => {
          navigate(location.pathname, { replace: true })
          setTokenLoading(false)
          Message.warning(err.message)
        })
      } else {
        setFormData({ ...personDefaultFormData })
        setFirstLoading(true)
        setLeftDrawerVisible(true)
        setTrackParams(defaultTrackParams)
        setMapZoom(scaleZoom)
        setCityMassMarker({
          showCityMarker: true,
          showMassMarker: false
        })
      }
    }
  }, [location.search])
  //处理参数跳转
  useEffect(() => {
    handleParamsData()
  }, [])


  return (
    <div className={`${prefixCls} page-content`}>
      <div className={`${prefixCls}-content`} ref={boxRef}>
        <BaseMap {...mapProps}>
          <TileLayer {...tileLayerProps} />
          <CityMassMarker
            showCityMassMarker={firstLoading}
            showCityMarker={cityMassMarker.showCityMarker}
            showMassMarker={cityMassMarker.showMassMarker}
            mapZoom={mapZoom}
            drawType={drawType}
            onChangeDrawType={setDrawType}
            locationIds={formData.locationIds}
            onChangeLocationIds={(ids: string[]) => { setFormData({ ...formData, locationIds: ids }) }}
          />
          <Track
            ref={trackRef}
            {...trackParams}
            position={{ x: 60, y: 0 }}
            contentCb={trackContentCb}
            clickIndex={curDetailDataIndex}
            markerClickCb={handleSelectedChange}
          />
        </BaseMap>
        <BoxDrawer
          title={<><div>同行分析</div></>}
          placement="left"
          onOpen={() => setLeftDrawerVisible(true)}
          onClose={() => setLeftDrawerVisible(false)}
          visible={leftDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        // width={434}
        >
          {leftSearchForm()}
        </BoxDrawer>
        {
          !firstLoading && <DoubleDrawer
            placement="right"
            titles={doubleDrawerTitles}
            widths={[378, 388]}
            visibles={doubleDrawerVisible}
            contents={[leftContent(), rightContent()]}
            onChange={handleDrawerChange}
            getContainer={() => document.querySelector(`.${prefixCls}-content`) || document.body}
          >
          </DoubleDrawer>
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
  )
}