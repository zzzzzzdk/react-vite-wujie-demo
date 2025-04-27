import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Button, Message, Image, Select, Loading, Space } from '@yisa/webui'
import { Icon, UndoOutlined } from '@yisa/webui/es/Icon'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { formatTimeComponentToForm, getMapProps, getParams, validatePlate, formatTimeFormToComponent, isObject } from '@/utils'
import { LeafletEvent } from "leaflet"
import { CityMassMarker, BoxDrawer, DoubleDrawer, BigImg, Vector, Export as ExportBtn } from '@/components'
import { TargetCard, StayList } from './component'
import dayjs from 'dayjs'
import ajax, { ApiResponse } from '@/services'
import dictionary from '@/config/character.config'
import { DrawType } from '@/components/LocationMapList/interface'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { ChartDataArr, DataList, DetailList, DetailResultType, FootholdResultType, SearchingInfoType, totalImg } from './interface'
import { ResultRowType } from '@/pages/Search/Target/interface'
import './index.scss'
import { ResultBox } from '@yisa/webui_business'
import StayTimeDistribute from './component/StayTimeDistribute'
import { VectorArr, VectorContentCbType } from '@/components/Vector/interface'
import LeftSearchForm from '@/pages/PersonAnalysis/Foothold/component/LeftSearchForm'
import { VehicleFootholdFormDataType } from '@/pages/PersonAnalysis/Foothold/component/LeftSearchForm/interface'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { InfoCard } from '@/pages/PersonAnalysis/Foothold/component'
import { useLocation } from 'react-router'
import { useResetState } from "ahooks";
import { getLogData } from '@/utils/log'
// import { InfoCard } from '@/pages/PersonAnalysis/Foothold/component'

