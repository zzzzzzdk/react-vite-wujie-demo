import React, { useMemo, useState, useRef, useEffect } from 'react'
// import ResizeObserver from 'resize-observer-polyfill'
import { Form, Input, Button, Message, Image, Cascader, Select, Divider, Space } from '@yisa/webui'
import { Icon, UndoOutlined } from '@yisa/webui/es/Icon'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { formatTimeComponentToForm, getMapProps, getParams, validatePlate, formatTimeFormToComponent, isObject } from '@/utils'
import { LeafletEvent, Marker } from "leaflet"
import { CityMassMarker, BoxDrawer, LocationMapList, TimeRangePicker, FormPlate, MoreFilter, FormVehicleModel, Card, DoubleDrawer, BigImg, Vector, Panel, MapAroundPoint, ImgUploadOrIdcard, Export as ExportBtn } from '@/components'
import { InfoCard, StayList } from './component'
import dayjs from 'dayjs'
import ajax, { ApiResponse } from '@/services'
import dictionary from '@/config/character.config'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { ChartDataArr, DataList, DetailList, DetailResultType, FootholdResultType, totalImg } from './interface'
import { ResultRowType } from '@/pages/Search/Target/interface'
import './index.scss'
import { ResultBox } from '@yisa/webui_business'
import StayTimeDistribute from './component/StayTimeDistribute'
import { VectorArr, VectorContentCbType } from '@/components/Vector/interface'
import ImgInfoCard from './component/ImgInfoCard'
import LeftSearchForm from './component/LeftSearchForm'
import { PersonFootholdFormDataType } from './component/LeftSearchForm/interface'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useLocation } from 'react-router'
import { RefImgUploadType } from '@/components/ImgUpload/interface'
import { isEmptyObject } from '@/utils/is'
import { getLogData, logReport } from '@/utils/log'
import { TargetFeatureItem } from '@/config/CommonType'
import { useResetState } from 'ahooks'

