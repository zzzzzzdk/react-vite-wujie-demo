import { useState, useRef, useEffect } from "react";
import { Button, Modal, Divider, Message, Form, Space, Slider, Checkbox, Pagination, Tooltip } from "@yisa/webui"
import { LoadingOutlined, PlusOutlined, ExclamationCircleFilled, DoubleBottomOutlined, DoubleTopOutlined } from '@yisa/webui/es/Icon'
import { ResultBox } from '@yisa/webui_business'
import { ImgUpload, TimeRangePicker, ResultHeader, ResultGroupFilter, FormRadioGroup, LocationMapList, GaitUpload, Collapse, JoinClue, Export, CreateTrackBtn, GlobalMeaasge } from '@/components'
import ImageResult from './Result'
import cn from 'classnames'
import { useResetState } from "ahooks";
import dayjs from 'dayjs'
import { useLocation } from "react-router-dom";
import ajax, { ApiResponse } from '@/services'
import { useSelector, useDispatch, RootState } from '@/store'
import { clearAll } from '@/store/slices/groupFilter';
import { isEmptyObject, isObject } from '@/utils/is'
import { formatTimeComponentToForm, formatTimeFormToComponent, getParams } from "@/utils";
import dictionary from '@/config/character.config'
import './index.scss'
import type { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox//Checkbox'
import type { DatesParamsType } from "@/components/TimeRangePicker/interface";
import type { LocationListType, LocationMapListCallBack } from '@/components/LocationMapList/interface'
import type { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import type { TargetFeatureItem, SortOrder, SortField } from '@/config/CommonType'
import type { ajaxFormDataType, FormDataType, YituResultDataType, YituResultType } from './interface'
import type { RefImgUploadType, UploadButtonProps } from "@/components/ImgUpload/interface";
import type { resultShowType, ResultRowType } from '@/pages/Search/Target/interface'
import { getLogData, logReport } from "@/utils/log";
import omit from "@/utils/omit";
import characterConfig from "@/config/character.config";
import { flushSync } from 'react-dom';
import { Link } from "react-router-dom";

export function UploadButton(props: UploadButtonProps) {
  const { load, innerSlot } = props
  return (
    <>
      {
        load ?
          <LoadingOutlined />
          :
          innerSlot ?
            typeof innerSlot == 'function' ? innerSlot() : innerSlot
            :
            <>
              <PlusOutlined />
              <div className="upload-text">上传目标</div>
            </>
      }
    </>
  )
}
const defaultPageConfig = {}
const Image = () => {

  const prefixCls = 'yitu-image'
  const location = useLocation()
  const dispatch = useDispatch()
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter
  })
  const { userInfo } = useSelector((state: RootState) => {
    return state.user
  })
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig.image || defaultPageConfig
  });
  const { skin } = useSelector((state: RootState) => {
    return state.comment
  })
  //权限配置
  const imageAuth = {
    uploadConfig: characterConfig.hasGait ? ["image", "gait"] : ["image"]
  }
  const [firstLoading, setFirstLoading] = useState(true)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [captureLoading, setCaptureLoading] = useState(false)
  const [personInfoLoading, setPersonInfoLoading] = useState(false)
  //刷新上传历史
  const [flushHistory, setFlushHistory] = useState(false)
  //步态图片切换弹窗提示
  const [switchimageTypeVisible, setSwitchimageTypeVisible] = useState(false)
  //结果栏展示图片还是分组表格
  const [resultShowType, setResultShowType] = useState<resultShowType>('image')
  //结果数据 , 抓拍信息，档案信息（结构可能会改）
  const [resultData, setResultData] = useState<ApiResponse<ResultRowType[], ResultRowType[]>>()
  const resultDataRef = useRef(resultData)
  resultDataRef.current = resultData

  const [resultPersonInfoData, setResultPersonInfoData] = useState<ApiResponse<ResultRowType[], ResultRowType[]>>()
  const resultPersonInfoDataRef = useRef(resultPersonInfoData)
  resultPersonInfoDataRef.current = resultPersonInfoData
  //已经选择的结果数据
  const [checkedList, setCheckedList] = useState<YituResultDataType>({
    personInfoData: [],
    data: []
  })
  // 结果选中
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  //加入线索库
  const [showClue, setShowClue] = useState(false)

  // 上传图片相关参数 , 这两种类型不兼容，虽然可以放两种数据，但是传递到组件的只能一种数据
  const [featureList, setFeatureList] = useState<(TargetFeatureItem | ResultRowType)[]>([])
  // console.log(featureList)
  const defaultFormData = {
    imageType: imageAuth?.uploadConfig?.length > 0 ? imageAuth?.uploadConfig[0] : dictionary.imageTypes[0].value,
    similarity: Number(pageConfig.threshold.default || 80),
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    offlineIds: [],
    faceType: "-1", //未选择携带-1
    gaitType: "-1", //未选择携带-1
    sort: {
      field: dictionary.yituSort[0].value,
      order: dictionary.yituSort[0].order,
    },
    groupFilters: [],
    pageNo: 1, //分页只有在表格分组的时候用到
    pageSize: dictionary.pageSizeOptions[0],
  }
  //其他表单数据参数
  const [formData, setFormData, resetFormData] = useResetState<FormDataType>(defaultFormData)
  const [defaultListType, setDefaultListType] = useState<LocationListType>(() => {
    const searchData = getParams(location.search)
    if (!isEmptyObject(searchData) && searchData.offlineIds) {
      return 'offline'
    } else {
      return 'region'
    }
  })
  //把所有的参数保存一份，用于检索
  const searchFormDataRef = useRef({
    ...formData,
    featureList
  })
  //上传组件
  const imgUploadRef = useRef<RefImgUploadType>(null)
  //上传固定容器
  const affix = useRef<HTMLDivElement>(null)
  //是否固定
  const [affixFlag, setAffixFlag] = useState(false)

  //#region 计算属性
  //检索按钮需要重置的参数
  const resetSliceResultFormData = {
    sort: {
      field: dictionary.yituSort[0].value,
      order: dictionary.yituSort[0].order,
    },
    pageNo: 1, //分页只有在表格分组的时候用到
    pageSize: dictionary.pageSizeOptions[0],
  }
  //人脸搜车，步态逻辑筛选 复选框是否禁用
  const _disabledFaceCheckbox = formData.imageType === "image" && featureList.findIndex(item => item.targetType === "face") < 0
  const _disabledGaitCheckbox = formData.imageType === "gait" && featureList.length <= 0
  //特征图只包含二三轮，车辆 ，作用之一用来控制折叠面板显隐,以及ReaultHeader组件的显示内容
  const carTargetTypes = dictionary.targetTypes.filter(item => item.value === 'vehicle' || item.value === "bicycle" || item.value === "tricycle")
  const _onlyIncludeCarFlag = searchFormDataRef.current.featureList.every(item => carTargetTypes.map(item => item.value).includes(item.targetType))
  //特征图是否只包含车辆 : 特征图全是车辆 | 勾选了人脸搜车选项
  const _onlyIncludeVehicleFlag = searchFormDataRef.current.featureList.every(item => item.targetType === "vehicle") || searchFormDataRef.current.faceType === "1"
  // 特征图只包含局部检索的数据，用来控制档案检索的请求和档案模块折叠面板的显隐
  const _onlyIncludeFeatureFlag = searchFormDataRef.current.featureList.every(item => item.hasOwnProperty("isFeature") && item.isFeature == true)
  //简写重复代码 ,还原默认多选框的值
  const resetCheckboxFormData = { ...formData, faceType: "-1", gaitType: "-1" }
  //两种数据总数
  const allDataRecords = (resultPersonInfoData?.personInfoDataRecords || 0) + (resultData?.totalRecords || 0)
  //两种数据共选择多少条
  const selectDataRecords = (checkedList?.personInfoData?.length || 0) + (checkedList?.data?.length || 0)
  //#endregion

  const [seeMore, setSeeMore] = useState(false)

  //格式化请求参数
  const formFormat = (form: ajaxFormDataType) => {
    let newForm = { ...form }
    // 格式化日期参数
    newForm['timeRange'] = formatTimeComponentToForm(newForm)
    //格式化多选框
    form.faceType === "1" && (newForm['vehicleByFace'] = 1)
    form.faceType === "2" && (newForm['qualityFilter'] = 1)
    form.gaitType === "1" && (newForm['gaitFilter'] = 1)
    // 点位和任务ids
    newForm['locationIds'] = [...form.locationIds, ...form.locationGroupIds]
    newForm['fileId'] = form.offlineIds
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "locationGroupIds", "offlineIds", "faceType", "gaitType"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }

  //检索
  const handleSearchBtnClick = () => {
    if (!featureList.length) {
      // Message.warning("请上传图片或选择步态特征")
      Message.warning("请上传图片")
      return
    }
    if (dayjs(formData.endDate).diff(dayjs(formData.beginDate), "day") + 1 > Number(pageConfig.timeRange.max)) {
      Message.warning(`时间范围不可以超过${pageConfig.timeRange.max || 0}天！`);
      return
    }
    firstLoading && setFirstLoading(false)
    //清空筛选条件
    dispatch(clearAll())
    setResultPersonInfoData(() => ({
      personUsedTime: 0,
      personInfoDataRecords: 0,
      personInfoData: []
    }))
    setResultData(() => ({
      data: [],
      totalRecords: 0,
      usedTime: 0,
    }))
    setResultShowType("image")
    const _ajaxFormData = {
      ...formData,
      featureList: [...featureList],
      ...resetSliceResultFormData,
      groupFilters: []
    }
    setFormData({ ...formData, ...resetSliceResultFormData, groupFilters: [] })
    searchFormDataRef.current = _ajaxFormData

    search(_ajaxFormData)

  }
  //ajax请求 , newForm 合并所有请求参数，包括特征数组，表单数据，可能有分组和排序
  const search = async (newForm: ajaxFormDataType, captureLoading?: boolean, pnQuery?: boolean) => {
    //重置选中状态
    resetChecked()

    const _newForm = formFormat(newForm)
    // captureLoading === undefined ? setAjaxLoading(true) : setCaptureLoading(captureLoading)

    try {
      setCaptureLoading(true)
      ajax.image.getImageList<FormDataType, ResultRowType[], ResultRowType[]>(_newForm).then(res => {
        const newRes = {
          ...resultDataRef.current,
          ...res,
          data: res.data ?
            res.data?.map((item, index) => ({ ...item, sortT: searchFormDataRef.current.pageSize * (searchFormDataRef.current.pageNo - 1) + index + 1 }))
            : []
        }
        setResultData(() => newRes)
        setAjaxLoading(false)
        setCaptureLoading(false)
      }).catch(err => {
        setResultData({})
        setAjaxLoading(false)
        setCaptureLoading(false)
      })

      // 分页不重新请求档案信息
      if (pnQuery) {
        return
      }

      const onlycar = newForm.featureList.every(item => carTargetTypes.map(item => item.value).includes(item.targetType))
      const onlyfeature = newForm.featureList.every(item => item.hasOwnProperty("isFeature") && item.isFeature == true)

      if (!captureLoading && !onlycar && !onlyfeature) {
        // 获取人员档案信息
        setPersonInfoLoading(true)
        // ajax.image.getPersonIdentify<FormDataType, ResultRowType[], ResultRowType[]>(
        //   _newForm,
        //   // (loading: boolean) => loading ? GlobalMeaasge.showLoading() : GlobalMeaasge.hideLoading()
        // ).then(res => {
        //   setPersonInfoLoading(false)
        //   setResultPersonInfoData(res)
        // }).catch(err => {
        //   console.log(err)
        //   setPersonInfoLoading(false)
        //   setResultPersonInfoData({})
        // })

        // ----档案数据
        ajax.image.getPersonIdCard<FormDataType, ResultRowType[], ResultRowType[]>(
          _newForm,
        ).then(res => {
          setPersonInfoLoading(false)
          const newResult = {
            ...res,
            personInfoData: res.personInfoData?.map(item => ({ ...item, dataSource: "idCard" }))
          }
          setResultPersonInfoData(() => ({
            personUsedTime: (resultPersonInfoDataRef.current?.personUsedTime || 0) + (res.personUsedTime || 0),
            personInfoDataRecords: (resultPersonInfoDataRef.current?.personInfoDataRecords || 0) + (newResult.personInfoDataRecords || 0),
            personInfoData: resultPersonInfoDataRef.current?.personInfoData?.concat(newResult.personInfoData || [])
          }))
        }).catch(err => {
          console.log(err)
          setPersonInfoLoading(false)
        })
        // ----聚类数据
        ajax.image.getPersonCluster<FormDataType, ResultRowType[], ResultRowType[]>(
          _newForm,
        ).then(res => {
          setPersonInfoLoading(false)
          const newResult = {
            ...res,
            personInfoData: res.personInfoData?.map(item => ({ ...item, dataSource: "cluster" }))
          }
          setResultPersonInfoData(() => ({
            personUsedTime: (resultPersonInfoDataRef.current?.personUsedTime || 0) + (res.personUsedTime || 0),
            personInfoDataRecords: (resultPersonInfoDataRef.current?.personInfoDataRecords || 0) + (newResult.personInfoDataRecords || 0),
            personInfoData: resultPersonInfoDataRef.current?.personInfoData?.concat(newResult.personInfoData || [])
          }))
        }).catch(err => {
          console.log(err)
          setPersonInfoLoading(false)
        })
      }
    } catch (error) {
      console.log(error)

    }
  }
  //图片，步态类型切换
  const handleChangeimageType = (imageType: string) => {
    if (featureList.length) {
      setSwitchimageTypeVisible(true)
    } else {
      setFormData({ ...resetCheckboxFormData, imageType })
    }
  }
  //提示弹窗确认回调
  const handleSwitchimageType = () => {
    setFeatureList([])
    setFormData({ ...resetCheckboxFormData, imageType: formData.imageType === "image" ? "gait" : "image" })
    setSwitchimageTypeVisible(false)
  }
  //特征数组改变事件
  const handleChangeFeatureList = (list: (TargetFeatureItem | ResultRowType)[]) => {
    //存在人脸且未设置默认人脸类型 || 不存在人脸
    if (formData.imageType === "image") {
      if (formData.faceType === "-1" && list.findIndex(item => item.targetType === "face") >= 0) {
        setFormData({
          ...formData,
          faceType: dictionary.yituFilter.face.find(item => item.default)?.value || "-1"
        })
      } else if (list.findIndex(item => item.targetType === "face") < 0) {
        setFormData({
          ...formData,
          faceType: "-1"
        })
      }
      //存在步态目标且未设置步态类型
    } else if (formData.imageType === "gait"
      && formData.gaitType === "-1"
      && list.length) {
      setFormData({
        ...formData,
        gaitType: dictionary.yituFilter.gait.find(item => item.default)?.value || "-1"
      })
    } else if (!list.length) {
      setFormData({ ...resetCheckboxFormData })
    }
    setFeatureList(list)
  }

  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
      offlineIds: data.offlineIds
    })
  }
  const handlesimilarityChange = (similarity: number | number[]) => {
    setFormData({ ...formData, similarity })
  }
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
  //复选框是否勾选 ,做成单选可不选的方式
  const handleChecked = (e: CheckboxChangeEvent) => {
    const { checked, value } = e.target
    if (checked) {
      formData.imageType === "image" ?
        setFormData({ ...formData, faceType: value })
        :
        setFormData({ ...formData, gaitType: value })

    } else {
      formData.imageType === "image" ?
        setFormData({ ...formData, faceType: "-1" })
        :
        setFormData({ ...formData, gaitType: "-1" })
    }
  }

  //分组,过滤 , 分组过滤改变，重置分页，排序
  const handleGroupFilterChange = ({ filterTags = [] }: GroupFilterCallBackType) => {
    console.log('filterTags', filterTags)
    setFormData({ ...formData, groupFilters: filterTags, ...resetSliceResultFormData })
    searchFormDataRef.current = { ...searchFormDataRef.current, groupFilters: filterTags, ...resetSliceResultFormData }
    //所有表单数据
    // const _newForm = { ...formData, featureList, groupfilters: filterTags }
    search(searchFormDataRef.current, true)
    const showGroupTable = filterTags.length &&
      filterTags[filterTags.length - 1] &&
      filterTags[filterTags.length - 1].type === 'group' &&
      filterTags[filterTags.length - 1].value !== 'licensePlate1' &&
      filterTags[filterTags.length - 1].value !== 'licensePlate2'

    setResultShowType(showGroupTable ? 'group' : "image")
  }
  //时间，相似度排序
  const handleSortChange = (value: SortField, order: SortOrder | undefined) => {
    order && setFormData({ ...formData, sort: { field: value, order } })
    searchFormDataRef.current = { ...searchFormDataRef.current, sort: { field: value, order: order || "desc" } }
    search(searchFormDataRef.current, true)
  }

  //选中卡片回调
  const handleCheckedChange = ({ cardData, checked, type }: { cardData: ResultRowType, checked: boolean, type: YituResultType }) => {
    switch (type) {
      // case "person": {
      //   const isExist = checkedList?.personInfoData?.filter(item => item.infoId === cardData.infoId).length
      //   let newCheckedData = []
      //   if (isExist) {
      //     newCheckedData = checkedList.personInfoData?.filter(item => item.infoId !== cardData.infoId) || []
      //   } else {
      //     newCheckedData = checkedList.personInfoData?.concat(cardData) || []
      //   }
      //   setCheckedList({ ...checkedList, personInfoData: newCheckedData })
      //   //两种数据加起来的总和是否小于总数
      //   const _equalCountFlag = (checkedList?.data?.length || 0 + newCheckedData.length) < allDataRecords
      //   //是否半选
      //   setIndeterminate(!!newCheckedData.length && _equalCountFlag)
      //   //是否全选
      //   setCheckAll(!_equalCountFlag)
      // }
      //   break;
      case "target": {
        const isExist = checkedList?.data?.filter(item => item.infoId === cardData.infoId).length
        let newCheckedData = []
        if (isExist) {
          newCheckedData = checkedList.data?.filter(item => item.infoId !== cardData.infoId) || []
        } else {
          newCheckedData = checkedList?.data?.concat(cardData) || []
        }
        setCheckedList({ ...checkedList, data: newCheckedData })
        //两种数据加起来的总和是否小于总数
        // const _equalCountFlag = (checkedList?.personInfoData?.length || 0 + newCheckedData.length) < allDataRecords
        const _equalCountFlag = newCheckedData.length < (resultDataRef.current?.data?.length || 0)
        //是否半选
        setIndeterminate(!!newCheckedData.length && _equalCountFlag)
        //是否全选
        setCheckAll(!_equalCountFlag)
        break;
      }
      default:
        Message.warning(`未知的卡片类型${type}`)
        break;
    }
  }

  // 重置选中数据
  const resetChecked = () => {
    setCheckedList({ personInfoData: [], data: [] })
    setIndeterminate(false)
    setCheckAll(false)
  }
  //全选按钮
  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked
    if (checked && resultDataRef.current?.data) {
      const { data, personInfoData = [] } = resultDataRef.current
      setCheckedList({ personInfoData: [], data })
      setIndeterminate(false)
      setCheckAll(true)
    } else {
      resetChecked()
    }
  }

  // 分页改变
  const handleChangePn = (pn: number, pageSize: number) => {
    let newForm = formData.pageSize === pageSize ? { pageNo: pn } : { pageNo: 1, pageSize }
    //用户页面展示
    setFormData({ ...formData, ...newForm })
    //用户检索数据
    searchFormDataRef.current = { ...searchFormDataRef.current, ...newForm }
    search(searchFormDataRef.current, true, true)
  }

  //拖拽
  const handleImgDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }
  const handleImgDrop = (event: React.DragEvent) => {
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
    const data: ResultRowType = JSON.parse(_data)
    if (formData.imageType !== searchFormDataRef.current.imageType) {
      Message.warning("全目标特征与步态特征互斥")
      return
    }
    //判断是否有相同特征
    if (featureList.find(i => i.feature == data.feature)) {
      Message.warning("已添加该特征")
      return
    }
    if (formData.imageType === "image") {
      // const { feature, targetImage, targetType, detection: { x, y, w, h } } = data
      // const _newFeatureList = [...featureList, { feature, targetImage, targetType, x, y, w, h }]
      const _newFeatureList = [...featureList, data]
      //拖拽完之后应该是用最新参数重新检索一遍，分组筛选需要重置
      const _newForm = { ...formData, featureList: _newFeatureList, ...resetSliceResultFormData }
      setFeatureList(_newFeatureList)
      setFormData({ ...formData, ...resetSliceResultFormData })
      search(_newForm, true)
      //拖拽上传需要保存上传历史，保存之后需要请求新的历史
      ajax.saveUploadHistory({
        uid: userInfo.id,
        param: data
      }).then(res => setFlushHistory(true))
        .catch(err => Message.warning(err.message))
    } else if (formData.imageType === "gait") {
      //步态整条数据塞进去
      const _data: any = data
      const _newFeatureList = [...featureList, _data]
      const _newForm = { ...formData, featureList: _newFeatureList, ...resetSliceResultFormData }
      setFeatureList(_newFeatureList)
      setFormData({ ...formData, ...resetSliceResultFormData })
      search(_newForm)
    }
  }
  const [jumpData, setJumpData] = useState({
    to: '',
  })
  //同行分析与实时目标追踪
  const handleJump = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, link?: string) => {
    let flag = false, flag2 = false
    // if (checkedList.personInfoData) {
    //   flag = checkedList.personInfoData.every(item => (item.targetType === "face" || item.targetType === "pedestrian"))
    // }
    if (checkedList.data) {
      flag2 = checkedList.data.every(item => item.targetType === "face")
    }
    if (!flag2) {
      Message.warning("仅能选择人脸数据")
      event.preventDefault()
      return
    }
    if (link === "/cross" && selectDataRecords > 5) {
      Message.warning("最大支持5条数据")
      event.preventDefault()
      return
    } else if (selectDataRecords > 200) {
      Message.warning("最大支持200条数据")
      event.preventDefault()
      return
    }
    // const params = [...(checkedList.personInfoData || []), ...(checkedList.data || [])]
    const params = [...(checkedList.data || [])]
    //  日志上报
    logReport({
      type: 'image',
      data: {
        desc: `图片【${params.length}】-【批量操作：${link === "/real-time-tracking" ? '实时跨镜追踪' : '同行分析'}】`,
        data: params
      }
    })
    if (link === "/real-time-tracking") {
      const params = checkedList.data?.map(item => ({
        bigImage: item.bigImage,
        feature: item.feature,
        targetType: item.targetType,
        targetImage: item.targetImage
      }))
      setJumpData({
        to: `${link}?featureList=${encodeURIComponent(JSON.stringify(params))}`,
      })
      return
    }

    ajax.uploadTokenParams<{}, ApiResponse<string>>({
      params: { peerData: params }
    }).then(res => {
      if (res.data) {
        // setJumpData({
        //   to: `face-peer?token=${res.data}`,
        // })
        window.open(`/#/face-peer?id=${res.data}&type=batch`)
      } else {
        Message.warning(res.message || "")
      }
    }).catch(err => {
      Message.warning(err.message)
    })
  }

  //排序和导出结构
  const resultHeaderRightTemplate = (
    <Space>
      <FormRadioGroup
        disabled={ajaxLoading}
        isSort={true}
        defaultValue={formData.sort.field}
        defaultOrder={formData.sort.order}
        yisaData={dictionary.yituSort}
        onChange={handleSortChange}
      />
      <Export
        total={(resultData?.totalRecords || 0)}
        url={`/v1/comparison/image-search/export`}
        formData={{
          ...formFormat(searchFormDataRef.current),
          checkedIds: (checkedList.data ?? []).map(item => item.infoId),
          pageSize: (resultData?.totalRecords || formData.pageSize)
        }}
      />
    </Space>
  )
  const resultHeaderFilterTemplate = (
    <div className="filter">
      {filterTags.length ? <ResultGroupFilter.Show onChange={handleGroupFilterChange} /> : ''}
    </div>
  )
  useEffect(() => {
    let io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        setAffixFlag(true)
      } else {
        setAffixFlag(false)
      }
    })
    affix.current && io.observe(affix.current);
    return () => {
      affix.current && io.unobserve(affix.current)
    }
  }, [])

  function fileToDataURL(file: Blob) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    // reader 读取文件成功的回调
    reader.onload = function (e) {
      return reader.result
    }
  }
  // 页面跳转传参处理
  const handleParamsData = async () => {
    //所有跳转到以图的参数先进行编码
    const searchData = getParams(location.search)
    if (!isEmptyObject(searchData)) {
      let paramsFormData = {}
      //含有大图
      if (searchData.bigImage) {
        imgUploadRef.current && imgUploadRef.current?.handleAutoUpload?.({ bigImage: searchData.bigImage })
      }
      //特征数组 ,由于特征数组包含的字段太多，可能会有特殊字符，&等
      if (searchData.featureList) {
        //TODO：加上步态权限验证
        if (searchData.isGait) {
          paramsFormData["imageType"] = "gait"
        }
        try {
          let featureList = JSON.parse(searchData.featureList)
          featureList.forEach((item: any) => {
            if (item.isFeature) {
              console.log(item.targetImage)
              URL.revokeObjectURL(item.targetImage)
              console.log(item.targetImage)
              // console.log(fileToDataURL(item.targetImage))
              // item.targetImage = fileToDataURL(URL.revokeObjectURL(item.targetImage))
            }
          })
          setFeatureList(featureList)
        } catch (error) {
          console.log(error)
        }
      }
      //离线点位
      if (searchData.offlineIds) {
        try {
          paramsFormData['offlineIds'] = JSON.parse(searchData.offlineIds)
        } catch (error) {
          console.log(error)
        }
      }
      if (searchData.locationIds) {
        try {
          paramsFormData['locationIds'] = JSON.parse(searchData.locationIds)
        } catch (error) {
          console.log(error)
        }
      }
      if (searchData.locationGroupIds) {
        try {
          paramsFormData['locationGroupIds'] = JSON.parse(searchData.locationGroupIds)
        } catch (error) {
          console.log(error)
        }
      }
      setFormData({
        ...formData,
        ...paramsFormData
      })
      //操作日志
      if (searchData.token) {
        getLogData({ token: searchData.token }).then(res => {
          const { data } = res as any
          if (data && isObject(data)) {
            try {
              // 时间格式恢复
              if (data.timeRange) {
                formatTimeFormToComponent(data.timeRange, data)
              }
              if (Array.isArray(data.featureList)) {
                setFeatureList(data.featureList)
              }
              setFormData({
                ...formData,
                ...omit(data, ["featureList"])
              })
            } catch (error) {
              Message.error(`数据解析失败`)
            }
          }
        })
      }
      // token暂存
      if (searchData.id) {
        // setTokenLoading(true)
        await ajax.getTokenParams<{}, string>({
          token: searchData.id
        }).then(res => {
          // setTokenLoading(false)
          if (res.data) {
            try {
              const data: any = isObject(res.data) ? res.data : {}
              if (Array.isArray(data.featureList)) {
                flushSync(() => {
                  setFeatureList(data.featureList)
                })
              }
              paramsFormData = data
            } catch (error) {
              Message.error(`数据解析失败`)
            }
          }
        }).catch(err => {
          // setTokenLoading(false)
          Message.warning(err.message)
        })
      }
    }
  }

  // 切换查看更多状态
  const handleSwitchMore = () => {
    setSeeMore(!seeMore)
  }

  // 重置
  const handleReset = () => {
    resetFormData()
    setFeatureList([])
  }

  // 动态展示每行数据
  const [listCount, setListCount] = useState(4)
  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 430
      const width = (document.querySelector('.outcomes-wrapper')?.clientWidth || 0)
      const count = Math.floor(width / itemWidth)
      if (count >= 4 || count <= 2) {
        setListCount(count < 0 ? 4 : count)
      } else {
        const diff = width - itemWidth * count + 18 * (count - 1)
        if (diff >= itemWidth * (count / (count + 1))) {
          setListCount(count + 1)
        } else {
          setListCount(count)
        }
      }
      // console.log(count)
    }
    calcListCount()
    window.addEventListener('resize', calcListCount)

    return () => {
      window.removeEventListener('resize', calcListCount)
    }
  }, [])

  useEffect(() => {
    handleParamsData()
  }, [])

  useEffect(() => {
    //清空分组筛选条件
    dispatch(clearAll())
  }, [])

  return (
    <div className={`${prefixCls} page-content`}>
      <div className="page-top">
        <div className="retrieval">
          <div className="search">
            <div className="search-affix" ref={affix}>
              <div className={cn("search-img", { "affix": affixFlag })} onDragOver={handleImgDragOver} onDrop={handleImgDrop} >
                {/* {
                  imageAuth?.uploadConfig?.length > 1 && <ul className='search-img-type'>
                    {
                      dictionary.imageTypes.map(item => <li
                        key={item.value}
                        className={`${item.value === formData.imageType ? "type-item active" : "type-item"}`}
                        onClick={() => { handleChangeimageType(item.value) }}
                      >{item.label}</li>)
                    }
                  </ul>
                } */}
                <div className="search-img-upload">
                  {
                    formData.imageType === "image" ?
                      <ImgUpload
                        ref={imgUploadRef}
                        limit={5}
                        multiple={true}
                        showConfirmBtn={false}
                        innerSlot={<UploadButton />}
                        flushHistory={flushHistory}
                        onFlushHistoryComplete={() => { setFlushHistory(false) }}
                        featureList={featureList as TargetFeatureItem[]}
                        onChange={handleChangeFeatureList}
                      />
                      :
                      <GaitUpload
                        featureList={featureList as ResultRowType[]}
                        onChange={handleChangeFeatureList}
                      />
                  }
                </div>
                <div className="search-img-tip">
                  <span>注：最多可同时</span>
                  <span>上传5个目标</span>
                </div>
              </div>
            </div>
            <Space size={[16, 0]} wrap className="retrieval-form">
              <TimeRangePicker
                formItemProps={{ label: '时间范围' }}
                timeType={formData.timeType}
                beginDate={formData.beginDate}
                endDate={formData.endDate}
                beginTime={formData.beginTime}
                endTime={formData.endTime}
                onChange={handleDateChange}
              />
              <LocationMapList
                defaultListType={defaultListType}
                formItemProps={{ label: '数据源' }}
                locationIds={formData.locationIds}
                locationGroupIds={formData.locationGroupIds}
                offlineIds={formData.offlineIds}
                onChange={handleLocationChange}
              />
              <Form.Item
                label="相似度阈值"
                className="yitu-search-item"
                colon={false}
              >
                <Slider
                  min={Number(pageConfig.threshold.min === "" ? 60 : pageConfig.threshold.min)}
                  value={formData.similarity}
                  showInput={true}
                  onChange={handlesimilarityChange}
                />
              </Form.Item>
              <Form.Item
                label=" "
                colon={false}
              >
                <>
                  {
                    formData.imageType === "image" ?
                      dictionary.yituFilter.face.map(item => <Checkbox
                        checked={formData.faceType === item.value}
                        key={item.value}
                        value={item.value}
                        disabled={_disabledFaceCheckbox}
                        onChange={handleChecked}
                      >
                        {item.label}
                      </Checkbox>)
                      : ""
                    // formData.imageType === "gait" ?
                    //   dictionary.yituFilter.gait.map(item => <Checkbox
                    //     checked={formData.gaitType === item.value}
                    //     key={item.value}
                    //     value={item.value}
                    //     disabled={_disabledGaitCheckbox}
                    //     onChange={handleChecked}
                    //   >
                    //     {item.label}
                    //   </Checkbox>)
                    //   : ""
                  }
                </>
              </Form.Item>

              <Form.Item
                colon={false}
                label={' '}
                style={{ marginLeft: 'auto' }}
                className="retrieval-btn"
              >
                <Space size={16}>
                  <Button disabled={ajaxLoading} onClick={handleReset} type='default' className="reset-btn">重置</Button>
                  <Button
                    loading={ajaxLoading}
                    onClick={handleSearchBtnClick}
                    type='primary'
                  >
                    查询
                  </Button>
                </Space>
              </Form.Item>

            </Space>
          </div>
          {/* <div className="filter">
            {filterTags.length ? <ResultGroupFilter.Show onChange={handleGroupFilterChange} /> : ''}
          </div> */}
          <Divider />
        </div>
        <div className="outcomes">
          {/* {
            (!!resultData?.data?.length || !!resultData?.personInfoData?.length) && <ResultHeader
              targetType={_onlyIncludeVehicleFlag ? "vehicle" : "face"}
              pageType={_onlyIncludeCarFlag || resultShowType === "group" ? "target" : "yitu"}
              className="outcomes-header"
              resultData={resultData}
              rightSlot={resultShowType === "group" ? "" : resultHeaderRightTemplate}
              onGroupFilterChange={handleGroupFilterChange}
              groupFilterDisabled={ajaxLoading}
            />
          } */}
          <div className={`outcomes-wrapper`}>
            <ResultBox
              loading={false}
              nodata={firstLoading ? true : false}
              nodataTip={firstLoading ? "请尝试检索一下" : "搜索结果为空"}
              nodataClass={firstLoading ? `first-coming-${skin}` : ""}
            >
              {
                (!_onlyIncludeCarFlag && !_onlyIncludeFeatureFlag
                  // && resultShowType !== "group"
                ) &&
                <Collapse title={`档案信息（${resultPersonInfoData?.personInfoData?.length || 0}）`}>
                  <ResultBox
                    loading={personInfoLoading}
                    nodata={!resultPersonInfoData?.personInfoData?.length}
                    nodataTip={"搜索结果为空"}
                  >
                    <>
                      <ImageResult
                        type="person"
                        data={seeMore ? resultPersonInfoData?.personInfoData : resultPersonInfoData?.personInfoData?.slice(0, listCount)}
                        resultData={resultPersonInfoData}
                        checkedList={checkedList?.personInfoData}
                        onCheckedChange={handleCheckedChange}
                        onlyIncludeVehicleFlag={_onlyIncludeVehicleFlag}
                      />
                      {
                        (resultPersonInfoData?.personInfoData?.length || 0) > listCount ?
                          <div className="see-more" onClick={handleSwitchMore}>
                            <div className="see-more-con">{seeMore ? '收起' : '展开'}全部 {seeMore ? <DoubleTopOutlined /> : <DoubleBottomOutlined />}</div>
                          </div>
                          : ''
                      }
                    </>
                  </ResultBox>
                </Collapse>
              }


              {(!_onlyIncludeCarFlag && !_onlyIncludeFeatureFlag
                //  && resultShowType !== "group"
              ) ?
                <Collapse title={`抓拍信息（${resultData?.totalRecords || 0}）`}>
                  <ResultBox
                    loading={captureLoading}
                    nodata={!resultData?.data?.length}
                    nodataTip={"搜索结果为空"}
                  >
                    <ImageResult
                      type="target"
                      imageType={formData.imageType === "image" ? "image" : "gait"}
                      resultShowType={resultShowType}
                      data={resultData?.data}
                      resultData={resultData}
                      checkedList={checkedList?.data}
                      onCheckedChange={handleCheckedChange}
                      onGroupFilterChange={handleGroupFilterChange}
                      onlyIncludeVehicleFlag={_onlyIncludeVehicleFlag}
                      onlyIncludeCarFlag={_onlyIncludeCarFlag}
                      resultHeaderRightTemplate={resultHeaderRightTemplate}
                      resultHeaderFilterTemplate={resultHeaderFilterTemplate}
                      groupLoading={captureLoading}
                    />
                  </ResultBox>
                </Collapse>
                :
                <ResultBox
                  loading={captureLoading}
                  nodata={!resultData?.data?.length}
                  nodataTip={"搜索结果为空"}
                >
                  <ImageResult
                    type="target"
                    pageSize={formData.pageSize}
                    resultShowType={resultShowType}
                    data={resultData?.data}
                    resultData={resultData}
                    checkedList={checkedList?.data}
                    onCheckedChange={handleCheckedChange}
                    onGroupFilterChange={handleGroupFilterChange}
                    onlyIncludeVehicleFlag={_onlyIncludeVehicleFlag}
                    onlyIncludeCarFlag={_onlyIncludeCarFlag}
                    resultHeaderRightTemplate={resultHeaderRightTemplate}
                    resultHeaderFilterTemplate={resultHeaderFilterTemplate}
                    groupLoading={captureLoading}
                  />
                </ResultBox>
              }

            </ResultBox>
          </div>
        </div>
      </div>
      {
        resultPersonInfoData?.personInfoData?.length || resultData?.data?.length ?
          <div className="page-bottom">
            <div className='left'>
              <div className={cn("check-box", {
                "disabled": resultShowType === 'group'
              })}>
                <Checkbox
                  className="card-checked"
                  checked={checkAll}
                  indeterminate={indeterminate}
                  onChange={handleCheckAllChange}
                  disabled={resultShowType === 'group'}
                >
                  全选
                </Checkbox>
                已经选择<span className="num">{selectDataRecords}</span>项
              </div>
              {/* <Button disabled={!selectDataRecords || resultShowType === 'group'} size='small' >批量删除</Button> */}
              <Button disabled={!selectDataRecords || resultShowType === 'group'} size='small' onClick={() => { setShowClue(true) }}>加入线索库</Button>
              <CreateTrackBtn
                disabled={!selectDataRecords || resultShowType === 'group'}
                checkedList={[...(checkedList.data || [])]}
              />
              <span>
                <Button disabled={!selectDataRecords || resultShowType === 'group'} size='small' onClick={handleJump}>同行分析</Button>
              </span>
              <Tooltip title="仅可选取5个人脸目标" placement="top">
                <span className={!checkedList.data?.length || checkedList.data?.length > 5 || resultShowType === 'group' ? 'disabled' : ''}>
                  <Link
                    {...jumpData}
                    target="_blank"
                    onClick={(e) => handleJump(e, '/real-time-tracking')}
                    className={!checkedList.data?.length || checkedList.data?.length > 5 || resultShowType === 'group' ? 'disabled btn-link widther' : 'btn-link widther'}
                  >实时跨镜追踪</Link>
                </span>
              </Tooltip>
            </div>
            {
              resultShowType === "group" && <Pagination
                disabled={!resultData?.totalRecords || ajaxLoading}
                showSizeChanger
                showQuickJumper
                showTotal={() => `共 ${resultData?.totalRecords || 0} 条`}
                total={resultData?.totalRecords || 0}
                current={formData.pageNo}
                pageSize={formData.pageSize}
                pageSizeOptions={dictionary.pageSizeOptions}
                onChange={handleChangePn}
              />
            }
          </div>
          : ''
      }
      <Modal
        title='切换'
        className="image-switch-gait"
        visible={switchimageTypeVisible}
        onOk={handleSwitchimageType}
        onCancel={() => setSwitchimageTypeVisible(false)}
      >
        <ExclamationCircleFilled />切换{formData.imageType === "image" ? "步态目标" : "图片目标"}后，{formData.imageType === "image" ? "图片目标" : "步态目标"}将会清空，你确定要切换吗？
      </Modal>
      <JoinClue
        visible={showClue}
        clueDetails={[...(checkedList.data || []), ...(checkedList.personInfoData || [])]}
        onOk={() => { setShowClue(false) }}
        onCancel={() => { setShowClue(false) }}
      />
    </div >
  )
}

export default Image
