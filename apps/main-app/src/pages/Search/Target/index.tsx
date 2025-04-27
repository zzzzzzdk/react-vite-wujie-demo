import React, { useEffect, useState, useRef } from "react";
import { Radio, Form, Space, Button, Pagination, Select, Checkbox, Tooltip, Message } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import {
  TimeRangePicker,
  LocationMapList,
  FormPlateNumber,
  FormVehicleModel,
  ResultHeader,
  ResultGroupFilter,
  JoinClue,
  Export,
  CreateTrackBtn,
  ImportCubeModal,
} from "@/components";
import character from "@/config/character.config";
import { useResetState } from "ahooks";
import { GroupFilterItem, TargetType } from "@/config/CommonType";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { LocationMapListCallBack, LocationListType } from "@/components/LocationMapList/interface";
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import FeatureList, { frontFeatures, backFeatures, headFeatures, otherFeatures, RefFeatureListType } from "./FeatureList";
import featureData from '@/config/feature.json'
import { ParamsPlateNumberType } from "@/components/FormPlateNumber/interface";
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import ajax, { ApiResponse } from '@/services'
import { TimeRangeType, FormDataType, ResultRowType, resultShowType } from './interface'
import './index.scss'
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import { useDispatch, useSelector, RootState } from '@/store';
import { changeSelectedGroup, changeSelectedFilter, changeFilterTags, clearAll } from '@/store/slices/groupFilter'
import TargetResult from "./Result";
import classNames from 'classnames'
import { useLocation, Link } from "react-router-dom";
import { getParams, isObject, formatTimeComponentToForm, formatTimeFormToComponent } from "@/utils";
import { isEmptyObject } from "@/utils/is";
import { flushSync } from 'react-dom';
import { logReport, getLogData } from "@/utils/log";
import { PlateType } from "@/components/FormPlateNumber/interface";
import dictionary from '@/config/character.config'

