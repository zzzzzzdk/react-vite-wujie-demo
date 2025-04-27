import React, { useEffect, useState, useRef, useCallback } from "react";
import { Radio, Form, Space, Button, Pagination, Tag, Checkbox, Select, Modal, Loading, Message } from '@yisa/webui'
import { ExclamationCircleFilled } from '@yisa/webui/es/Icon'
import { CheckboxValueType } from '@yisa/webui/es/Checkbox/Group'
import { TargetType } from "@/config/CommonType";
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import { PlateValueProps } from "@/components/FormPlate/interface";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { LocationMapListCallBack } from "@/components/LocationMapList/interface";
import { TimeRangePicker, LocationMapList, Card, FormPlate, BigImg, BottomRight } from "@/components";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import GaitSequenceModal from '@/components/GaitSequence/Modal'
import character from "@/config/character.config";
import ajax, { ApiResponse } from '@/services'
import { ResultRowType } from "@/pages/Search/Target/interface";
import dayjs from 'dayjs'
import { useSelector, RootState } from '@/store';
import './index.scss'
import { Props, PortraitFormDataType } from '../../interface'
import PortraitResult from "./PortraitResult";
import dictionary from '@/config/character.config'
enum GroupByTypes {
  GroupLicense = '1',//换成车辆
  GroupDate = '2',//同天换衣
  GroupClothes = '3',//衣着颜色分组
}
enum FaceTypes {
  FacePic = '-1',
  FaceCluter = '4'//聚类分组
}
const Portrait = (props: Props) => {
  const { data, searchData, portraitClusterCount, onTargetTypeChange, activeTargetType } = props
  console.log(activeTargetType)
  const prefixCls = 'record-detail-portrait'
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-detail-person'] || {}
  });
  // 目标类型
  const [targetType, setTargetType] = useState<TargetType>(activeTargetType as TargetType)
  const targetTypeRef = useRef<TargetType>(targetType as TargetType)
  const radioChange = useRef(true)
  targetTypeRef.current = targetType

  const ttd = character.targetTypes.map(item => ({ label: `${item.label}（${portraitClusterCount?.[item.value]}）`, value: item.value }))
  const targetTypeDisplay = character.hasGait ? ttd.concat({ label: `步态（${portraitClusterCount?.gait}）`, value: "gait" }) : ttd
  // 

  let defaultFormData: PortraitFormDataType = {
    type: character.targetTypes[0]?.value as TargetType,
    timeType: 'time',
    beginDate: "",
    endDate: "",
    // beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    // endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    offlineIds: [],
    licensePlate: '',
    noplate: '',
    clusterType: data.groupPlateId && data.groupPlateId.length ? '2' : '1',
    plateColorTypeId: -1,
    pageNo: 1,
    pageSize: 42,
  }
  const [ajaxLoading, setAjaxLoading] = useState(false)

  const [formData, setFormData] = useState<PortraitFormDataType>(defaultFormData)

  const [resultData, setResultData] = useState<ApiResponse<ResultRowType[]>>({
    data: [],
    totalRecords: 0,
    usedTime: 0,
  })

  // 大图数据
  const [bigImgData, setBigImgData] = useState<ResultRowType[]>([])
  const bigImgDataRef = useRef<ResultRowType[]>()
  // 改变时间范围
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
  // 修改车牌
  const handlePlateChange = ({ plateNumber, plateTypeId, noplate }: PlateValueProps, type: 'licensePlate' | "excludeLicensePlate1" | "excludeLicensePlate2") => {
    switch (type) {
      case "licensePlate":
        setFormData({
          ...formData,
          licensePlate: plateNumber,
          plateColorTypeId: plateTypeId,
          noplate: noplate,
        })
        break;
      default:
        break;
    }
  }
  // 改变点位
  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
      offlineIds: data.offlineIds
    })
  }

  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })
  // 步态序列大图展示
  const [gaitBigModal, setGaitBigModal] = useState(false)
  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)
  const currentData: ResultRowType = Array.isArray(resultData.data) && resultData.data[bigImgModal.currentIndex] ? resultData.data[bigImgModal.currentIndex] : ({} as ResultRowType)
  // 大图
  const handleOpenBigImg = (index: number) => {
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }
  // 关闭大图
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }
  // 打开右下角地图
  const handleLocationClick = (index: number) => {
    setBottomRightMapVisible(true)
    setBigImgModal({
      visible: false,
      currentIndex: index
    })
  }
  const handleDetailClick = (data: any, index: number) => {
    setBigImgData(data)
    bigImgDataRef.current = data
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }
  // 加入黑名单
  const handleAddBlack = (data: any) => {
    ajax.record.addBlackLists<{ groupId: string[], groupPlateId: string[] }, any>({ groupId: data.groupId ? [data.groupId] : [], groupPlateId: data.groupPlateId ? [data.groupPlateId] : [] })
      .then(res => {
        console.log(res);
        Message.success(res.message || '')
        getResultData(formData)
      })
  }
  // 一行展示几条数据
  const [listCount, setListCount] = useState(7)
  useEffect(() => {
    const calcListCount = () => {
      if (targetTypeRef.current == 'pedestrian' && pedestrianDataRef.current.pedestrianType[0] == GroupByTypes.GroupDate) return
      if (targetTypeRef.current == 'gait') return
      const itemWidth = 208
      const width = (document.querySelector('.result-data')?.clientWidth || 0) - 126 // 126为总间距
      const count = Math.floor(width / itemWidth)
      if (count >= 7 || count <= 2) {
        setListCount(count)
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

  // 修改分页
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData: PortraitFormDataType;
    if (pageSize !== formData.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...formData,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...formData,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setFormData(newFormData)
    getResultData(newFormData, { groupBy: faceType }, captureData)
  }
  // 分页配置
  const paginationConfig: PaginationProps = {
    disabled: ajaxLoading || !resultData.totalRecords,
    current: formData.pageNo,
    pageSize: formData.pageSize,
    total: resultData.totalRecords,
    showTotal: () => `共 ${resultData.totalRecords} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: [42, 98, 210],
    onChange: handlePageChange,
  };

  // 聚合弹窗数据
  const [faceCluterData, setFaceCluterData] = useState<ApiResponse<ResultRowType[]>>({
    data: []
  })
  // 聚合弹窗分页
  const [faceCluterPage, setFaceCluterPage] = useState({
    pageNo: 1,
    pageSize: character.pageSizeOptions[0],
  })
  // 聚合弹窗visible
  const [faceCluterVisible, setFaceCluterVisible] = useState(false)
  // 聚合数据请求loading
  const [faceCluterLoading, setFaceCluterLoading] = useState(false)
  const [cluterData, setCluterData] = useState({})
  // 点击聚合数
  const handlePortraitClick = (event: React.MouseEvent, cardData: any) => {
    event.stopPropagation()
    setFaceCluterVisible(true)
    setCluterData(cardData)
    getPortraitFaceCluterData(cardData)
  }

  // 切换目标类型
  const handleTargetTypeChange = useCallback((event: RadioChangeEvent, radioChangeFlag = false) => {
    radioChange.current = radioChangeFlag
    onTargetTypeChange?.(event.target.value)
    setTargetType(event.target.value)
    targetTypeRef.current = event.target.value
    // 恢复初始状态
    if (event.target.value == 'gait') {
      setListCount(1)
    } else {
      setListCount(7)
    }
    setPedestrianData({
      pedestrianType: [],
      coats: undefined,
      pants: undefined,
      captureCount: 0
    })
    setFaceType([FaceTypes.FacePic])
    setCarType(false)

    let newFormData: PortraitFormDataType = {
      ...formData,
      pageNo: 1,
      pageSize: 42,
    }
    setFormData(newFormData)

    getResultData(newFormData)
  }, [formData])

  // 人脸分组类型 -抓拍图像分组、聚类分组
  const [faceType, setFaceType] = useState<CheckboxValueType[]>([FaceTypes.FacePic])
  // 人脸-聚类组-某一抓拍组数据
  const [captureData, setCaptureData] = useState<ResultRowType | null>(null)
  // 人脸-聚类分组-点击抓拍图像
  const handleCaptureClick = (data: ResultRowType) => {
    setCaptureData(data)
    getResultData(formData, { groupBy: ['-1'] }, data)
  }

  // 人体-分组额外参数
  const [pedestrianData, setPedestrianData]: any = useState({
    pedestrianType: [],//分组类型 同天换衣、衣着颜色分组
    coats: undefined,//上衣颜色
    pants: undefined,//下衣颜色
    captureCount: 0
  })
  const pedestrianDataRef = useRef(pedestrianData)
  pedestrianDataRef.current = pedestrianData
  // 修改上衣颜色、下衣颜色
  const handleChangeSelect = (v: SelectCommonProps['value'], type: string) => {
    let newPedestrianData = Object.assign({}, pedestrianData, {
      [type]: v
    })
    setPedestrianData(newPedestrianData)
    getResultData(formData, { pedestrianData: newPedestrianData })
  }
  // 修改单选框人脸、人体
  const handleChangeCheckbox = (v: CheckboxValueType[], type: string) => {
    setListCount(7)
    let data;
    if (type == 'face') {
      // 人脸 ： 单选+必选
      if (v.length) {
        data = v.filter(ele => ele != faceType[0])
        setCaptureData(null)
        setFaceType(data)
        getResultData(formData, { 'groupBy': data })
      }
    } else if (type == 'pedestrian') {
      let newPedestrianData;
      // 人体 ： 单选+可不选
      if (v.length) {
        data = v.filter(ele => ele != pedestrianData.pedestrianType[0])
        newPedestrianData = Object.assign({}, pedestrianData, {
          pedestrianType: data,
          coats: undefined,//上衣颜色
          pants: undefined,//下衣颜色
          captureCount: 0
        })
        // 同天换衣展示一行
        if (data[0] == GroupByTypes.GroupDate) setListCount(1)
      } else {
        newPedestrianData = Object.assign({}, pedestrianData, {
          pedestrianType: [],
          coats: undefined,//上衣颜色
          pants: undefined,//下衣颜色
          captureCount: 0
        })
      }
      setPedestrianData(newPedestrianData)
      getResultData(formData, { pedestrianData: newPedestrianData })
    }
  }
  // 人体-点击抓拍天数
  const handleCaptureDateClick = (data: any) => {
    console.log(data, 'data');

    let newPedestrianData = Object.assign({}, pedestrianData, {
      coats: data.coatId && data.coatId != 99 ? data.coatId : -1,
      pants: data.pantsId && data.pantsId != 99 ? data.pantsId : -1,
      captureCount: data.dateCount
    })
    setPedestrianData(newPedestrianData)
    getResultData(formData, { pedestrianData: newPedestrianData })
  }

  // 汽车-换乘车辆
  const [carType, setCarType] = useState(false)
  // 修改是否换乘车辆
  const handleCheckedCarChange = (v: CheckboxChangeEvent) => {
    setCarType(v.target.checked)
    getResultData(formData, { 'groupBy': v.target.checked ? GroupByTypes.GroupLicense : '-1' })
  }

  //格式化请求参数
  const formFormat = (form: PortraitFormDataType) => {
    let newForm = { ...form }
    // 格式化日期参数
    let timeRange = {}
    if (form.timeType === 'time') {
      timeRange = { times: [form.beginDate, form.endDate] }
    } else {
      timeRange = {
        periods: {
          dates: [form.beginDate, form.endDate],
          times: [form.beginTime, form.endTime]
        }
      }
    }
    newForm['timeRange'] = timeRange
    // 点位和文件ids
    // newForm['locationIds'] = [...form.locationIds, ...form.locationGroupIds]
    // 过滤掉checkedOfflineIds中的任务id
    newForm['fileId'] = form.offlineIds.filter(item => !`${item}`.includes('jobId-'))
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "type", "offlineIds"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }

  // 获取人脸数据
  const getPortraitFaceData = (formData: any, id?: string) => {
    let resultData = formFormat(formData)
    const delKeys = ["licensePlate", "noplate", "plateColorTypeId", "pedestrianType"]
    delKeys.forEach(key => delete resultData[key])
    ajax.record.getPortraitFaceData<PortraitFormDataType, ResultRowType[]>({
      ...resultData,
      ...data,
      groupId: id ? [id] : data.groupId
    })
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        if (res.data) {
          setBigImgData(res.data)
          bigImgDataRef.current = res.data
        }
      })
      .catch(() => {
        setAjaxLoading(false)
      })
  }
  // 获取人脸聚类数据
  const getPortraitFaceCluterData = (formData: any, pageData: PaginationProps = faceCluterPage) => {
    setFaceCluterLoading(true)
    ajax.record.getPortraitFaceCluterData<{ ids: string[] }, ResultRowType[]>({
      ids: formData.ids,
      // ...pageData
    })
      .then(res => {
        setFaceCluterData(res)
        setFaceCluterLoading(false)
        if (res.data) setBigImgData(res.data)
      })
      .catch(() => {
        setFaceCluterLoading(false)
      })
  }
  // 获取人体数据
  const getPortraitPersonData = (formData: any, type: string) => {
    let resultData = formFormat(formData)
    const delKeys = ["licensePlate", "noplate", "plateColorTypeId", "pedestrianType"]
    delKeys.forEach(key => delete resultData[key])
    ajax.record.getPortraitPersonData<PortraitFormDataType, ResultRowType[]>({
      ...resultData,
      ...data
    })
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        // if(type){

        // }else{
        if (res.data) {
          setBigImgData(res.data)
          bigImgDataRef.current = res.data
        }
        // }
      })
      .catch(() => {
        setAjaxLoading(false)
      })
  }
  // 获取二轮车数据
  const getPortraitBicycleData = (formData: any) => {
    let resultData = formFormat(formData)
    const delKeys = ["licensePlate", "plateColorTypeId", "noplate"]
    delKeys.forEach(key => delete resultData[key])
    ajax.record.getPortraitBicycleData<PortraitFormDataType, ResultRowType[]>({
      ...resultData,
      ...data,
    })
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        if (res.data) {
          setBigImgData(res.data)
          bigImgDataRef.current = res.data
        }
      })
      .catch(() => {
        setAjaxLoading(false)
      })
  }
  // 获取三轮车数据
  const getPortraitTricycleData = (formData: any) => {
    let resultData = formFormat(formData)
    const delKeys = ["licensePlate", "plateColorTypeId", "noplate"]
    delKeys.forEach(key => delete resultData[key])
    ajax.record.getPortraitTricycleData<PortraitFormDataType, ResultRowType[]>({
      ...resultData,
      ...data,
    })
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        if (res.data) {
          setBigImgData(res.data)
          bigImgDataRef.current = res.data
        }
      })
      .catch(() => {
        setAjaxLoading(false)
      })
  }
  // 获取汽车数据
  const getPortraitVehicleData = (formData: any) => {
    let resultData = formFormat(formData)
    const delKeys = ["licensePlate", "pedestrianType"]
    delKeys.forEach(key => delete resultData[key])
    ajax.record.getPortraitVehicleData<PortraitFormDataType, ResultRowType[]>({
      ...resultData,
      ...data,
      licensePlate2: formData.licensePlate
    })
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        if (res.data) {
          setBigImgData(res.data)
          bigImgDataRef.current = res.data
        }
      })
      .catch(() => {
        setAjaxLoading(false)
      })
  }
  // 获取步态数据
  const getPortraitGaitData = (formData: any) => {
    let resultData = formFormat(formData)
    const delKeys = ["licensePlate", "plateColorTypeId", "noplate"]
    delKeys.forEach(key => delete resultData[key])
    ajax.record.getPortraitGaitData<PortraitFormDataType, ResultRowType[]>({ ...resultData, ...data })
      .then(res => {
        setAjaxLoading(false)
        setResultData(res)
        if (res.data) {
          setBigImgData(res.data)
          bigImgDataRef.current = res.data
        }
      })
      .catch(() => {
        setAjaxLoading(false)
      })
  }

  // 获取数据
  const getResultData = (data: PortraitFormDataType, typeData: any = {}, cardData?: any) => {
    let formData: any = data;
    let dateRangeMax = Number(pageConfig.timeRange?.max || 0)
    if (dateRangeMax) {
      let timeDiff = dayjs(formData.endDate).diff(dayjs(formData.beginDate), 'days') + 1
      if (timeDiff > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
        return
      }
    }
    // 人脸
    if (targetTypeRef.current == 'face') {
      formData = { ...formData, groupBy: typeData.groupBy?.join(',') || faceType.join(',') }
      getPortraitFaceData(formData, cardData?.groupId)
    } else if (targetTypeRef.current == 'pedestrian') {
      // 人体
      let type = ''
      console.log('typeData', typeData)
      if (typeData.pedestrianData) {
        if (typeData.pedestrianData.captureCount) {
          type = 'capture'
        }
        formData = { ...formData, ...typeData.pedestrianData, groupBy: typeData.pedestrianData.pedestrianType.join(',') }
      } else {
        formData = { ...formData, ...pedestrianData, groupBy: pedestrianData.pedestrianType.join(',') }
      }
      getPortraitPersonData(formData, type)
    } else if (targetTypeRef.current == 'vehicle') {
      // 车辆
      if (typeData.groupBy) {
        // debugger
        formData = { ...formData, ...typeData }
      } else {
        formData = { ...formData, 'groupBy': carType ? GroupByTypes.GroupLicense : '' }
      }
      getPortraitVehicleData(formData)
    } else if (targetTypeRef.current == 'bicycle') {
      getPortraitBicycleData(formData)
    } else if (targetTypeRef.current == 'tricycle') {
      getPortraitTricycleData(formData)
    } else if (targetTypeRef.current == 'gait') {
      getPortraitGaitData(formData)
    }
    setAjaxLoading(true)
  }

  // 查询
  const handleSearchBtnClick = () => {
    console.log(formData, 'formData');
    let newFormData: PortraitFormDataType = {
      ...formData,
      pageNo: 1,
      pageSize: 42,
    }
    setCaptureData(null)
    setFormData(newFormData)
    getResultData(newFormData)
  }

  useEffect(() => {
    console.log(searchData);
    // 跳转过来
    if (searchData.type) {
      setTargetType(searchData.type)
      targetTypeRef.current = searchData.type
      if (searchData.type == 'pedestrian') {
        let newPedestrianData = Object.assign({}, pedestrianData, {
          pedestrianType: searchData.pedestrianType,
          coats: searchData.data?.coatId || undefined,//上衣颜色
          pants: searchData.data?.pantsId || undefined,//下衣颜色
          captureCount: searchData.data?.dateCount || 0
        })
        setPedestrianData(newPedestrianData)

        let newFormData = { ...formData }
        if (searchData.timeRange) {
          const { times } = searchData.timeRange
          newFormData = {
            ...newFormData,
            beginDate: times[0] || '',
            endDate: times[1] || '',
            timeRange: searchData.timeRange
          }
          setFormData(newFormData)
        }
        if (searchData.showCount) {
          setCaptureData(searchData.data || {})
          getResultData(newFormData, { groupBy: ['3'], pedestrianData: newPedestrianData })
          return
        }
        getResultData(newFormData, { pedestrianData: newPedestrianData })
        if (searchData.pedestrianType[0] == GroupByTypes.GroupDate) setListCount(1)
      } else if (searchData.type == "vehicle") {
        let newFormData = Object.assign({}, formData, {
          ...searchData.plateData
        })
        setFormData(newFormData)
        getResultData(newFormData)
      }
    } else {
      handleSearchBtnClick()
    }
  }, [])
  useEffect(() => {
    if (radioChange.current) {
      radioChange.current = false
      return
    }
    const targetTypesValue = character.hasGait ? character.targetTypes.map(item => item.value).concat("gait") : character.targetTypes.map(item => item.value)
    if (targetTypesValue.includes(activeTargetType || "")) {
      handleTargetTypeChange({ target: { value: activeTargetType } } as any)
    }
  }, [activeTargetType])



  // 聚合数据分页 暂时不需要
  const handleCluterPageChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData: PortraitFormDataType;
    if (pageSize !== formData.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...formData,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...formData,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setFaceCluterPage(newFormData)
    getPortraitFaceCluterData(cluterData, newFormData)
  }
  const paginationClutertConfig: PaginationProps = {
    current: faceCluterPage.pageNo,
    pageSize: faceCluterPage.pageSize,
    total: faceCluterData.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: character.pageSizeOptions,
    onChange: handleCluterPageChange,
  };

  const handleOpenGaitSequence = (j: number) => {
    setGaitBigModal(true)
    setBigImgModal({
      visible: false,
      currentIndex: j
    })
  }
  const handleFilterChange = (data: ResultRowType) => {
    const { licensePlate2, plateColorTypeId2 } = data
    const _newForm: PortraitFormDataType = {
      ...formData,
      licensePlate: licensePlate2,
      plateColorTypeId: plateColorTypeId2,
      pageNo: 1,
      pageSize: 42
    }
    setCaptureData(null)
    setCarType(false)
    setFormData(_newForm)
    getResultData(_newForm, { groupBy: "-1" })
    // setFormData(newFormData)
    // getResultData(newFormData)
  }
  return <div className={`${prefixCls}`}>
    <div className={`${prefixCls}-top`}>
      <div className={`${prefixCls}-header`}>
        <Form layout="vertical">
          <Form.Item
            label="目标类型"
            className="target-type"
            colon={false}
          >
            <Radio.Group
              disabled={ajaxLoading}
              optionType="button"
              options={
                targetTypeDisplay
                // [...character.targetTypes, { label: "步态", value: 'gait' }]
              }
              onChange={(e) => { handleTargetTypeChange(e, true) }}
              value={targetType}
            />
          </Form.Item>
          <TimeRangePicker
            formItemProps={{ label: '时间范围' }}
            beginDate={formData.beginDate}
            endDate={formData.endDate}
            beginTime={formData.beginTime}
            endTime={formData.endTime}
            onChange={handleDateChange}
            allowClear={true}
          />
          {/* <div className="plate-top">
            {
              targetType == "vehicle" ?
                <Form.Item colon={false} label={'车牌号码'}>
                  <FormPlate
                    // horizontalDis={-20}
                    key={'top'}
                    className="plate"
                    isShowKeyboard
                    value={{
                      plateNumber: formData.licensePlate,
                      plateTypeId: formData.plateColorTypeId,
                      noplate: (formData.noplate as 'noplate' | '')
                    }}
                    onChange={(value) => { handlePlateChange(value, "licensePlate") }}

                  />
                </Form.Item>
                : null
            }
          </div> */}
          <LocationMapList
            formItemProps={{ label: '数据源' }}
            locationIds={formData.locationIds}
            locationGroupIds={formData.locationGroupIds}
            offlineIds={formData.offlineIds}
            onChange={handleLocationChange}
            tagTypes={dictionary.tagTypes.slice(0, 2)}
          />
          <div className="plate-bottom">
            {
              targetType == "vehicle" ?
                <Form.Item colon={false} label={'车牌号码'}>
                  <FormPlate
                    key={'bottom'}
                    // horizontalDis={-10}
                    className="plate"
                    isShowKeyboard
                    value={{
                      plateNumber: formData.licensePlate,
                      plateTypeId: formData.plateColorTypeId,
                      noplate: (formData.noplate as 'noplate' | '')
                    }}
                    onChange={(value) => { handlePlateChange(value, "licensePlate") }}

                  />
                </Form.Item>
                : null
            }
          </div>


          <Form.Item colon={false} label={' '} style={{ marginLeft: 'auto' }}>
            <Space size={16}>
              <Button
                loading={ajaxLoading}
                onClick={handleSearchBtnClick}
                type='primary'
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
        {/* {
        isGroup ? <div className="group-info">
          <div>分组筛选条件</div>
          <div className="del-filter">全部删除</div>
        </div>
          : null
      } */}
      </div>
      <div className={`${prefixCls}-content`}>
        <div className="result-total">
          <div className="total-num">
            共<span>{ajaxLoading ? '···' : resultData.totalRecords}</span>条结果，用时<span>{ajaxLoading ? '···' : resultData.usedTime}</span>秒
          </div>
          <div className="result-groups">
            {
              targetType == 'face' ? <>
                <Checkbox.Group disabled={ajaxLoading} options={[{ label: '抓拍图像展示', value: FaceTypes.FacePic }, { label: '聚类组展示', value: FaceTypes.FaceCluter }]} onChange={(v) => handleChangeCheckbox(v, 'face')} value={faceType} />
                <Select
                  disabled={ajaxLoading}
                  options={[
                    { label: '抓拍人脸', value: '1' },
                    { label: '车中人脸', value: '2' },
                  ]}
                  value={formData.clusterType}
                  onChange={(e) => {
                    let newFormData = Object.assign({}, formData, {
                      clusterType: e
                    })
                    setFormData(newFormData)
                    getResultData(newFormData)
                  }}
                  // @ts-ignore
                  getTriggerContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
                {
                  captureData ? <Tag closable onClose={() => handleSearchBtnClick()}>抓拍图像：{captureData.captureCount}</Tag>
                    : null
                }
                <span className="tips"><ExclamationCircleFilled />聚合说明：相近3分钟内，同一点位的多张抓拍，聚合成一组</span>
              </> :
                targetType == 'pedestrian' ? <>
                  <Checkbox.Group options={[{ label: '同天换衣', value: GroupByTypes.GroupDate }, { label: '衣着颜色分组', value: GroupByTypes.GroupClothes }]} onChange={(v) => handleChangeCheckbox(v, 'pedestrian')} value={pedestrianData.pedestrianType} />
                  <Select
                    allowClear
                    defaultValue={pedestrianData.coats}
                    value={pedestrianData.coats}
                    disabled={pedestrianData.pedestrianType[0] == GroupByTypes.GroupDate}
                    options={character.colorOptions}
                    onChange={v => handleChangeSelect(v, 'coats')}
                    placeholder="请选择上衣颜色"
                    // @ts-ignore
                    getTriggerContainer={(triggerNode) =>
                      triggerNode.parentNode as HTMLElement
                    }
                  />
                  <Select
                    allowClear
                    defaultValue={pedestrianData.pants}
                    value={pedestrianData.pants}
                    disabled={pedestrianData.pedestrianType[0] == GroupByTypes.GroupDate}
                    options={character.colorOptions}
                    onChange={v => handleChangeSelect(v, 'pants')}
                    placeholder="请选择下衣颜色"
                    // @ts-ignore
                    getTriggerContainer={(triggerNode) =>
                      triggerNode.parentNode as HTMLElement
                    }
                  />
                  {
                    pedestrianData.captureCount ? <Tag closable onClose={() => {
                      let newPedestrianData = {
                        ...pedestrianData,
                        coats: undefined,//上衣颜色
                        pants: undefined,//下衣颜色
                        captureCount: 0
                      }
                      setPedestrianData(newPedestrianData)
                      let newFormData: PortraitFormDataType = {
                        ...formData,
                        pageNo: 1,
                        pageSize: 42,
                      }
                      setFormData(newFormData)
                      getResultData(newFormData, { pedestrianData: newPedestrianData })
                    }}>抓拍天数：{pedestrianData?.captureCount}</Tag>
                      : null
                  }
                </> : targetType == 'vehicle' ? <>
                  <Checkbox checked={carType} onChange={handleCheckedCarChange}>换乘车辆</Checkbox>
                </> : null
            }
          </div>
        </div>
        <div className={`result-data result-data-${targetType} result-data-pedestrian-${pedestrianData.pedestrianType.length ? pedestrianData.pedestrianType[0] : 0}`}>
          <PortraitResult
            resultData={resultData}
            ajaxLoading={ajaxLoading}
            listCount={listCount}
            targetType={targetType}
            faceType={faceType}
            captureData={captureData}
            pedestrianData={pedestrianData}
            onOpenBigImg={handleOpenBigImg}
            onCaptureClick={handleCaptureClick}
            onLocationClick={handleLocationClick}
            onPortraitClick={handlePortraitClick}
            onDetailClick={handleDetailClick}
            onCaptureDateClick={handleCaptureDateClick}
            onOpenGaitSequence={handleOpenGaitSequence}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
    <div className={`${prefixCls}-pagination`}>
      <Pagination {...paginationConfig} />
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
      data={bigImgData}
      isShowVideo={targetTypeRef.current == 'gait'}
    />
    {
      bottomRightMapVisible &&
      <BottomRight
        name={currentData.locationName || '--'}
        lat={currentData.lngLat?.lat || null}
        lng={currentData.lngLat?.lng || null}
        onClose={() => { setBottomRightMapVisible(false) }}
      />
    }
    <GaitSequenceModal
      modalProps={{
        visible: gaitBigModal,
        onCancel: () => setGaitBigModal(false)
      }}
      data={{ resultData: currentData, conditionData: currentData && Array.isArray(currentData.matches) && currentData.matches.length > 0 ? currentData.matches[0] : undefined }}
    />
    <Modal
      visible={faceCluterVisible}
      title="聚合图像"
      className={`${prefixCls}-cluter-modal`}
      width={1040}
      footer={<Button type='primary' onClick={() => setFaceCluterVisible(false)}>确认</Button>}
      onCancel={() => {
        setFaceCluterVisible(false)
        setBigImgData(bigImgDataRef.current || [])
      }}
    >
      <div className="cluter-body">
        <div className="title">共有<span>{faceCluterData.totalRecords}</span>个目标</div>
        <div className="content">
          {
            faceCluterLoading ? <div className="ajax-loading"><Loading spinning={true} /></div>
              : faceCluterData.data?.map((item: any, index: number) => {
                return <Card.Normal
                  showChecked={false}
                  key={item.infoId}
                  cardData={item}
                  onImgClick={() => {
                    handleOpenBigImg(index)
                  }}
                  onLocationClick={() => handleLocationClick(index)}
                  onPortraitClick={(e) => handlePortraitClick(e, item)}
                />
              })
          }
        </div>
        {/* <div className="cluter-pagination">
          <Pagination  {...paginationClutertConfig} />
        </div> */}
      </div>
    </Modal>
  </div>
}
export default Portrait