export default function Foothold() {

  const prefixCls = "vehicle-foothold"
  const { scaleZoom, zoom } = window.YISACONF.map
  //缩放比例
  const [mapZoom, setMapZoom] = useState(zoom || 13)
  //地图配置
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
  const defaultPageConfig = {}
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig["foothold-vehicle"] || defaultPageConfig
  });
  const location = useLocation()
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
  //右侧选中 导出用
  // const [checkedList, setCheckedList] = useState<string[]>([])
  //当前左侧选中数据
  const [curDetailDataIndex, setCurDetailDataIndex] = useState(-1)
  //右侧数据
  const [footholdDataList, setFootholdDatalist] = useState<FootholdResultType[]>([])
  const [searchingInfo, setSearchingInfo] = useState<SearchingInfoType>()
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
  //落脚点详情数据 左侧数据
  const [detailData, setDetailData] = useState<ApiResponse<DetailResultType[]>>([])
  //抽屉挂载节点
  const boxRef = useRef<HTMLDivElement>(null)
  //抽屉
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  const [drawType, setDrawType] = useState<DrawType>("default")
  //区县与海量点切换
  const [cityMassMarker, setCityMassMarker] = useState({
    showCityMarker: true,
    showMassMarker: false,
  })
  //大图
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
  const vehicleDefaultFormData: VehicleFootholdFormDataType = {
    //选择的是时间还是时段
    timeType: 'time',
    // 起止日期
    beginDate: dayjs().subtract(Number(pageConfig?.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    //点位
    locationIds: [],
    locationGroupIds: [],
    //品牌型号
    brandId: '',
    modelId: [],
    yearId: [],

    licensePlate: '',//车牌号码
    plateColorTypeId: 5,//车牌颜色
    noplate: '',
    vehicleTypeId: [-1],//车辆类别
    parkingHour: pageConfig?.footholdTime?.default || "", //落脚时长
    // parkingHour: pageConfig?.parkingHour?.default || "", //落脚时长
    colorTypeId: -1,//车辆颜色
    directionId: -1,//行驶方向
    displaySort: dictionary.foothodsortList[0].value,//次数排序方式,
    displayTimeSort: dictionary.staysortList[0].value//停留时段排序方式
  }
  //表单数据参数
  const [formData, setFormData, resetFormData] = useResetState<VehicleFootholdFormDataType>(vehicleDefaultFormData)
  //把所有的参数保存一份，用于检索
  const searchFormDataRef = useRef({
    ...formData
  })
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
    if (formData.licensePlate.trim() === "") {
      Message.warning("请设置车牌号码")
      return
    }
    if (!validatePlate(formData.licensePlate, true)) {
      Message.warning("车牌号格式有误")
      return
    }
    if (!formData.parkingHour) {
      Message.warning("请设置落脚时长")
      return
    }
    if (!(Number(formData.parkingHour) > 0)) {
      Message.warning("落脚时长需大于0")
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
    const _ajaxFormData = { ...formData }
    //展示用
    setFormData(_ajaxFormData)
    //检索用
    searchFormDataRef.current = _ajaxFormData
    setFootholdDataIndex(0)
    setCurDetailDataIndex(-1)
    setFirstLoading(false)//右侧抽屉 和点位
    setLeftDrawerVisible(false)//左侧抽屉
    search(_ajaxFormData)
  }
  //格式化请求参数
  const formFormat = (form: VehicleFootholdFormDataType) => {
    let newForm = { ...form }
    // 格式化日期参数
    newForm['timeRange'] = formatTimeComponentToForm(newForm)
    newForm['parkingHour'] = Number(form.parkingHour)
    // 点位和任务ids
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "noplate", "displaySort", "displayTimeSort"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }
  //格式化时间
  const parkingDurationReveal = (parkingDuration: number) => {
    // console.log('ppp时长');
    const hours = parseInt(String(parkingDuration / 3600))
    const minute = parseInt(String(parkingDuration / 60 % 60))
    const second = Math.ceil(parkingDuration % 60)
    return `${hours}小时${minute}分${second}秒`
  }
  //ajax请求 , newForm 合并所有请求参数，表单数据，可能有分组
  const search = async (newForm: VehicleFootholdFormDataType) => {
    const _newForm = formFormat(newForm)
    try {
      setAjaxLoading(true)
      setLeftLoading(true)
      setRightLoading(true)
      setDoubleDrawerVisible([true, true])
      const res = await ajax.foothold.getFootholdList<any, FootholdResultType[]>(_newForm)

      setSearchingInfo({
        carInfo: res.carInfo,
        licensePlate: res.licensePlate,
        lpColor: res.lpColor,
        plateColorTypeId2: res.plateColorTypeId2,
        // message:res.message,
        reqUuid: res.reqUuid,
        targetImage: res.targetImage,
      })
      footholdDataListRef.current.down = (res.data || []).map((item, index, arr) => {
        return { ...item, index: arr.length - index }
      })
      footholdDataListRef.current.up = [...footholdDataListRef.current.down].reverse()

      setFootholdDatalist(footholdDataListRef.current.down)
      setChartPicData(footholdDataListRef.current.down[0].stayTime)
      if (res.data?.length) {
        const res2 = await ajax.foothold.getFootholdDetailList<any, DetailResultType[]>({ reqUuid: res.reqUuid, locationId: res.data[0].locationId })
        const _timeSort = searchFormDataRef.current.displayTimeSort
        Footholdformat(res2.data!)
        detaildataRef.current.down = (res2.data || []).map((item, index, arr) => {
          return { ...item, index: arr.length - index, duration: parkingDurationReveal(item.parkingDuration) }
        })
        detaildataRef.current.up = [...detaildataRef.current.down].reverse()
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
  //大图整合
  const SpliceImg = (data: DetailResultType[]) => {
    let totalstay = data.reduce((pre: ResultRowType[], cur: DetailResultType) => {
      pre = pre.concat(cur.vehicleInfo)
      return pre
    }, [])
    return totalstay
  }
  //左侧下拉排序改变
  const detailDataFormat = (timeSort: string) => {
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
  //详情数据格式化 新增圈
  const Footholdformat = (arr: DetailResultType[]) => {
    arr.forEach((e: DetailResultType) => {
      if (e.vehicleInfo.length === 2) {
        e.vehicleInfo.forEach((item: ResultRowType, index: number, data: ResultRowType[]) => {
          if (data[0].lngLat.lng === data[1].lngLat.lng && data[0].lngLat.lat === data[1].lngLat.lat) {
            item.footholdarr = {
              data: [{ ...data[0].lngLat, locationName: data[0].locationName }],
              type: 'foothold'
            }
          }
          else
            item.footholdarr = {
              data: [{ ...data[0].lngLat, locationName: data[0].locationName }, { ...data[1].lngLat, locationName: data[1].locationName }],
              type: 'foothold'
            }

        })
      }
      else {
        e.vehicleInfo[0].footholdarr = {
          data: [{ ...e.vehicleInfo[0].lngLat, locationName: e.vehicleInfo[0].locationName }],
          type: 'foothold'
        }
      }
    })
    console.log(arr, 'llll');

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
  const searchDetails = async (newForm: VehicleFootholdFormDataType, index: number) => {
    try {
      setLeftLoading(true)

      const res = await ajax.foothold.getFootholdDetailList<any, DetailResultType[]>({ reqUuid: searchingInfo?.reqUuid, locationId: footholdDataList[index].locationId })
      const _timeSort = newForm.displayTimeSort
      Footholdformat(res.data!)
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
  const handleDetailCardClick = (cardData: DetailResultType, index: number) => {
    if (curDetailDataIndex === index) return
    setCurDetailDataIndex(index || 0)
    fn3(cardData.vehicleInfo, index || 0)
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
        rightLoading ? <Loading spinning={true} tip={dictionary.loadingTip} /> : <TargetCard cardData={searchingInfo} />
      }
      <div className="total-record">
        <div className='total-left'>
          <span>共<em>{footholdDataList.length}</em>条信息</span>
          <ExportBtn
            hasAll={false}
            total={footholdDataList.length}
            url={`/v1/judgement/parking/vehicle/export`}
            formData={{
              reqUuid: searchingInfo?.reqUuid,
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
                type="vehicle"
              />
            })
          }
        </ResultBox>
      </div>
    </div>)
  }
  const handleChangeVehicleForm = (form: VehicleFootholdFormDataType) => {
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
          setFormData({ ...vehicleDefaultFormData, ...data })
        } catch (error) {
          Message.error(`数据解析失败`)
        }
      }
    })
  }
  //跳转参数
  const handleParamsData = () => {
    const searchData = getParams(location.search)
    if (searchData.token) {
      getFormatTokenParams(searchData.token)
    }
    else {
      let params: any = {}
      console.log(searchData)
      searchData?.plateColorTypeId && (params.plateColorTypeId = Number(searchData?.plateColorTypeId))
      searchData?.brandId && (params.brandId = searchData?.brandId)
      searchData?.modelId && (params.modelId = searchData?.modelId.split(","))
      searchData?.yearId && (params.yearId = searchData?.yearId.split(","))
      searchData?.vehicleTypeId && (params.vehicleTypeId = searchData?.vehicleTypeId.split(",").map(item => Number(item)))
      setFormData({ ...formData, ...searchData, ...params })
    }
    // }
  }

  const handleReset = () => {
    resetFormData()
  }
  const leftSearchForm = () => {
    return (
      <div className="foothold-search">
        {
          <LeftSearchForm.Vehicle
            formData={formData}
            onChange={handleChangeVehicleForm}
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
    setFormData({ ...vehicleDefaultFormData })
    setFirstLoading(true)
    setLeftDrawerVisible(true)
    setMapZoom(scaleZoom)
    setVectorArr([])
    setCityMassMarker({
      showCityMarker: true,
      showMassMarker: false
    })
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
        disabledAssociateTarget={true}
        showtab={false}
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
        data={totalimg}
      />
    </div>
  )
}