const Target = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig.target || {}
  });

  const featureListRef = useRef<RefFeatureListType>(null)
  const [targetType, setTargetType] = useState<TargetType>(character.targetTypes[0]?.value as TargetType)
  let defaultFormData: FormDataType = {
    targetType: character.targetTypes[0]?.value as TargetType,
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: null,
    endTime: null,
    locationIds: [],
    locationGroupIds: [],
    offlineIds: [],
    pageNo: 1,
    pageSize: character.pageSizeOptions[0],
    // 以下车辆
    brandId: '',
    modelId: [],
    yearId: [],
    licensePlate: '',
    plateColorTypeId: -1,
    noplate: '',
    licensePlateFile: '',
    successNum: 0,
    objectTypeId: -1,
    directionId: -1,
    colorTypeId: -1,
    vehicleTypeId: [-1],
    vehicleFuncId: [-1],

    sort: {
      field: 'captureTime',
      order: 'desc'
    },
    groupfilters: []
  }
  const [defaultListType, setDefaultListType] = useState<LocationListType>(() => {
    const searchData = getParams(location.search)
    if (!isEmptyObject(searchData) && searchData.offlineIds) {
      return 'offline'
    } else {
      return 'region'
    }
  })
  const [firstLoading, setFirstLoading] = useState(true)
  const [formData, setFormData, resetFormData] = useResetState<FormDataType>(defaultFormData)
  const [ajaxFormData, setAjaxFormData] = useState(formData)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [resetDisabled, setResetDisabled] = useState(false)

  const defaultResultData = {
    totalRecords: 0,
    usedTime: 0,
    data: [],
  }
  const [resultData, setResultData] = useState<ApiResponse<ResultRowType[]>>(defaultResultData)
  // 分组筛选
  const [filters, setFilters] = useState<GroupFilterItem[]>([])
  const [resultShowType, setResultShowType] = useState<resultShowType>('image')
  // 结果选中
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<ResultRowType[]>([])

  const [plateType, setPlateType] = useState<PlateType>('single')
  //加入线索库
  const [showClue, setShowClue] = useState(false)

  // 导入数智万象
  const [importCubeVisible, setImportCubeVisible] = useState(false)

  // 获取token loading
  const [tokenLoading, setTokenLoading] = useState(false)

  const handleReset = () => {
    // resetFormData()
    const reset = true
    initTargetTypeData(reset)
  }

  const handleTargetTypeChange = (event: RadioChangeEvent) => {
    setTargetType(event.target.value)
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

  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
      offlineIds: data.offlineIds
    })
  }

  const handleFeatureChange = (data: any) => {
    // console.log(data)
    setFormData(Object.assign({}, formData, data))
  }

  const handleSelectChange = (value: SelectCommonProps['value'], fieldName: string) => {
    let newValue = value
    if (fieldName === 'vehicleTypeId' || fieldName === 'vehicleFuncId') {
      const arr = value as number[]
      // 不限判断
      newValue = arr[arr.length - 1] === -1 ? [-1] : arr.filter(item => item !== -1)
    }
    setFormData({
      ...formData,
      [fieldName]: newValue
    })
  }

  const handleChangeVehicleModel = (value: { brandValue: any, modelValue: any, yearValue: any, extra?: any }) => {
    setFormData({
      ...formData,
      brandId: value.brandValue,
      modelId: value.modelValue,
      yearId: value.yearValue
    })
  }

  const handlePlateChange = (value: ParamsPlateNumberType) => {
    const { type = 'single', licensePlate = '', plateColorTypeId = -1, noplate = '', licensePlateFile = '', successNum = 0 } = value
    setPlateType(type)
    if (type === 'single') {
      setFormData({
        ...formData,
        licensePlate: licensePlate,
        plateColorTypeId: plateColorTypeId,
        noplate: noplate,
        licensePlateFile: '',
        successNum: 0
      })
    }

    if (type === 'batch') {
      setFormData({
        ...formData,
        licensePlate: '',
        plateColorTypeId: -1,
        noplate: '',
        licensePlateFile: licensePlateFile,
        successNum: successNum
      })
    }
  }

  // 格式化formData，为提交检索做准备
  const formFormat = (form: FormDataType) => {
    let newForm = {
      ...form,
      targetType: form.targetType,
      sort: defaultFormData.sort,
      noplate: form.noplate === 'noplate' ? 1 : 0
    }

    // 格式化日期参数
    newForm['timeRange'] = formatTimeComponentToForm(newForm)

    // 点位和任务ids
    newForm['fileId'] = newForm.offlineIds

    // targetType为vehicle时，需要根据抓拍角度typeId进行特征参数删减
    if (form.targetType === 'vehicle') {
      switch (newForm.objectTypeId) {
        case -1:
          break;
        case 1:
          backFeatures.forEach(key => {
            delete newForm[key]
          })
          break;
        case 2:
          [...frontFeatures, ...headFeatures].forEach(key => {
            delete newForm[key]
          })
          break;
        case 3:
          [...frontFeatures, ...headFeatures, ...backFeatures, ...otherFeatures].forEach(key => {
            delete newForm[key]
          })
          break;
        default:
          break
      }
    } else {
      // targetType不为vehicle时，需要将多余的车辆参数删除
      const delVechileKeys = ["brandId", "modelId", "yearId", "plateColorTypeId", "noplate", "licensePlateFile", "objectTypeId", "directionId", "vehicleTypeId", "vehicleFuncId",]
      delVechileKeys.forEach(key => {
        delete newForm[key]
      })
    }

    // 公共参数删减，不必要的删除
    let delKeys = ["beginDate", "endDate", "beginTime", "endTime", "offlineIds"]

    if (plateType === 'single') {
      delKeys = delKeys.concat(['licensePlateFile'])
    } else if (plateType === 'batch') {
      delKeys = delKeys.concat(['licensePlate', 'plateColorTypeId', 'noplate'])
    }

    delKeys.forEach(key => {
      delete newForm[key]
    })

    return newForm
  }

  // 点击搜索
  const handleSearchBtnClick = async () => {
    const dateRangeMax = Number(pageConfig.timeRange?.max || 0)
    if (dateRangeMax) {
      let timeDiff = dayjs(formData.endDate).diff(dayjs(formData.beginDate), 'days')
      if (Math.abs(timeDiff) > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
        return
      }
    }
    firstLoading && setFirstLoading(false)

    const newForm = formFormat(formData)
    setAjaxFormData(newForm)
    setFilters([])
    dispatch(clearAll())
    setResultData(defaultResultData)
    setResultShowType('image')
    search(newForm)

    // 请求结果切换类型时,清空分组和筛选项
    dispatch(clearAll())
  }

  // 执行ajax请求
  const search = (newForm: FormDataType, showType: resultShowType = 'image') => {
    resetChecked()
    console.log(newForm)
    // featureListRef.current?.closeFeatureShow()

    setResetDisabled(true)
    setAjaxLoading(true)


    ajax.target.getTargetResult<FormDataType, ResultRowType[]>(newForm).then(res => {
      console.log(res)
      setResetDisabled(false)
      setAjaxLoading(false)

      const newRes = {
        ...(res || {}),
        data: (res.data || []).map((item, index) => ({ ...item, sortT: newForm.pageSize * (newForm.pageNo - 1) + index + 1 }))
      }
      setResultData(newRes)
    }).catch(err => {
      console.log(err)
      setResultData(defaultResultData)
      setResetDisabled(false)
      setAjaxLoading(false)
    })
  }

  // 分组筛选变化
  const handleGroupFilterChange = ({ filterTags = [] }: GroupFilterCallBackType) => {
    console.log('filterTags', filterTags)
    setFilters(filterTags)

    const showGroupTable = filterTags.length &&
      filterTags[filterTags.length - 1] &&
      filterTags[filterTags.length - 1].type === 'group' &&
      filterTags[filterTags.length - 1].value !== 'licensePlate1' &&
      filterTags[filterTags.length - 1].value !== 'licensePlate2'

    const newResultShowType = showGroupTable ? 'group' : 'image'
    setResultShowType(newResultShowType)


    let newForm = {
      ...ajaxFormData,
      groupfilters: filterTags,
      pageNo: 1,
      pageSize: character.pageSizeOptions[0],
    }
    setAjaxFormData(newForm)
    search(newForm, newResultShowType)
  }

  const initTargetTypeData = (reset?: boolean) => {
    // 改变默认参数
    let defaultFeatureForm = {}
    const thisFeatureData = featureData[targetType] || {}
    Object.keys(thisFeatureData).forEach(key => {
      const item = thisFeatureData[key]

      const itemData = item['value'] || []

      defaultFeatureForm[key] = itemData.length ? item.isSingle ? itemData[0].value : [itemData[0].value] : ''
    })
    // console.log(defaultFeatureForm)
    const beforeForm = reset ? {} : {
      timeType: formData.timeType,
      beginDate: formData.beginDate,
      endDate: formData.endDate,
      beginTime: formData.beginTime,
      endTime: formData.endTime,
      locationIds: formData.locationIds,
      locationGroupIds: formData.locationGroupIds,
      offlineIds: formData.offlineIds,
    }
    setFormData(Object.assign({}, defaultFormData, defaultFeatureForm, {
      targetType: targetType
    }, beforeForm))
  }

  useEffect(() => {
    initTargetTypeData()
  }, [targetType])

  // 图文列表改变
  const handleResultShowTypeChange = (event: RadioChangeEvent) => {
    setResultShowType(event.target.value)
  }

  // 时间排序
  const handleTimeSortChange = () => {
    const sortOrder: typeof ajaxFormData.sort.order = ajaxFormData.sort.order === 'asc' ? 'desc' : 'asc'
    let newForm = {
      ...ajaxFormData,
      sort: {
        ...ajaxFormData.sort,
        order: sortOrder
      }
    }
    setAjaxFormData(newForm)
    search(newForm)
  }

  // 分页改变
  const handleChangePn = (pn: number, pageSize: number) => {
    let newForm = ajaxFormData
    if (ajaxFormData.pageSize === pageSize) {
      newForm = {
        ...ajaxFormData,
        pageNo: pn
      }
    } else {
      newForm = {
        ...ajaxFormData,
        pageNo: 1,
        pageSize
      }
    }
    setAjaxFormData(newForm)
    search(newForm, resultShowType)
  }

  const handleImportCube = () => {
    setImportCubeVisible(true)
  }

  const resultShowTypeOption = [
    { label: <span><Icon type="tuwen" /> 图文</span>, value: 'image' },
    { label: <span><Icon type="liebiao" /> 列表</span>, value: 'list' },
  ]

  const resultHeaderRightTemplate = (
    resultShowType !== 'group' ?
      <div className="">
        <Space align="start">
          {
            ajaxFormData.targetType === 'vehicle' && (
              ajaxFormData.groupfilters &&
                ajaxFormData.groupfilters.length ?
                ajaxFormData.groupfilters[ajaxFormData.groupfilters.length - 1] &&
                ajaxFormData.groupfilters[ajaxFormData.groupfilters.length - 1].value !== 'licensePlate1' &&
                ajaxFormData.groupfilters[ajaxFormData.groupfilters.length - 1].value !== 'licensePlate2'
                : true
            ) ?
              <>
                <Radio.Group
                  optionType="button"
                  options={resultShowTypeOption}
                  onChange={handleResultShowTypeChange}
                  value={resultShowType}
                  disabled={ajaxLoading}
                />
              </>
              : ''
          }
          {
            !!resultData.data?.length &&
            <>
              <Button className="time-sort" onClick={handleTimeSortChange} disabled={ajaxLoading}>
                时间 <Icon type="daoxu" className={ajaxFormData.sort.order === 'desc' ? 'active' : ''} /> <Icon type="zhengxu" className={ajaxFormData.sort.order === 'asc' ? 'active' : ''} />
              </Button>
              <Button onClick={handleImportCube}>导入数智万象</Button>
              <Export
                hasAll={false}
                total={resultData.totalRecords}
                url={`/v1/targetretrieval/${ajaxFormData.targetType}/export`}
                // url={'http://localhost:8844/stream'}
                formData={{
                  ...ajaxFormData,
                  checkedIds: checkedList.map(item => item.infoId)
                }}
              />
            </>
          }
        </Space>
      </div>
      : ''
  )

  // 结果选中
  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked
    if (checked) {
      setCheckedList(resultData.data || [])
      setIndeterminate(false)
      setCheckAll(true)
    } else {
      resetChecked()
    }
  }

  // 图文列表-表格数据选中
  const handleTableCheckedChange = (selectedRows: ResultRowType[]) => {
    setCheckedList(selectedRows)
    setIndeterminate(!!selectedRows.length && selectedRows.length < (resultData.data ?? []).length);
    setCheckAll(selectedRows.length === (resultData.data ?? []).length);
  }

  // 图文列表 - 卡片数据选中
  const handleResultCheckedChange = ({ cardData, checked }: { cardData: any, checked: boolean }) => {

    const isExist = checkedList.filter(item => item.infoId === cardData.infoId).length
    let newCheckedData = []
    if (isExist) {
      newCheckedData = checkedList.filter(item => item.infoId !== cardData.infoId)
    } else {
      newCheckedData = checkedList.concat([cardData])
    }
    setCheckedList(newCheckedData)
    setIndeterminate(!!newCheckedData.length && newCheckedData.length < (resultData.data ?? []).length);
    setCheckAll(newCheckedData.length === (resultData.data ?? []).length);
  }

  // 重置选中数据
  const resetChecked = () => {
    setCheckedList([])
    setIndeterminate(false)
    setCheckAll(false)
  }

  const [jumpData, setJumpData] = useState({
    to: '',
    // state: {}
  })

  const handleJump = (link: string) => {
    // 日志提交
    logReport({
      type: 'image',
      data: {
        desc: `图片【${checkedList.length}】-【批量操作：以图检索】`,
        data: checkedList
      }
    })

    const params = checkedList.map(item => ({
      bigImage: item.bigImage,
      feature: item.feature,
      targetType: item.targetType,
      targetImage: item.targetImage
    }))
    // window.open(`${link}?fileIds=${JSON.stringify(fileIds)}`)

    //
    setJumpData({
      to: `${link}?featureList=${encodeURIComponent(JSON.stringify(params))}`,
      // state: {
      //   featureList: params
      // }
    })
  }

  // 页面跳转传参处理
  const handleParamsData = async () => {
    const searchData = getParams(location.search)
    if (!isEmptyObject(searchData)) {
      console.log(searchData)
      let paramsFormData = {}
      if (searchData.offlineIds) {
        try {
          paramsFormData['offlineIds'] = JSON.parse(searchData.offlineIds)
        } catch (error) {
          console.log(error)
        }
        // setDefaultListType('offline')
      }
      if (searchData.mapAround) {
        try {
          paramsFormData = { ...paramsFormData, ...JSON.parse(searchData.mapAround) }
        } catch (error) {
          console.log(error)
        }
      }
      if (searchData.id) {
        setTokenLoading(true)
        await ajax.getTokenParams<{}, string>({
          token: searchData.id
        }).then(res => {
          setTokenLoading(false)
          if (res.data) {
            try {
              const data: any = isObject(res.data) ? res.data : {}
              if (data.targetType) {
                flushSync(() => {
                  setTargetType(data.targetType)
                })
              }
              paramsFormData = data
            } catch (error) {
              Message.error(`数据解析失败`)
            }
          }
        }).catch(err => {
          setTokenLoading(false)
          Message.warning(err.message)
        })
      }
      if (searchData.token) {
        setTokenLoading(true)
        await getLogData({ token: searchData.token }).then(res => {
          setTokenLoading(false)
          const { data } = res as any
          if (data && isObject(data)) {
            try {
              if (data.targetType) {
                flushSync(() => {
                  setTargetType(() => data.targetType)
                })
              }
              paramsFormData = data
              // 时间格式恢复
              if (data.timeRange) {
                formatTimeFormToComponent(data.timeRange, paramsFormData)
                console.log(paramsFormData)
              }
              if (data.licensePlateFile) {
                setPlateType('batch')
              }
            } catch (error) {
              Message.error(`数据解析失败`)
            }
          }
        })
      }
      const newFormData = {
        ...formData,
        ...paramsFormData
      }
      if ((paramsFormData as any)?.targetType) {
        setTargetType((paramsFormData as any)?.targetType || "face")
      }
      setFormData(newFormData)
      // 执行检索
      const newAjaxFormData = formFormat(newFormData)
      setAjaxFormData(newAjaxFormData)
      search(newAjaxFormData)
    }
  }

  const calculateMaxTotal = (total: number, pageSize: number) => {
    // 计算总页数，使用Math.ceil来向上取整
    const totalPages = Math.ceil(total / pageSize);

    // 如果总页数超过1000，则计算不超过1000页的最大数，否则返回total
    if (totalPages > 1000) {
      return 1000 * pageSize;
    } else {
      return total;
    }
  }


  useEffect(() => {
    handleParamsData()
  }, [])

  return (
    <div className="target page-content">
      <div className="page-top">
        <div className="retrieval">
          <Space size={[16, 0]} wrap className="retrieval-form">
            {
              character.targetTypes.length > 1 ?
                <Form.Item
                  label="目标类型"
                  className="target-type"
                  colon={false}
                >
                  <Radio.Group
                    optionType="button"
                    options={character.targetTypes}
                    onChange={handleTargetTypeChange}
                    value={targetType}
                  />
                </Form.Item>
                : ''
            }
            <TimeRangePicker
              formItemProps={{ label: '时间范围' }}
              beginDate={formData.beginDate}
              endDate={formData.endDate}
              beginTime={formData.beginTime}
              endTime={formData.endTime}
              onChange={handleDateChange}
            />
            <LocationMapList
              formItemProps={{ label: '数据源' }}
              locationIds={formData.locationIds}
              locationGroupIds={formData.locationGroupIds}
              offlineIds={formData.offlineIds}
              onChange={handleLocationChange}
              defaultListType={defaultListType}
              showOperator={targetType === 'face'}
            />
            {
              targetType === "pedestrian" && character.hasGait ?
                <Form.Item
                  label="步态特征"
                  className="vehicle-form-item"
                  colon={false}
                >
                  <Select
                    defaultValue={dictionary.gaitFeature[0].value}
                    options={dictionary.gaitFeature}
                    onChange={(value) => handleSelectChange(value, 'isGait')}
                    value={formData.isGait}
                    showSearch={true}
                    // @ts-ignore
                    getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                  />
                </Form.Item>
                : ''
            }
            {
              targetType === 'vehicle' &&
              <>
                <Form.Item
                  label="抓拍角度"
                  className="vehicle-form-item"
                  colon={false}
                >
                  <Select
                    defaultValue={featureData['car']['objectTypeId']['value'][0]['value']}
                    options={featureData['car']['objectTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
                    onChange={(value) => handleSelectChange(value, 'objectTypeId')}
                    value={formData.objectTypeId}
                    showSearch={true}
                    // @ts-ignore
                    getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                  />
                </Form.Item>
                <Form.Item
                  label="行驶方向"
                  className="vehicle-form-item"
                  colon={false}
                >
                  <Select
                    defaultValue={featureData['car']['directionId']['value'][0]['value']}
                    options={featureData['car']['directionId']['value'].map(item => ({ label: item.text, value: item.value }))}
                    onChange={(value) => handleSelectChange(value, 'directionId')}
                    value={formData.directionId}
                    showSearch={true}
                    // @ts-ignore
                    getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                  />
                </Form.Item>
                <FormPlateNumber
                  params={{
                    type: plateType,
                    licensePlate: formData.licensePlate,
                    plateColorTypeId: formData.plateColorTypeId,
                    licensePlateFile: formData.licensePlateFile,
                    successNum: formData.successNum,
                    noplate: (formData.noplate as 'noplate' | '')
                  }}
                  onChange={handlePlateChange}
                />
                {/* <Form.Item
                  label="车辆型号"
                  className="vehicle-form-item"
                  colon={false}
                >
                  <VehicleModel
                    allowClear
                    brandData={{}}
                    hotBrands={[]}
                    modelData={{}}
                    yearData={{}}
                    destroyPopupOnHide={true}
                    // onChange={handleChangeVehicleModel}
                    brandValue={formData.brandId}
                    modelValue={formData.modelId}
                    yearValue={formData.yearId}
                  />
                </Form.Item> */}
                <FormVehicleModel
                  onChange={handleChangeVehicleModel}
                  brandValue={formData.brandId}
                  modelValue={formData.modelId}
                  yearValue={formData.yearId}
                />
                <Form.Item
                  label="车辆颜色"
                  className="vehicle-form-item"
                  colon={false}
                >
                  <Select
                    defaultValue={featureData['car']['colorTypeId']['value'][0]['value']}
                    options={featureData['car']['colorTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
                    onChange={(value) => handleSelectChange(value, 'colorTypeId')}
                    value={formData.colorTypeId}
                    showSearch={true}
                    // @ts-ignore
                    getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                  />
                </Form.Item>
                <Form.Item
                  label="车辆类别"
                  className="vehicle-form-item"
                  colon={false}
                >
                  <Select
                    defaultValue={featureData['car']['vehicleTypeId']['value'][0]['value']}
                    options={featureData['car']['vehicleTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
                    onChange={(value) => handleSelectChange(value, 'vehicleTypeId')}
                    value={formData.vehicleTypeId}
                    showSearch={true}
                    mode="multiple"
                    maxTagCount={1}
                    allowClear
                    // @ts-ignore
                    getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                  />
                </Form.Item>
                <Form.Item
                  label="车辆使用性质"
                  className="vehicle-form-item"
                  colon={false}
                >
                  <Select
                    defaultValue={featureData['car']['vehicleFuncId']['value'][0]['value']}
                    options={featureData['car']['vehicleFuncId']['value'].map(item => ({ label: item.text, value: item.value }))}
                    onChange={(value) => handleSelectChange(value, 'vehicleFuncId')}
                    value={formData.vehicleFuncId}
                    showSearch={true}
                    mode="multiple"
                    maxTagCount={1}
                    allowClear
                    // @ts-ignore
                    getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                  />
                </Form.Item>
              </>
            }
            <Form.Item colon={false} label={' '} style={{ marginLeft: 'auto' }}>
              <Space size={16}>
                <Button
                  disabled={resetDisabled}
                  onClick={handleReset}
                  type='default'
                  className="reset-btn"
                >
                  重置
                </Button>
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

          <FeatureList
            ref={featureListRef}
            targetType={targetType}
            onChange={handleFeatureChange}
            captureAngle={formData.objectTypeId || -1}
            value={formData}
          />

        </div>
        <div className={classNames("outcomes", {
          "first": firstLoading
        })}>
          {/* <div className="outcomes-header">
            <div className="total">
              共<span>0</span>条结果，用时<span>0</span>秒
              <ResultGroupFilter.Choose  onChange={handleGroupFilterChange}/>
            </div>
            <div className="func">按钮组</div>
          </div> */}
          {filters.length ? <ResultGroupFilter.Show onChange={handleGroupFilterChange} /> : ''}
          <ResultHeader
            className="outcomes-header"
            resultData={resultData}
            rightSlot={resultHeaderRightTemplate}
            targetType={ajaxFormData.targetType}
            resultShowType={resultShowType}
            onGroupFilterChange={handleGroupFilterChange}
            groupFilterDisabled={ajaxLoading || (!resultData.data || (resultData.data && !resultData.data.length))}
          />
          <TargetResult
            firstLoading={firstLoading}
            ajaxFormData={ajaxFormData}
            loading={ajaxLoading}
            resultData={resultData}
            onCheckedChange={handleResultCheckedChange}
            onTableCheckedChange={handleTableCheckedChange}
            checkedList={checkedList}
            resultShowType={resultShowType}
            pageSize={ajaxFormData.pageSize}
            onGroupFilterChange={handleGroupFilterChange}
          />
        </div>
      </div>
      {
        resultData.data?.length ?
          <div className="page-bottom">
            <div className='left'>
              <div className={classNames("check-box", {
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
                已经选择<span className="num">{checkedList.length}</span>项
              </div>
              <Tooltip title="仅可选取5个目标" placement="top">
                <span>
                  <Link
                    {...jumpData}
                    target="_blank"
                    onClick={(e) => handleJump('/image')}
                    className={!checkedList.length || checkedList.length > 5 || resultShowType === 'group' ? 'disabled btn-link' : 'btn-link'}
                  >以图检索</Link>
                </span>
              </Tooltip>
              <Button disabled={!checkedList.length || resultShowType === 'group'} size='small' onClick={() => { setShowClue(true) }} >加入线索库</Button>
              <CreateTrackBtn disabled={!checkedList.length || resultShowType === 'group'} checkedList={checkedList} />
            </div>
            <Pagination
              disabled={!resultData.totalRecords || ajaxLoading}
              showSizeChanger
              showQuickJumper
              showTotal={() => `共 ${resultData.totalRecords} 条`}
              total={calculateMaxTotal(resultData.totalRecords || 0, Number(ajaxFormData.pageSize))}
              current={ajaxFormData.pageNo}
              pageSize={Number(ajaxFormData.pageSize)}
              pageSizeOptions={character.pageSizeOptions}
              onChange={handleChangePn}
            />
          </div>
          : ''
      }
      <JoinClue
        visible={showClue}
        clueDetails={checkedList}
        onOk={() => { setShowClue(false) }}
        onCancel={() => { setShowClue(false) }}
      />
      <ImportCubeModal
        url={`/v1/targetretrieval/${ajaxFormData.targetType}/export-mofang`}
        // url={`/v1/common/cube/import`}
        resultFormData={ajaxFormData}
        modalProps={{
          visible: importCubeVisible,
          onCancel: () => setImportCubeVisible(false)
        }}
      />
    </div>
  )
}

export default Target