export default function Foothold() {

  const prefixCls = "person-foothold"
  // const { scaleZoom, zoom } = window.YISACONF.map
  //缩放比例
  // const [mapZoom, setMapZoom] = useState(zoom || 13)
  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    const { mapProps, tileLayerProps } = getMapProps('VehicleAnalisisMap')
    return {
      mapProps: {
        ...mapProps,
        onZoomStart: (e: LeafletEvent) => {
        },
        onZoomEnd: (e: LeafletEvent) => {
        }
      },
      tileLayerProps
    }
  }, [])

  const defaultPageConfig = {}
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig["foothold-person"] || defaultPageConfig
  });
  const location = useLocation()
  const [tokenLoading, setTokenLoading] = useState(false)
  // //检索栏容器
  // const searchBoxRef = useRef<HTMLDivElement>(null)
  const [chartpicdata, setChartPicData] = useState<ChartDataArr[]>([])
  const [firstLoading, setFirstLoading] = useState(true)
  const [leftLoading, setLeftLoading] = useState(false)
  const [rightLoading, setRightLoading] = useState(false)
  const [doubleDrawerVisible, setDoubleDrawerVisible] = useState<[boolean, boolean]>([true, true])

  const [ajaxLoading, setAjaxLoading] = useState(false)
  //当前右侧选中数据
  const [curFootholdDataIndex, setFootholdDataIndex] = useState(0)
  // 右侧选中 导出用
  // const [checkedList, setCheckedList] = useState<string[]>([])
  //当前左侧选中数据
  const [curDetailDataIndex, setCurDetailDataIndex] = useState(-1)
  //右侧数据
  const [footholdDataList, setFootholdDatalist] = useState<FootholdResultType[]>([])
  const [reqUuid, setReqUuid] = useState<string>("")
  const clusterDataRef = useRef<any>(null)
  //右侧数据缓存
  const footholdDataListRef = useRef<DataList>({
    down: [],
    up: []
  })
  //左侧数据缓存
  const detaildataRef = useRef<DetailList>({
    down: [],
    up: [],
    total: 0
  })
  //落脚点详情数据
  const [detailData, setDetailData] = useState<ApiResponse<DetailResultType[]>>([])
  //抽屉挂载节点
  const boxRef = useRef<HTMLDivElement>(null)
  //抽屉
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  //全部图片数据整合
  const [totalimg, setTotalimg] = useState<ResultRowType[]>([])
  // 大图数据缓存
  const totalimgRef = useRef<totalImg>({
    down: [],
    up: [],
  })

  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })
  const resetSliceFormData = {
    displaySort: dictionary.foothodsortList[0].value,//次数排序方式
    displayTimeSort: dictionary.staysortList[0].value//停留时段排序方式
  }

  const personDefaultFormData: PersonFootholdFormDataType = {
    //选择的是时间还是时段
    timeType: 'time',
    // 起止日期
    beginDate: dayjs().subtract(Number(pageConfig?.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    parkingHour: pageConfig?.footholdTime?.default || "", //落脚时长
    parkingCount: pageConfig?.footholdSpot?.default || "",//落脚次数
    displaySort: dictionary.foothodsortList[0].value,//次数排序方式,
    displayTimeSort: dictionary.staysortList[0].value,//停留时段排序方式,
    clusterData: null,
    group: ""
  }
  //表单数据参数
  const [formData, setFormData, resetFormData] = useResetState<PersonFootholdFormDataType>(personDefaultFormData)
  //把所有的参数保存一份，用于检索
  const searchFormDataRef = useRef({
    ...formData
  })
  const imgUploadRef = useRef<RefImgUploadType>(null)
  //弹窗
  const vectorContentCb = (elem: VectorContentCbType) => {
    return (
      <div className="track-popver-content">
        <div className="track-popver-content-card">
          <div className="card-img" onClick={() => { handleDetailImgClick(elem.infoId) }}>
            <Image src={elem.targetImage} />
          </div>
          <div className="card-info"><Icon type="shijian" />{elem.captureTime}</div>
          <div className="card-info" title={elem.text}><Icon type="didian" />{elem.text}</div>
        </div>
      </div>
    )
  }
  //地图上
  const [vectorArr, setVectorArr] = useState<VectorArr[]>([]);

  const handleSearchBtnClick = () => {
    //校验
    if (!formData.clusterData) {
      Message.warning("请选择身份信息")
      return
    }
    if (!formData.parkingHour) {
      Message.warning("请设置落脚时长")
      return
    }
    if (!formData.parkingCount) {
      Message.warning("请设置落脚次数")
      return
    }
    if (dayjs(formData.endDate).diff(dayjs(formData.beginDate), "day") + 1 > Number(pageConfig?.timeRange?.max)) {
      Message.warning(`时间范围不可以超过${pageConfig?.timeRange?.max || 0}天！`);
      return false
    }
    if (Number(formData.parkingHour) > Number(pageConfig?.footholdTime?.max)) {
      Message.warning(`落脚时长可选范围为1-${pageConfig?.footholdTime?.max || 0}小时！`);
      return false
    }
    if (Number(formData.parkingCount) > Number(pageConfig?.footholdSpot?.max)) {
      Message.warning(`落脚次数可选范围为1-${pageConfig?.footholdSpot?.max || 0}次！`);
      return false
    }
    const _ajaxFormData = { ...formData }
    //展示用
    setFormData(_ajaxFormData)
    //检索用
    searchFormDataRef.current = _ajaxFormData
    setFootholdDataIndex(0)
    setCurDetailDataIndex(-1)
    setFirstLoading(false)//右侧抽屉 和点位
    setLeftDrawerVisible(false)//左侧抽屉
    clusterDataRef.current = _ajaxFormData.clusterData
    search(_ajaxFormData)
  }
  //格式化请求参数
  const formFormat = (form: PersonFootholdFormDataType) => {
    let newForm = { ...form }
    // 格式化日期参数
    newForm['timeRange'] = formatTimeComponentToForm(newForm)
    newForm['parkingHour'] = Number(form.parkingHour)
    newForm['parkingCount'] = Number(form.parkingCount)
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "displaySort", "displayTimeSort"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }
  const parkingDurationReveal = (parkingDuration: number) => {
    // console.log('ppp时长');
    const hours = parseInt(String(parkingDuration / 3600))
    const minute = parseInt(String(parkingDuration / 60 % 60))
    const second = Math.ceil(parkingDuration % 60)
    return `${hours}小时${minute}分${second}秒`
  }
  //ajax请求 , newForm 合并所有请求参数，表单数据，可能有分组
  const search = async (newForm: PersonFootholdFormDataType) => {
    const _newForm = formFormat(newForm)
    try {
      setAjaxLoading(true)
      setLeftLoading(true)
      setRightLoading(true)
      setDoubleDrawerVisible([true, true])
      const res = await ajax.personfoothold.getFootholdList<any, FootholdResultType[]>(_newForm)
      setReqUuid(res.reqUuid)
      //存储落脚点点位的降序与升序数据
      footholdDataListRef.current.down = (res.data || []).map((item, index, arr) => {
        return { ...item, index: arr.length - index }
      })
      footholdDataListRef.current.up = [...footholdDataListRef.current.down].reverse()

      setFootholdDatalist(footholdDataListRef.current.down)
      setChartPicData(footholdDataListRef.current.down[0].stayTime)
      if (res.data?.length) {
        const res2 = await ajax.personfoothold.getFootholdDetailList<any, DetailResultType[]>({ reqUuid: res.reqUuid, locationId: res.data[0].locationId })
        const _timeSort = searchFormDataRef.current.displayTimeSort
        //存储落脚点详情的降序与升序数据
        detaildataRef.current.down = (res2.data || []).map((item, index, arr) => {
          return { ...item, index: arr.length - index, duration: parkingDurationReveal(item.parkingDuration) }
        })
        detaildataRef.current.up = [...detaildataRef.current.down].reverse()
        //存储拼接的大图列表数据
        totalimgRef.current.down = SpliceImg(detaildataRef.current.down)
        totalimgRef.current.up = SpliceImg(detaildataRef.current.up)
        detailDataFormat(_timeSort || "")
      }
      else {
        setDetailData([])
        setTotalimg([])
      }
      setAjaxLoading(false)
      setLeftLoading(false)
      setRightLoading(false)
    }
    catch (error) {
      setDetailData([])
      setTotalimg([])
      setChartPicData([])
      setFootholdDatalist([])
      setAjaxLoading(false)
      setLeftLoading(false)
      setRightLoading(false)
    }
  }
  //点击staylist图片
  const handleDetailImgClick = (infoId: string) => {
    let currentIndex = totalimg.findIndex((item: ResultRowType) => {
      return item.infoId === infoId
    })
    setBigImgModal({
      visible: true,
      currentIndex: currentIndex || 0
    })
  }
  //关闭大图
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }
  //大图列表整合
  const SpliceImg = (data: DetailResultType[]) => {
    let totalstay = data.reduce((pre: ResultRowType[], cur: DetailResultType) => {
      pre = pre.concat(cur.personInfo)
      return pre
    }, [])
    return totalstay
  }
  //左侧下拉排序改变
  const detailDataFormat = (timeSort: string) => {
    // if (res.data) {
    if (timeSort === "staytime-down") {
      setTotalimg(totalimgRef.current.down)
      setDetailData(detaildataRef.current.down)
    } else if (timeSort === "staytime-up") {
      setTotalimg(totalimgRef.current.up)
      setDetailData(detaildataRef.current.up)
    } else {
      Message.warning("格式错误")
    }
  }
  //右侧下拉排序改变
  const footholdDataFormat = (timeSort: string) => {
    // setCheckedList([])
    if (timeSort === "staycount-down") {
      setFootholdDatalist(footholdDataListRef.current.down)
      setChartPicData(footholdDataListRef.current.down[0].stayTime)
    } else if (timeSort === "staycount-up") {
      setFootholdDatalist(footholdDataListRef.current.up)
      setChartPicData(footholdDataListRef.current.up[0].stayTime)
    } else {
      Message.warning("格式错误")
    }
  }
  //右侧多选框被点击
  // const handleChangeChecked = (cardData: any) => {
  //   const isExist = checkedList.filter(item => item === cardData.locationId).length
  //   let newCheckedData = []
  //   if (isExist) {
  //     newCheckedData = checkedList.filter(item => item !== cardData.locationId)
  //   } else {
  //     newCheckedData = checkedList.concat([cardData.locationId])
  //   }
  //   setCheckedList(newCheckedData)
  // }
  //左侧详情页的请求（单独）
  const searchDetails = async (newForm: PersonFootholdFormDataType, index: number) => {
    try {
      setLeftLoading(true)
      const res = await ajax.personfoothold.getFootholdDetailList<any, DetailResultType[]>({ reqUuid: reqUuid, locationId: footholdDataList[index].locationId })
      const _timeSort = newForm.displayTimeSort
      detaildataRef.current.down = (res.data || []).map((item, index, arr) => {
        return { ...item, index: arr.length - index, duration: parkingDurationReveal(item.parkingDuration) }
      })
      detaildataRef.current.up = [...detaildataRef.current.down].reverse()
      totalimgRef.current.down = SpliceImg(detaildataRef.current.down)
      totalimgRef.current.up = SpliceImg(detaildataRef.current.up)

      detailDataFormat(_timeSort || "")
      setLeftLoading(false)
    } catch (error) {
      setLeftLoading(false)
    }
  }
  //下拉改变
  const handleChangeCaptureSort = (v: SelectCommonProps["value"], type: "foothold" | "stay") => {
    switch (type) {
      case "foothold":
        //展示用
        setFormData({ ...formData, ...resetSliceFormData, displaySort: v as string })
        //导出用
        searchFormDataRef.current = { ...searchFormDataRef.current, ...resetSliceFormData, displaySort: v as string }
        footholdDataFormat(searchFormDataRef.current.displaySort)
        setFootholdDataIndex(0)
        setCurDetailDataIndex(-1)

        //因为此时footholdDatalist尚未改变
        searchDetails(searchFormDataRef.current, footholdDataList.length - 1)
        break;
      case "stay":
        //展示用
        setFormData({ ...formData, displayTimeSort: v as string })
        // //导出用
        searchFormDataRef.current = { ...searchFormDataRef.current, displayTimeSort: v as string }
        detailDataFormat(searchFormDataRef.current.displayTimeSort)
        setCurDetailDataIndex(-1)
        break;
      default:
        Message.warning(`未知的type${type}`)
        break;
    }
  }
  //右侧卡片点击 -切换
  const handleFootholdCardClick = (index: number, item: FootholdResultType) => {
    if (curFootholdDataIndex === index) return
    setFootholdDataIndex(index)
    setChartPicData(item.stayTime)
    setCurDetailDataIndex(-1)
    const sliceForm = { ...resetSliceFormData, displaySort: formData.displaySort }
    setFormData({ ...formData, ...sliceForm })
    searchFormDataRef.current = { ...searchFormDataRef.current, ...sliceForm }
    searchDetails(searchFormDataRef.current, index)
  }
  //判断
  const fn3 = (target: ResultRowType[], index: number) => {
    let markersObj = {}
    if (target.length > 1) {
      if (target[0].lngLat.lat === target[1].lngLat.lat && target[0].lngLat.lng === target[1].lngLat.lng) {
        markersObj = Object.assign({}, {
          markers: [
            {
              lat: target[0].lngLat.lat,
              lng: target[0].lngLat.lng,
              text: target[0].locationName,
              targetImage: target[1].targetImage,
              captureTime: target[0].captureTime,
              infoId: target[1].infoId
            },
          ],
          type: "marker",
          clickindex: index
        });
      } else {
        //两个点位不同
        markersObj = Object.assign({}, {
          markers: [
            {
              lat: target[0].lngLat.lat,
              lng: target[0].lngLat.lng,
              text: target[0].locationName,
              targetImage: target[0].targetImage,
              captureTime: target[0].captureTime,
              infoId: target[0].infoId
            },
            {
              lat: target[1].lngLat.lat,
              lng: target[1].lngLat.lng,
              text: target[1].locationName,
              targetImage: target[1].targetImage,
              captureTime: target[1].captureTime,
              infoId: target[1].infoId
            },
          ],
          type: "marker",
          clickindex: index
        });
      }
    }
    else if (target.length === 1 && target[0].locationName) {
      // 一个点位
      markersObj = Object.assign({}, {
        markers: [
          {
            lat: target[0].lngLat.lat,
            lng: target[0].lngLat.lng,
            text: target[0].locationName,
            targetImage: target[0].targetImage,
            captureTime: target[0].captureTime,
            infoId: target[0].infoId
          }
        ],
        type: "marker",
        clickindex: index
      });
    }
    else {
      console.log("无点位");
    }
    setVectorArr([markersObj as VectorArr]);
  }
  //左侧卡片点击-地图上显示落脚点
  const handleDetailCardClick = (cardData: DetailResultType, index: number) => {
    if (curDetailDataIndex === index) return
    setCurDetailDataIndex(index || 0)
    fn3(cardData.personInfo, index || 0)
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
  const leftContent = () => {
    return (<div className="left-content">
      <ResultBox
        loading={rightLoading}
        nodata={!chartpicdata.length}
        nodataClass={'nodata'}
      >
        <StayTimeDistribute
          chartData={chartpicdata}
        />
      </ResultBox>
      <div className="total-record">
        <div className='total-left'>
          <span>共<em>{detailData?.length}</em>条轨迹信息</span>
        </div>
        <Select
          disabled={leftLoading || rightLoading || !detailData.length}
          options={dictionary.staysortList}
          value={formData.displayTimeSort}
          onChange={(v) => { handleChangeCaptureSort(v, "stay") }}
        />
      </div>
      <div className='stay-list'>
        <ResultBox
          loading={leftLoading}
          nodata={!detailData?.length}
          nodataClass={'nodata'}
        >
          {
            detailData.map((item: DetailResultType, index: number) => {
              return <StayList
                key={index}
                index={item.index!}
                cardData={item}
                onImgClick={handleDetailImgClick}

                onCardClick={() => { handleDetailCardClick(item, index) }}
                active={curDetailDataIndex === index}
              />
            })
          }
        </ResultBox>
      </div>

    </div>)
  }
  const rightContent = () => {
    return (<div className="right-content">
      {
        <Card.InfoTagCard
          key={clusterDataRef.current.infoId}
          cardData={clusterDataRef.current}
          onImgClick={() => {
            const { personBasicInfo: { idcard = "", idType = "", groupId = "", groupPlateId = '' } = {}, feature = '' } = clusterDataRef.current || {}
            window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
              idNumber: idcard === '未知' ? '' : idcard,
              groupId: groupId ? groupId : [],
              groupPlateId: groupPlateId ? groupPlateId : [],
              idType: idType || '111',
              feature: feature || ''
            }))}`)
          }}
        ></Card.InfoTagCard>
      }
      <div className="total-record">
        <div className='total-left'>
          <span>共<em>{footholdDataList.length}</em>条信息</span>
          <ExportBtn
            hasAll={false}
            total={footholdDataList.length}
            url={`/v1/judgement/parking/person/locations/export`}
            formData={{
              reqUuid: reqUuid,
              personBasicInfo: clusterDataRef.current.personBasicInfo,
              personTags: clusterDataRef.current.personTags,
              pageNo: 1,
              pageSize: footholdDataList.length,
              sortType: searchFormDataRef.current.displaySort === "staycount-down" ? 1 : 2
            }}
          />
        </div>
        <Select
          disabled={leftLoading || rightLoading || !footholdDataList.length}
          options={dictionary.foothodsortList}
          value={formData.displaySort}
          onChange={(v) => { handleChangeCaptureSort(v, "foothold") }}
        />
      </div>
      <div className='search-list'>
        <ResultBox
          loading={rightLoading}
          nodata={!footholdDataList.length}
          nodataClass={'nodata'}
        >
          {
            footholdDataList.map((item: FootholdResultType, index: number) => {
              return <InfoCard
                key={index}
                index={item.index}
                cardData={item}
                active={index === curFootholdDataIndex}
                onCardClick={() => { handleFootholdCardClick(index, item) }}
              />
            })
          }
        </ResultBox>
      </div>
    </div>)
  }

  const handleChangePersonForm = (form: PersonFootholdFormDataType) => {
    setFormData({ ...formData, ...form })
  }
  //格式化token参数
  const getFormatTokenParams = (token: string) => {
    getLogData({ token }).then(res => {
      const { data } = res as any
      if (data && isObject(data)) {
        try {
          // 时间格式恢复
          if (data.timeRange) {
            formatTimeFormToComponent(data.timeRange, data)
          }
          setFormData({ ...personDefaultFormData, ...data })
        } catch (error) {
          Message.error(`数据解析失败`)
        }
      }
    })
  }

  //跳转参数
  const handleParamsData = () => {
    const searchData = getParams(location.search)
    // if (dynamicParams.module === "face") {
    if (searchData.bigImage) {
      imgUploadRef.current?.handleAutoUpload?.({ bigImage: searchData.bigImage })
    }
    else if (searchData.token) {
      getFormatTokenParams(searchData.token)
    } else if (searchData.featureList) {
      try {
        const featureList: TargetFeatureItem[] = JSON.parse(decodeURIComponent(searchData.featureList))
        console.log(imgUploadRef)
        imgUploadRef.current?.handleSearchCluster?.(featureList)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleReset = () => {
    resetFormData()
  }

  const leftSearchForm = () => {
    return (
      <div className="foothold-search">
        {
          <LeftSearchForm.Person
            ref={imgUploadRef}
            formData={formData as PersonFootholdFormDataType}
            onChange={handleChangePersonForm}
          />
        }
        <div className="foothold-search-btn">
          <Space size={10}>
            <Button
              disabled={ajaxLoading}
              onClick={handleReset}
              type='default'
              className="reset-btn"
              icon={<UndoOutlined />}
            >重置</Button>
            <Button loading={ajaxLoading} onClick={handleSearchBtnClick} type='primary'>查询</Button>
          </Space>
        </div>
      </div>

    )
  }
  useEffect(() => {
    setFormData({ ...personDefaultFormData })
    setFirstLoading(true)
    setLeftDrawerVisible(true)
    setVectorArr([])
  }, [location.search])
  //处理参数跳转
  useEffect(() => {
    handleParamsData()
  }, [])

  const BigImgInfoRender = (data: any, currentIndex: number) => {
    return <div className="img-info-view-content-content">
      <div className="foothold-img-right-info">
        <Panel title="查询人信息">
          <div className={'searchperson-card'}>
            <Card.InfoTagCard
              cardData={clusterDataRef.current}

            ></Card.InfoTagCard>
          </div>
        </Panel>
        <Panel title="落脚点信息">
          <ImgInfoCard
            cardData={data.footholdarr?.data}

          />
        </Panel>
        <div className="img-info-item info-map-wrap">
          <div className="item-con info-map">
            <MapAroundPoint
              locationId={data.locationId}
              lng={data.lngLat.lng}
              lat={data.lngLat.lat}
              footholdarr={data.footholdarr || {}}
            />
          </div>
        </div>
      </div>
    </div>
  }
  return (
    <div className={`${prefixCls} page-content`}>
      <div className={`${prefixCls}-content`} ref={boxRef}>
        <BaseMap {...mapProps}>
          <TileLayer {...tileLayerProps} />
          <Vector vectorData={vectorArr} scaleZoom={5} contentCb={vectorContentCb} selectindex={curFootholdDataIndex} selected={curDetailDataIndex != (-1)} />
        </BaseMap>
        <BoxDrawer
          title={<><div>落脚点分析</div></>}
          placement="left"
          onOpen={() => setLeftDrawerVisible(true)}
          onClose={() => setLeftDrawerVisible(false)}
          visible={leftDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          {leftSearchForm()}
        </BoxDrawer>
        {
          !firstLoading && <DoubleDrawer
            titles={["落脚时间分布", "落脚点信息"]}
            widths={[378, 388]}
            placement="right"
            visibles={doubleDrawerVisible}
            contents={[leftContent(), rightContent()]}
            onChange={handleDrawerChange}
            getContainer={() => document.querySelector(`.${prefixCls}-content`) || document.body}
          >
          </DoubleDrawer>
        }
      </div>
      <BigImg
        showtab={false}
        disabledAssociateTarget={true}
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
        data={totalimg || []}
        imgInfoRender={BigImgInfoRender}
      />
    </div>
  )
}
