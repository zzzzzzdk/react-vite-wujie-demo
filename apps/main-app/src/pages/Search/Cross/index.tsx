import React, { useEffect, useRef, useState } from "react";
import { Drawer, Button, Form, Slider, Select, Message, Space, VirtualList } from '@yisa/webui'
import { Icon, LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import { ResultBox } from '@yisa/webui_business'
import CrossMap from "./CrossMap";
import { BoxDrawer, FormRadioGroup, ImgUpload, LocationMapList, TimeRangePicker, Card, BigImg, BottomRight, Export } from '@/components'
import ImgUploadProps, { RefImgUploadType, UploadButtonProps } from "@/components/ImgUpload/interface";
import { TargetFeatureItem } from "@/config/CommonType";
import { LocationListType, LocationMapListCallBack } from '@/components/LocationMapList/interface'
import dayjs from 'dayjs'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { FormDataType, ResultRowType, DataItemType } from "./interface";
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import { useLocation } from "react-router-dom";
import { formatTimeFormToComponent, getParams, isArray, isObject } from "@/utils";
import { isEmptyObject, isUndefined, isNumber } from '@/utils/is'
import { useSelector, useDispatch, RootState } from '@/store'
import character from "@/config/character.config";
import services, { ApiResponse } from "@/services";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import classNames from 'classnames'
import FilterateModal from "./FilterateModal";
import { getLogData } from "@/utils/log";
import dictionary from '@/config/character.config'
import './index.scss'

const { Option } = Select

const Cross = () => {
  const prefixCls = "cross-tracking"
  const location = useLocation()
  const { userInfo } = useSelector((state: RootState) => {
    return state.user
  })
  const [uploadDisabled, setUploadDisabled] = useState(false)
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false)
  const [cardResultVisible, setCardResultVisible] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const imgUploadRef = useRef<RefImgUploadType>(null)
  //刷新上传历史
  const [flushHistory, setFlushHistory] = useState(false)
  const [featureList, setFeatureList] = useState<(TargetFeatureItem)[]>([])
  const featureListRef = useRef(featureList)
  featureListRef.current = featureList

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig.cross || {}
  });

  const defaultFormData: FormDataType = {
    similarity: Number(pageConfig.threshold?.default) || 60,
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    fileId: [],
    targetType: 'all',
    sort: {
      field: 'captureTime',
      order: 'asc'
    },
    // realTimeTracking: false
  }
  const [formData, setFormData] = useState(defaultFormData)
  const [ajaxFormData, setAjaxFormData] = useState(formData)
  const ajaxFormDataRef = useRef(ajaxFormData)
  ajaxFormDataRef.current = ajaxFormData
  const [defaultListType, setDefaultListType] = useState<LocationListType>(() => {
    const searchData = getParams(location.search)
    if (!isEmptyObject(searchData) && searchData.offlineIds) {
      return 'offline'
    } else {
      return 'region'
    }
  })
  const [beforAjax, setBeforAjax] = useState(true)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [taskId, setTaskId] = useState('')
  const allResultData = useRef([]) // 用来存储未从过滤名单删除的数据
  const [resultData, setResultData] = useState<ResultRowType['data']>([])
  const resultDataRef = useRef(resultData)
  resultDataRef.current = resultData
  const [filterData, setFilterData] = useState<ResultRowType['data']>([])
  const [cardResultData, setCardResultData] = useState<TargetResultItemType[]>([])
  const [identifyResult, setIdentifyResult] = useState<ResultRowType['faces']>([])

  const [resultShowType, setResultShowType] = useState('map')
  const switchData = [
    {
      label: <span><Icon type="tuwen" /> 图文</span>,
      value: "image",
    },
    {
      label: <span><Icon type="jichuditu" /> 地图</span>,
      value: "map",
    },
  ]

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  // 大图
  const [bigImgData, setBigImgData] = useState<TargetResultItemType[]>([])
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgIndex, setBigImgIndex] = useState(0)

  // 过滤名单
  const [filterate, setFilterate] = useState([])
  const [filterateVisible, setFilterateVisible] = useState(false)

  // 轨迹数据
  const [trackData, setTrackData] = useState(resultData)

  // 虚拟列表盒子高度
  const virtualBoxRef = useRef<HTMLDivElement>(null)
  const [virtualBoxHeight, setVirtualBoxHeight] = useState(virtualBoxRef.current?.offsetHeight || 0)

  // 页面跳转传参处理
  const handleParamsData = async () => {
    //所有跳转到以图的参数先进行编码
    const searchData = getParams(location.search)
    // console.log(searchData)
    if (!isEmptyObject(searchData)) {
      let paramsFormData = {}
      //含有大图
      if (searchData.bigImage) {
        imgUploadRef.current && imgUploadRef.current?.handleAutoUpload?.({ bigImage: searchData.bigImage })
        //特征数组 ,由于特征数组包含的字段太多，可能会有特殊字符，&等
      } else if (searchData.featureList) {
        try {
          const featureList: TargetFeatureItem[] = JSON.parse(decodeURIComponent(searchData.featureList))
          handleParamsFeatureList(featureList)
        } catch (error) {
          console.log(error)
        }
        //离线点位
      } else if (searchData.offlineIds) {
        try {
          paramsFormData['fileId'] = JSON.parse(searchData.offlineIds)
        } catch (error) {
          console.log(error)
        }
      } else if (searchData.token) {
        await getLogData({ token: searchData.token }).then(res => {
          const { data } = res as any
          if (data && isObject(data)) {
            try {
              paramsFormData = data
              // 时间格式恢复
              if (data.timeRange) {
                formatTimeFormToComponent(data.timeRange, paramsFormData)
              }
              // 特征列表渲染
              if (data.featureList) {
                handleParamsFeatureList(data.featureList)
              }
            } catch (error) {
              Message.error(`数据解析失败`)
            }
          }
        })
      }
      setFormData({
        ...formData,
        ...paramsFormData
      })
    }
  }

  const handleParamsFeatureList = (featureList: TargetFeatureItem[]) => {
    setFeatureList(featureList)

    // 跳转的图片特征也需进入上传历史
    featureList.forEach(elem => {
      saveUploadHistory(elem)
    });
  }

  // 图文/地图改变
  const handleResultShowTypeChange = (value: string) => {
    setResultShowType(value)

    if (value === 'image') {
      setRightDrawerVisible(false)
      setCardResultVisible(true)

      const data = handleCardResultData(handleSetFilter(ajaxFormDataRef.current.targetType, resultDataRef.current))
      console.log(data)
      setCardResultData(data)
    }

    if (value === 'map') {
      setRightDrawerVisible(true)
      setCardResultVisible(false)
    }
  }

  //特征数组改变事件
  const handleChangeFeatureList = (list: (TargetFeatureItem)[]) => {
    console.log(list)
    setFeatureList(list)
  }

  // 点位变化
  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
      fileId: data.offlineIds
    })
  }

  // 相似度改变
  const handlesimilarityChange = (similarity: number | number[]) => {
    setFormData({ ...formData, similarity })
  }

  // 日期改变
  const handleDateChange = (dates: DatesParamsType) => {
    setFormData({
      ...formData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    })
  }

  const handleRealTimeTrackingChange = (value: boolean) => {
  }

  // 数据通过时间排序，字段默认取minCaptureTime
  function sortArrayByTime<T extends Array<TargetResultItemType | DataItemType>>(array: T, sortOrder: 'asc' | 'desc', field = 'minCaptureTime'): T {
    array.sort((a, b) => {
      var timeA = new Date(a[field]).getTime();
      var timeB = new Date(b[field]).getTime();

      if (sortOrder === 'asc') {
        return timeB - timeA;
      } else {
        return timeA - timeB;
      }
    });

    return array;
  }

  // 时间排序
  const handleTimeSortChange = () => {
    if (searching) {
      Message.warning('检索过程不可更改！')
      return
    }
    const sortOrder: typeof ajaxFormDataRef.current.sort.order = ajaxFormDataRef.current.sort.order === 'asc' ? 'desc' : 'asc'
    let newForm = {
      ...ajaxFormDataRef.current,
      sort: {
        ...ajaxFormDataRef.current.sort,
        order: sortOrder
      }
    }
    setAjaxFormData(newForm)
    let newFilterData = sortArrayByTime(filterData, sortOrder)
    setFilterData([...newFilterData])
    setTrackData([...newFilterData])
    let newResultData = sortArrayByTime(resultDataRef.current, sortOrder)
    setResultData(newResultData)

    if (cardResultVisible) {
      setCardResultData(sortArrayByTime(cardResultData, sortOrder, 'captureTime'))
    }
  }

  // 目标类型变化
  const handleTargetTypeChange = (value: SelectCommonProps['value']) => {
    // console.log(value)
    let newForm = {
      ...ajaxFormDataRef.current,
      targetType: value as string
    }
    setAjaxFormData(newForm)
    const newFilterData = handleSetFilter(`${value}`, resultDataRef.current)
    setFilterData(newFilterData)
    console.log(newFilterData)
    handleConnectTrack(newFilterData)
    setTrackData([...newFilterData])
    if (cardResultVisible) {
      setCardResultData(handleCardResultData(handleSetFilter(`${value}`, resultDataRef.current)))
    }
  }

  // 判断当前path是否有链接到下一个点的经纬度，没有的话，添加下一个点的经纬度
  const handleConnectTrack = (newFilterData: DataItemType[]) => {
    for (let i = 0; i < newFilterData.length; i++) {
      const item = newFilterData[i]
      // 判断当前path是否有链接到下一个点的经纬度，没有的话，添加下一个点的经纬度
      // 根据时间排序判断是连接的上一个点还是下一个点
      console.log(ajaxFormDataRef.current.sort.order)
      if (ajaxFormDataRef.current.sort.order === 'asc') {
        if (newFilterData[i - 1]) {
          const prevLnglat = newFilterData[i - 1].lngLat
          const lngLatStr = `${prevLnglat.lng},${prevLnglat.lat}`
          let ifConnect = false
          if (item.path && item.path.length) {
            item.path.forEach((str: string) => {
              if (str.indexOf(lngLatStr) > -1) {
                ifConnect = true
              }
            });
          }
          console.log(ifConnect)
          !ifConnect && item.path.push(lngLatStr)
        }
      } else {
        if (newFilterData[i + 1]) {
          const nextLnglat = newFilterData[i + 1].lngLat
          const lngLatStr = `${nextLnglat.lng},${nextLnglat.lat}`
          let ifConnect = false
          if (item.path && item.path.length) {
            item.path.forEach((str: string) => {
              if (str.indexOf(lngLatStr) > -1) {
                ifConnect = true
              }
            });
          }
          console.log(ifConnect)
          !ifConnect && item.path.push(lngLatStr)
        }
      }
    }
    return newFilterData
  }

  // 右侧数据进行筛选 参数为 数据类型  数据
  const handleSetFilter = (typeValue = 'all', data: ResultRowType['data'] = []) => {
    if (!(data && data.length > 0)) {
      return []
    }
    let _data = JSON.parse(JSON.stringify(data))
    // console.log(_data)
    if (typeValue == 'all') {
      return handleNewIndex(_data)
    }

    _data.forEach((item: DataItemType) => {
      let filData = (item.infos || []).filter((infoItem) => infoItem.targetType == typeValue)
      // console.log(filData)
      item.infos = filData
    })
    _data = _data.filter((item: DataItemType) => (item.infos ?? []).length > 0)

    return handleNewIndex(_data)
  }

  const handleNewIndex = (newData: DataItemType[]) => {
    return newData.map((item, index) => ({ ...item, index: newData.length - index }))
  }

  // 处理检索时间, 根据interval，分割成一个时间数组
  const handleTimeRanges = (startDate?: string, endDate?: string, interval: number = 7) => {
    if (!startDate || !endDate) return;

    var timeRanges = [];
    var currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      var rangeStartDate = new Date(currentDate);
      var rangeEndDate = new Date(currentDate);
      rangeEndDate.setDate(rangeEndDate.getDate() + interval);

      if (rangeEndDate > new Date(endDate)) {
        rangeEndDate = new Date(endDate);
      }

      // timeRanges.push({
      //   start: dayjs(rangeStartDate).format("YYYY-MM-DD HH:mm:ss"),
      //   end: dayjs(rangeEndDate).format("YYYY-MM-DD HH:mm:ss")
      // });
      timeRanges.push([dayjs(rangeStartDate).format("YYYY-MM-DD HH:mm:ss"), dayjs(rangeEndDate).format("YYYY-MM-DD HH:mm:ss")])

      currentDate.setDate(currentDate.getDate() + interval);
    }
    // console.log(timeRanges)
    return timeRanges;
  }

  // 格式化formData，为提交检索做准备
  const formFormat = (form: FormDataType) => {
    let newForm = {
      featureList: featureList,
      similarity: form.similarity,
      targetType: defaultFormData.targetType,
      sort: defaultFormData.sort
    }

    // 格式化日期参数
    const timeArr = handleTimeRanges(formData.beginDate, formData.endDate)
    newForm['timeRange'] = {
      timesArr: timeArr
    }

    // 点位和任务ids
    newForm['locationIds'] = formData.locationIds ?? []
    newForm['locationGroupIds'] = formData.locationGroupIds ?? []
    newForm['fileId'] = formData.fileId

    return newForm
  }

  // 点击检索
  const handleBtnClick = () => {
    if (!featureList.length) {
      Message.warning('请上传特征值')
      return
    }

    const dateRangeMax = Number(pageConfig.timeRange?.max || 0)
    if (dateRangeMax) {
      let timeDiff = dayjs(formData.beginDate).diff(dayjs(formData.endDate), 'days')
      if (Math.abs(timeDiff) > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
        return
      }
    }

    if (searching) {
      return
    }

    // 点击按钮置空各结果数组
    setIdentifyResult([])
    setResultData([])
    setFilterData([])
    setTrackData([])
    setCardResultData([])

    const newForm = formFormat(formData)
    setAjaxFormData(newForm)
    handleSearch(newForm)

    if (!rightDrawerVisible) {
      setRightDrawerVisible(true)
    }
  }

  // 执行ajax请求
  const handleSearch = async (newForm: FormDataType) => {
    // console.log(newForm)
    if (beforAjax) {
      setBeforAjax(false)
    }
    setSelectedIndex(null)
    setAjaxLoading(true)
    setSearching(true)

    // 清理数据缓存
    services.cross.clearCache({ taskId: taskId }).catch(err => console.log(err))

    // 如果有task就不请求了，除非页面刷新，
    if (!taskId) {
      const { data = '' } = await services.cross.getCrossTaskId<any, string>()
      console.log(data)
      setTaskId(data)
      getResult(data, newForm, 0)
    } else {
      getResult(taskId, newForm, 0)
    }
  }

  type ResultFormDataType = {
    taskId: string,
    similarity: number | number[],
    timeRange: FormDataType['timeRange'],
    featureList: FormDataType['featureList'],
    locationIds: FormDataType['locationIds'],
    locationGroupIds: FormDataType['locationGroupIds'],
    fileId: FormDataType['fileId'],
    index: number
  }

  const getResult = (taskId: string, newForm: FormDataType, index: number) => {
    services.cross.getCrossResult<ResultFormDataType, ResultRowType>({
      taskId: taskId,
      similarity: newForm.similarity,
      featureList: newForm.featureList,
      locationIds: newForm.locationIds,
      locationGroupIds: newForm.locationGroupIds,
      fileId: newForm.fileId,
      timeRange: {
        times: newForm.timeRange && newForm.timeRange.timesArr ? newForm.timeRange.timesArr[index] : []
      },
      index: index
    }).then(res => {
      // console.log(res)
      const { data, totalRecords, usedTime } = res
      setAjaxLoading(false)

      let result = (data?.data || [])
      // 拼接新获取的数据
      if (resultDataRef.current && resultDataRef.current.length > 0 && result.length > 0) {
        // result = resultDataRef.current.concat(result)
        // 因为请求回来的数据是时间倒序的，最早的时间在数组末尾，所以比较新数组末尾数据与 旧数组的末尾数据，是否具有相同点位id

        /** ---------- 第一种方法：前端合并 末尾数据 */
        // const newEndData = result[result.length - 1]
        // let oldEndIndex = 0
        // if (ajaxFormData.sort.order === 'asc') {
        //   oldEndIndex = 0
        //   const oldEndData = resultDataRef.current[oldEndIndex]
        //   if (oldEndData && newEndData && oldEndData.locationId === newEndData.locationId) {
        //     resultDataRef.current[oldEndIndex] = {
        //       ...oldEndData,
        //       infos: oldEndData.infos?.concat(newEndData.infos || []) || [],
        //       maxCaptureTime: newEndData.maxCaptureTime
        //     }
        //     result = result.slice(0, result.length - 1).concat(resultDataRef.current)
        //   } else {
        //     result = result.concat(resultDataRef.current)
        //   }
        // } else {
        //   oldEndIndex = resultDataRef.current.length - 1
        //   const oldEndData = resultDataRef.current[oldEndIndex]
        //   if (oldEndData && newEndData && oldEndData.locationId === newEndData.locationId) {
        //     resultDataRef.current[oldEndIndex] = {
        //       ...oldEndData,
        //       infos: oldEndData.infos?.concat(newEndData.infos || []) || [],
        //       maxCaptureTime: newEndData.maxCaptureTime
        //     }
        //     result = resultDataRef.current.concat(result.reverse().slice(1))
        //   } else {
        //     result = resultDataRef.current.concat(result.reverse())
        //   }
        // }

        /** 第二种方法： 后端合并末尾数据，前端直接把旧数据最后一条删除，用后端返回的合并后的数据 */
        if (ajaxFormDataRef.current.sort.order === 'asc') {
          result = result.concat(resultDataRef.current.slice(1, resultDataRef.current.length))
        } else {
          result = resultDataRef.current.slice(0, resultDataRef.current.length - 1).concat(result.reverse())
        }
      }
      // 添加过滤名单标识(父子都加)  通过标识定位加入过滤名单的数据位置，在删除时还原
      result = result.map((item, index) => ({
        ...item,
        index: result.length - index,
        filterId: item.locationId + item.minCaptureTime,
        infos: (item.infos ?? []).map(o => ({ ...o, filterId: item.locationId + item.minCaptureTime, }))
      }))
      const faces = data?.faces || []
      // console.log(result, faces)

      setResultData(result)
      setFilterData(result)
      setTrackData([...result])
      addIdentifyResult(faces)
      if (cardResultVisible) {
        const data = handleCardResultData(handleSetFilter(newForm.targetType, result))
        // console.log(data)
        setCardResultData(data)
      }

      // 判断是否有下一个时间段分割数组
      if (index >= (newForm.timeRange?.timesArr?.length || 0) - 1) {
        setSearching(false)
      } else {
        setTimeout(() => {
          getResult(taskId, newForm, index + 1)
        }, 3000);
      }
      // setTimeout(() => {
      //   setMoveTop('-10px')
      //   setWarnStyle('all 1s')
      // }, 50);
    }).catch(err => {
      console.log(err)
      setAjaxLoading(false)
      setSearching(false)
    })
  }

  // 加入识别目标
  const addIdentifyResult = (newIdentifys: TargetResultItemType[]) => {
    setIdentifyResult(newIdentifys)
    // console.log(`featureList`, featureListRef.current)
    // 先将新数组 数据项添加识别标识 且
    let identifyArr = newIdentifys.map(item => ({ ...item, identify: true }))

    // 更新featureList

    // 将特征列表中识别结果，挑选出来
    const identifydata = featureListRef.current.filter(item => !!item.identify)
    // 原始特征数组
    const oldFeatureList = featureListRef.current.filter(item => !item.identify)

    // 合并新数组与旧识别项，并根据相似度similarity由高到低排个序
    identifyArr = identifyArr.concat(identifydata as any).sort((a, b) => Number(b.similarity || 0) - Number(a.similarity || 0));

    // 去重feature特征值相同的识别项，feature作为key值相同会导致上传列表渲染混乱
    identifyArr = identifyArr.filter((value, index, self) => {
      return self.findIndex(t => t.feature === value.feature) === index;
    });

    // 合并特征数组与identifyArr, 特征数组排前面，然后取前五个
    const newFeatureList = oldFeatureList.concat(identifyArr as unknown as TargetFeatureItem).slice(0, 5)
    // console.log(newFeatureList)

    setFeatureList(prev => newFeatureList)


    // // 如果新数组所有元素加入不超过5个上传目标的限制，直接合并
    // if ((featureListRef.current.length + identifyArr.length) <= 5) {
    //   setFeatureList(prev => prev.concat(identifyArr as unknown as TargetFeatureItem[]))
    // } else {
    // }
  }

  //拖拽
  const handleImgDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setUploadDisabled(true)
  }

  // 图片拖拽结束事件
  const handleImgDrop = (event: React.DragEvent) => {
    setUploadDisabled(false)
    //判断当前图片数量
    if (featureList.length >= 5) {
      Message.warning("最多支持上传五张!")
      return
    }
    event.preventDefault();
    event.stopPropagation()
    const _data = event.dataTransfer.getData("Text")
    if (!_data) {
      console.log('拖拽的空数据')
      return false
    }
    const data: TargetResultItemType = JSON.parse(_data)

    //判断是否有相同特征
    if (featureList.find(i => i.feature == data.feature)) {
      Message.warning("已添加该特征")
      return
    }
    // console.log(data)
    const { feature, targetImage, targetType, detection = { x: 0, y: 0, w: 0, h: 0 } } = data
    const newFeatureList = [...featureList, {
      feature,
      targetImage,
      targetType,
      ...detection,
      identify: true
    }]
    // console.log(newFeatureList)
    setFeatureList(newFeatureList)
    //拖拽完之后应该是用最新参数重新检索一遍，分组筛选需要重置
    const newForm = Object.assign({}, ajaxFormDataRef.current, { featureList: newFeatureList })
    // const newForm = deepMerge(ajaxFormDataRef.current, { featureList: newFeatureList })
    setAjaxFormData({ ...newForm })
    handleSearch(newForm)
    //拖拽上传需要保存上传历史，保存之后需要请求新的历史
    saveUploadHistory(data)

  }

  const handleImgDragLeave = () => {
    setUploadDisabled(false)
  }

  function deepMerge(obj1 = {}, obj2 = {}): any {
    var newObj = {};

    for (let prop in obj1) {
      if (obj1.hasOwnProperty(prop)) {
        newObj[prop] = obj1[prop];
      }
    }

    for (let prop in obj2) {
      if (obj2.hasOwnProperty(prop)) {
        if (typeof obj2[prop] == 'object' && obj2[prop] !== null && typeof obj1[prop] == 'object' && obj1[prop] !== null) {
          newObj[prop] = deepMerge(obj1[prop], obj2[prop]);
        } else {
          newObj[prop] = obj2[prop];
        }
      }
    }

    return newObj;
  }

  const saveUploadHistory = (data: any) => {
    services.saveUploadHistory({
      uid: userInfo.id,
      param: data
    }).then(res => setFlushHistory(true))
      .catch(err => Message.error(err.message))
  }

  // 监听featureList改变，同步修改右侧和图文结果的标识
  useEffect(() => {
    const identifyArr = featureList.filter(item => item.identify)

    if (identifyArr && identifyArr.length) {
      const infoIds = identifyArr.map(item => item.infoId)
      // 改变resultData和filterData
      const newResultData = resultDataRef.current.map(item => {
        if (item.infos?.length) {
          item.infos.forEach(elem => {
            if (infoIds.includes(elem.infoId)) {
              elem.retrieval = true
            } else {
              elem.retrieval = false
            }
          })
        }
        return item
      })
      setResultData([...newResultData])
      setFilterData(handleSetFilter(ajaxFormDataRef.current.targetType, newResultData))

      // 图文卡片页结果数据
      if (cardResultVisible) {
        const data = handleCardResultData(handleSetFilter(ajaxFormDataRef.current.targetType, newResultData))
        // console.log(data)
        setCardResultData(data)
      }
    }

  }, [featureList])

  // 打开大图
  const handleOpenBigImg = (event: React.MouseEvent, item: TargetResultItemType, index?: number, parentIndex?: number, infos?: TargetResultItemType[]) => {
    console.log(index, parentIndex)
    const newBigImgData = infos && infos.length ? infos : filterData[parentIndex || 0].infos || []
    setBigImgData(newBigImgData)
    setBigImgIndex(index || 0)
    setBigImgVisible(true)
  }

  // 图文页打开大图
  const handleOpenBigImgFromCardResult = (event: React.MouseEvent, item: TargetResultItemType, index: number) => {
    setBigImgData(cardResultData)
    setBigImgIndex(index)
    setBigImgVisible(true)
  }

  // 卡片点击
  const handleCardClick = (event: React.MouseEvent, data: DataItemType, index: number) => {
    // console.log(data)
    setSelectedIndex(index)
  }

  // 处理成图文列表数据
  const handleCardResultData = (data: ResultRowType['data']) => {
    let arr: TargetResultItemType[] = []
    data.forEach(item => {
      if (item.infos && item.infos.length) {
        arr = [...arr, ...item.infos]
      }
    })

    arr.sort((a, b) => Number(a.similarity || 0) < Number(b.similarity || 0) ? 1 : -1)
    return arr
  }

  // 页面重复元素提取

  // 地图列表切换单选组
  const ResulType = () => (
    <FormRadioGroup
      className="result-show-type"
      defaultValue={resultShowType}
      yisaData={switchData}
      onChange={handleResultShowTypeChange}
      style={{ right: rightDrawerVisible ? '438px' : '20px' }}
    />
  )

  // 目标类型下拉
  const TargetTypeSelect = () => (
    <div className="target-type-select">
      <label>目标类型</label>
      <Select
        size="small"
        onChange={handleTargetTypeChange}
        value={ajaxFormData.targetType}
        disabled={searching}
      >
        {
          [{ value: 'all', label: '全部' }, ...character.targetTypes].map(item => (
            <Option key={item.value} value={item.value}>{item.label}</Option>
          ))
        }
      </Select>
    </div>
  )

  // 时间排序按钮
  const TimeSortBtn = () => (
    <Button className="time-sort" onClick={handleTimeSortChange} disabled={ajaxLoading || searching} size="small">
      时间 <Icon type="daoxu" className={ajaxFormData.sort.order === 'asc' ? 'active' : ''} /> <Icon type="zhengxu" className={ajaxFormData.sort.order === 'desc' ? 'active' : ''} />
    </Button>
  )

  // 过滤名单按钮
  const FilterBtn = () => (
    <Button type="primary" size="small" onClick={() => setFilterateVisible(true)}>过滤名单</Button>
  )

  // const ExportBtn = () => (
  //   <Export
  //     total={resultData.totalRecords}
  //     url={`/v1/comparison/multi-source-track/export`}
  //     // url={'http://localhost:8844/stream'}
  //     formData={{
  //       ...ajaxFormData,
  //       checkedIds: checkedList.map(item => item.infoId)
  //     }}
  //   />
  // )

  const [listCount, setListCount] = useState(6)
  const listCountRef = useRef(listCount)
  listCountRef.current = listCount

  const calcListCount = () => {
    const itemWidth = 208
    const width = (document.querySelector('.card-result-content')?.clientWidth || 0) - 90 // 126为总间距
    const count = Math.floor(width / itemWidth)
    if (count >= 6 || count <= 2) {
      setListCount(count)
    } else {
      const diff = width - itemWidth * count + 18 * (count - 1)
      if (diff >= itemWidth) {
        setListCount(count + 1)
      } else {
        setListCount(count)
      }
    }
  }

  const calcVirtualHeight = () => {
    // console.log(virtualBoxRef.current?.offsetHeight)
    const height = virtualBoxRef.current?.offsetHeight || 0
    setVirtualBoxHeight(height)
  }

  useEffect(() => {
    handleParamsData()

    calcListCount()
    window.addEventListener('resize', calcListCount)

    const resizeObserver = new ResizeObserver((entries) => {
      calcVirtualHeight()
    });
    virtualBoxRef.current && resizeObserver.observe(virtualBoxRef.current);

    return () => {
      window.removeEventListener('resize', calcListCount)
      virtualBoxRef.current && resizeObserver.unobserve(virtualBoxRef.current)
    }
  }, [])

  // 右下角地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)
  const [bottomCurrentData, setBottomCurrentData] = useState<{ locationName: string, lngLat: { lng: string, lat: string } }>({
    locationName: '',
    lngLat: {
      lat: '',
      lng: ''
    }
  })

  const handleRenderCard = () => {
    const data = cardResultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          _template.push(
            <Card.IdentifySingle
              key={j}
              cardData={{
                ...data[j],
                similarity: data[j].similarity || '0',
                captureTime: data[j].captureTime || '--',
                locationName: data[j].locationName || '--'
              }}
              onImgClick={(e, data) => handleOpenBigImgFromCardResult(e, data, j)}
              // checked={selectedData?.index === (index + 1)}
              // onCardClick={(e, data,) => handleCardClick(e, data, j)}
              onLocationClick={(e, data) => { setBottomRightMapVisible(true); setBottomCurrentData(data) }}
              locationCanClick={true}
              onAddFilterate={handleAddFilterate}
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

  // 添加数据到过滤名单
  const handleAddFilterate = (data: TargetResultItemType) => {
    // 从featureList上传列表的识别数据中，删除该项
    // 原始特征数组
    const identifyArr = featureListRef.current.filter(item => !item.identify || (item.identify && item.infoId !== data.infoId))
    setFeatureList([...identifyArr])

    //
    services.cross.addFilterate({
      taskId: taskId,
      item: data
    }).then(res => {
      console.log(res)
      Message.success("添加成功")
      // 从resultData/filterData/cardResultData中删除加入过滤名单的数据
      let newResultData = resultDataRef.current.map((item, index) => {
        if (item.infos?.length) {
          item.infos = item.infos.filter(item => item.infoId !== data.infoId)
        }
        return item
      })
      newResultData.forEach((item, index) => (item.index = newResultData.length - index))
      setResultData([...newResultData])

      // 显示的列表数据过滤掉没有infos信息的
      let newFilterData = [...newResultData].filter((item: DataItemType) => (item.infos?.length || 0) > 0)
      newFilterData = handleSetFilter(ajaxFormDataRef.current.targetType, newFilterData)
      setFilterData(newFilterData)
      handleConnectTrack(newFilterData)
      setTrackData([...newFilterData])

      // 图文卡片页结果数据
      if (cardResultVisible) {
        const data = handleCardResultData(handleSetFilter(ajaxFormDataRef.current.targetType, newResultData))
        // console.log(data)
        setCardResultData(data)
      }

    }).catch(err => console.log(err))
  }

  // 过滤名单删除回调
  const handleFilterateDelChange = (data: TargetResultItemType[]) => {
    // 从resultData/filterData/cardResultData中加入过滤名单中删除的数据，不过需要filterId对应
    let newResultData = resultDataRef.current.map(dataItem => {
      // 处理数据找到相同filterId，将从过滤名单来的数据加入resultData
      data.forEach((filItem) => {
        if (filItem.filterId == dataItem.filterId) {
          let infos = [...(dataItem.infos ?? []), { ...filItem, retrieval: false }]
          dataItem.infos = infos.sort((a, b) => Number(b.similarity || 0) - Number(a.similarity || 0));
        }
      })
      return dataItem
    })
    newResultData = newResultData.filter(item => (item.infos?.length || 0) > 0)
    newResultData.forEach((item, index) => (item.index = newResultData.length - index))
    setResultData([...newResultData])
    const newFilterData = handleSetFilter(ajaxFormDataRef.current.targetType, newResultData)
    setFilterData(newFilterData)
    setTrackData([...newFilterData])
    if (cardResultVisible) {
      const data = handleCardResultData(handleSetFilter(ajaxFormDataRef.current.targetType, newResultData))
      // console.log(data)
      setCardResultData(data)
    }
  }
  // console.log(filterData.map(el => el.infos?.map(elem => elem.infoId)).flat())

  return (
    <div className={`${prefixCls} page-content`}>
      <div className={`${prefixCls}-content`} ref={boxRef}>
        {/* 地图 */}
        {/* ajaxFormData.sort.order === 'asc' ? (filterData.length - 1) - (index || 0) : index */}
        <CrossMap
          selectedIndex={selectedIndex}
          onSelectedChange={(index) => {
            setSelectedIndex(index)
          }}
          trackData={ajaxFormData.sort.order === 'asc' ? [...trackData].reverse() : trackData}
          onAddFilterate={handleAddFilterate}
          onOpenBigImg={handleOpenBigImg}
        />
        {/*  */}
        {beforAjax ? "" : <ResulType />}
        {/* 左侧表单栏 */}
        <BoxDrawer
          title="跨镜追踪"
          placement="left"
          onOpen={() => setLeftDrawerVisible(true)}
          onClose={() => setLeftDrawerVisible(false)}
          visible={leftDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          <div className="retrieval-form">
            <Form colon={false} layout="vertical">
              <div onDragOver={handleImgDragOver} onDrop={handleImgDrop} onDragLeave={handleImgDragLeave}>
                <Form.Item className="upload-area" label="上传目标（最多可上传5个目标）">
                  <ImgUpload
                    ref={imgUploadRef}
                    limit={5}
                    multiple={true}
                    showConfirmBtn={false}
                    // innerSlot={<UploadButton />}
                    flushHistory={flushHistory}
                    onFlushHistoryComplete={() => { setFlushHistory(false) }}
                    featureList={featureList}
                    onChange={handleChangeFeatureList}
                    disabled={uploadDisabled}
                  />
                </Form.Item>
              </div>
              <TimeRangePicker
                formItemProps={{ label: '时间范围' }}
                beginDate={formData.beginDate}
                endDate={formData.endDate}
                beginTime={formData.beginTime}
                endTime={formData.endTime}
                onChange={handleDateChange}
                timeLayout="vertical"
              />
            </Form>
            <Form colon={false} labelAlign="left">
              <LocationMapList
                defaultListType={defaultListType}
                formItemProps={{ label: '数据源', }}
                locationIds={formData.locationIds}
                locationGroupIds={formData.locationGroupIds}
                offlineIds={formData.fileId}
                onChange={handleLocationChange}
                tagTypes={dictionary.tagTypes.slice(0, 2)}
              />
              <Form.Item
                label="相似度阈值"
              // colon={false}
              >
                <Slider
                  value={formData.similarity}
                  min={Number(pageConfig.threshold?.min) || 0}
                  max={Number(pageConfig.threshold?.max) || 100}
                  showInput={true}
                  onChange={handlesimilarityChange}
                />
              </Form.Item>
              {/* <Form.Item
                label="实时追踪"
                colon={false}
              >
                <Switch
                  checked={formData.realTimeTracking}
                  onChange={handleRealTimeTrackingChange}
                  checkedChildren={'启用'}
                  unCheckedChildren={'关闭'}
                />
              </Form.Item> */}
            </Form>
          </div>
          <div className="retrieval-btn">
            {/* {
              searching ?

            } */}
            <Button type="primary" onClick={handleBtnClick} loading={ajaxLoading || searching}>查询</Button>
          </div>
        </BoxDrawer>
        {/* 右侧结果 */}
        <BoxDrawer
          title={<><div>轨迹信息</div><FilterBtn /></>}
          placement="right"
          onOpen={() => setRightDrawerVisible(true)}
          onClose={() => setRightDrawerVisible(false)}
          visible={rightDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          <div className="result-header">
            <TargetTypeSelect />
            <TimeSortBtn />
          </div>
          <div className="result-con" ref={virtualBoxRef}>
            <ResultBox
              loading={ajaxLoading || (searching && !filterData.length)}
              nodata={!filterData || (filterData && !filterData.length)}
              nodataTip={beforAjax ? "" : "搜索结果为空"}
              nodataClass={beforAjax ? "first-coming" : ""}
            >
              {
                !cardResultVisible ?
                  <VirtualList
                    data={filterData}
                    itemKey={(item) => item.index}
                    height={virtualBoxHeight}
                    itemHeight={258}
                  >
                    {
                      (item, index) => {
                        return (
                          <div>
                            <Card.Identify
                              key={item.index}
                              cardData={item}
                              onImgClick={(e, data, i) => handleOpenBigImg(e, data, i, index)}
                              checked={selectedIndex === (item.index)}
                              onCardClick={(e, data,) => handleCardClick(e, data, item.index)}
                              locationCanClick={false}
                              onAddFilterate={handleAddFilterate}
                            />
                          </div>
                        )
                      }
                    }
                  </VirtualList>
                  : null
              }
            </ResultBox>
          </div>
        </BoxDrawer>

        <div
          className={classNames("card-result card-result-panel", {
            'open': cardResultVisible
          })}
        >
          <div className="card-result-header">
            <div className="title">轨迹信息</div>
            <div className="btns">
              <Space size={16}>
                <ResulType />
                <TargetTypeSelect />
                <TimeSortBtn />
                <FilterBtn />
              </Space>
            </div>
          </div>
          <div className="card-result-content">
            <ResultBox
              loading={ajaxLoading}
              nodata={!filterData || (filterData && !filterData.length)}
              nodataTip={beforAjax ? "" : "搜索结果为空"}
              nodataClass={beforAjax ? "first-coming" : ""}
            >
              {
                cardResultVisible ? handleRenderCard()
                  : ''
              }
            </ResultBox>
          </div>
        </div>
      </div>
      <BigImg
        modalProps={{
          visible: bigImgVisible,
          onCancel: () => setBigImgVisible(false)
        }}
        currentIndex={bigImgIndex}
        data={bigImgData}
        onIndexChange={(index) => {
          setBigImgIndex(index)
        }}
      />
      <FilterateModal
        taskId={taskId}
        modalProps={{
          visible: filterateVisible,
          onCancel: () => setFilterateVisible(false)
        }}
        onDelChange={handleFilterateDelChange}
      />
      {
        bottomRightMapVisible &&
        <BottomRight
          name={bottomCurrentData.locationName || '--'}
          lat={bottomCurrentData.lngLat?.lat || null}
          lng={bottomCurrentData.lngLat?.lng || null}
          onClose={() => { setBottomRightMapVisible(false) }}
        />
      }
    </div >
  )
}

export default Cross
