import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router'
import { Button, Radio, Divider, Message, Form, Space, Slider, Checkbox, Pagination, Input, Select, Tooltip } from "@yisa/webui"
import { Icon } from '@yisa/webui/es/Icon'
import cn from 'classnames'
import { TimeRangePicker, ResultHeader, ResultGroupFilter, LocationMapList, FormPlate, FormVehicleModel, JoinClue, Export, CreateTrackBtn, GlobalMeaasge } from '@/components'
import Result from './Result'
import { useResetState } from "ahooks";
import dayjs from 'dayjs'
import ajax, { ApiResponse } from '@/services'
import { getLogData, logReport } from "@/utils/log";
import { useSelector, useDispatch, RootState } from '@/store'
import dictionary from '@/config/character.config'
import { formatTimeComponentToForm, formatTimeFormToComponent, getParams, isObject, regular, validatePlate } from '@/utils'
import { clearAll } from '@/store/slices/groupFilter';
import featureData from '@/config/feature.json'
import type { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import type { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox//Checkbox'
import type { DatesParamsType } from "@/components/TimeRangePicker/interface";
import type { LocationMapListCallBack } from '@/components/LocationMapList/interface'
import type { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import type { PlateValueProps } from "@/components/FormPlate/interface";
import type { resultShowType, ResultRowType } from '@/pages/Search/Target/interface'
import type { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import type { InitialFormDataType } from './interface'
import type { PlateTypeId } from '@/components/FormPlate/interface'
import './index.scss'

const { InputNumber } = Input

//一次二次识别车牌
const licensePlateArr = ['licensePlate1', 'licensePlate2']
const resultShowTypeOption = [
  { label: <span><Icon type="tuwen" /> 图文</span>, value: 'image' },
  { label: <span><Icon type="liebiao" /> 列表</span>, value: 'list' },
]
const defaultPageConfig = {}


const Initial = () => {

  const prefixCls = 'vehicle-initial'
  const location = useLocation()
  const dispatch = useDispatch()
  const searchData = getParams(location.search)
  const { licensePlate = "", plateColorTypeId = -1, brandId = "", yearId = "", modelId = "", vehicleTypeId = "" } = searchData
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter
  })
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig.initial || defaultPageConfig
  });
  // const [firstLoading, setFirstLoading] = useState(true)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  //加入线索库
  const [showClue, setShowClue] = useState(false)
  //结果栏展示图片，列表 还是分组表格
  const [resultShowType, setResultShowType] = useState<resultShowType>('image')
  //结果数据
  const [resultData, setResultData] = useState<ApiResponse<ResultRowType[]>>({})
  //已经选择的结果数据
  const [checkedList, setCheckedList] = useState<ResultRowType[]>([])
  // 结果选中
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  //表单数据参数
  const [formData, setFormData, resetFormData] = useResetState<InitialFormDataType>({
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    groupFilters: [],
    pageNo: 1,
    pageSize: dictionary.pageSizeOptions[0],
    brandId,
    modelId: modelId.split(",").filter(Boolean),
    yearId: yearId.split(",").filter(Boolean),
    licensePlate,
    plateColorTypeId: Number(plateColorTypeId) as PlateTypeId,
    noplate: '',
    objectTypeId: -1,
    vehicleTypeId: vehicleTypeId.split(",").filter(Boolean).map(item => Number(item)),
    vehicleFuncId: [-1],
    //排除车牌
    excludeLicensePlates: [{
      licensePlate: "",
      plateColorTypeId: -1,
    },
    {
      licensePlate: "",
      plateColorTypeId: -1,
    }],

    backtrackTime: pageConfig.backtrackTime.default || "", //回溯时长
    // sort: {
    //   field: dictionary.yituSort[0].value,
    //   order: dictionary.yituSort[0].order,
    // },

  })
  //把所有的参数保存一份，用于检索
  const searchFormDataRef = useRef({
    ...formData
  })
  //#region 计算属性
  //检索按钮需要重置的参数
  const resetSliceResultFormData = {
    // sort: {
    //   field: dictionary.yituSort[0].value,
    //   order: dictionary.yituSort[0].order,
    // },
    groupFilters: [],
    pageNo: 1, //分页只有在表格分组的时候用到
    pageSize: dictionary.pageSizeOptions[0],
  }

  //是否展示图文切换功能
  const showImageListFlag = (searchFormDataRef.current.groupFilters && searchFormDataRef.current.groupFilters.length
    && (!licensePlateArr.includes(searchFormDataRef.current.groupFilters[searchFormDataRef.current.groupFilters.length - 1].value))) || (searchFormDataRef.current.groupFilters && searchFormDataRef.current.groupFilters.length === 0)
  //#endregion


  // const handleReset = () => {
  //   resetFormData()
  //   setFeatureList([])
  // }

  //格式化请求参数
  const formFormat = (form: InitialFormDataType) => {
    let newForm = { ...form }
    // 格式化日期参数
    newForm['timeRange'] = formatTimeComponentToForm(newForm)
    // 点位和任务ids
    newForm['locationIds'] = [...form.locationIds, ...form.locationGroupIds]
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "locationGroupIds", "noplate"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }

  //检索
  const handleSearchBtnClick = (form?: InitialFormDataType) => {
    const _formData = form || formData
    // firstLoading && setFirstLoading(false)
    // if (_formData.backtrackTime === "" || !regular.isNum.test(_formData.backtrackTime.trim())) {
    //   Message.warning("请设置有效回溯时长")
    //   return
    // }
    if (!validatePlate(_formData.licensePlate)) {
      Message.warning("请输入正确的车牌号")
      return
    }
    if (!validatePlate(_formData.excludeLicensePlates[0].licensePlate)) {
      Message.warning("请输入正确排除车牌1")
      return
    }
    if (!validatePlate(_formData.excludeLicensePlates[1].licensePlate)) {
      Message.warning("请输入正确排除车牌2")
      return
    } if (_formData.excludeLicensePlates[0].licensePlate.trim()
      && _formData.excludeLicensePlates[0].plateColorTypeId === _formData.excludeLicensePlates[1].plateColorTypeId
      && _formData.excludeLicensePlates[0].licensePlate.trim() === _formData.excludeLicensePlates[1].licensePlate.trim()
    ) {
      Message.warning("排除车牌不能重复")
      return
    }
    if (dayjs(_formData.endDate).diff(dayjs(_formData.beginDate), "day") + 1 > Number(pageConfig.timeRange.max)) {
      Message.warning(`时间范围不可以超过${pageConfig.timeRange.max || 0}天！`);
      return
    }
    if (Number(_formData.backtrackTime) > Number(pageConfig.backtrackTime.max)) {
      Message.warning(`回溯时长不可以超过${pageConfig.backtrackTime.max || 0}天！`);
      return
    }
    dispatch(clearAll())
    setResultData({})
    setResultShowType("image")
    const _ajaxFormData = { ..._formData, ...resetSliceResultFormData }
    //展示用
    setFormData(_ajaxFormData)
    //检索用
    searchFormDataRef.current = _ajaxFormData
    search(_ajaxFormData)

  }
  //ajax请求 , newForm 合并所有请求参数，表单数据，可能有分组
  const search = async (newForm: InitialFormDataType) => {
    //重置选中状态
    resetChecked()
    const _newForm = formFormat(newForm)
    setAjaxLoading(true)
    try {
      const res = await ajax.initial.getInitialList<InitialFormDataType, ResultRowType[]>(
        _newForm,
        (loading: boolean) => loading ? GlobalMeaasge.showLoading() : GlobalMeaasge.hideLoading()
      )
      const newRes = {
        ...res,
        data: res.data ?
          res.data?.map((item, index) => ({ ...item, sortT: searchFormDataRef.current.pageSize * (searchFormDataRef.current.pageNo - 1) + index + 1 }))
          : []
      }
      setAjaxLoading(false)
      setResultData(newRes)
    } catch (error) {
      setAjaxLoading(false)
    }
  }

  // 图文列表改变
  const handleResultShowTypeChange = (event: RadioChangeEvent) => {
    setResultShowType(event.target.value)
  }

  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
    })
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
      case "excludeLicensePlate1":
        setFormData({
          ...formData,
          excludeLicensePlates: [
            {
              licensePlate: plateNumber,
              plateColorTypeId: plateTypeId,
            },
            formData.excludeLicensePlates[1]]
        })
        break;
      case "excludeLicensePlate2":
        setFormData({
          ...formData,
          excludeLicensePlates: [
            formData.excludeLicensePlates[0],
            {
              licensePlate: plateNumber,
              plateColorTypeId: plateTypeId,
            }]
        })
        break;
      default:
        break;
    }
  }
  const handleChangeVehicleModel = (value: { brandValue: any, modelValue: any, yearValue: any, extra?: any }) => {
    setFormData({
      ...formData,
      brandId: value.brandValue,
      modelId: value.modelValue,
      yearId: value.yearValue
    })
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

  //分组,过滤 , 分组过滤改变，重置分页，排序
  const handleGroupFilterChange = ({ filterTags = [] }: GroupFilterCallBackType) => {
    console.log('filterTags', filterTags)
    setFormData({ ...formData, ...resetSliceResultFormData, groupFilters: filterTags, })
    searchFormDataRef.current = { ...searchFormDataRef.current, ...resetSliceResultFormData, groupFilters: filterTags, }
    //所有表单数据
    // const _newForm = { ...formData, featureList, groupFilters: filterTags }
    search(searchFormDataRef.current)
    const showGroupTable = filterTags.length &&
      filterTags[filterTags.length - 1] &&
      filterTags[filterTags.length - 1].type === 'group' &&
      filterTags[filterTags.length - 1].value !== 'licensePlate1' &&
      filterTags[filterTags.length - 1].value !== 'licensePlate2'
    console.log(showGroupTable)
    setResultShowType(showGroupTable ? 'group' : "image")
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
  //全选按钮
  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked
    if (checked && resultData?.data) {
      setCheckedList([...resultData.data])
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
    search(searchFormDataRef.current)
  }
  if (searchFormDataRef.current?.groupFilters?.length) {
    console.log(licensePlateArr.includes(searchFormDataRef.current.groupFilters[searchFormDataRef.current.groupFilters.length - 1].value))
    console.log(resultShowType)
  }


  //图文切换结构
  const resultHeaderRightTemplate = (
    resultShowType !== 'group'
      ? (<Space align="start">
        {
          showImageListFlag && <Radio.Group
            optionType="button"
            options={resultShowTypeOption}
            onChange={handleResultShowTypeChange}
            value={resultShowType}
            disabled={ajaxLoading}
          />
        }
        <Export
          hasAll={false}
          disable={!resultData?.totalRecords}
          total={(resultData?.totalRecords || 0)}
          url={`/v1/targetretrieval/city-first/export`}
          formData={{
            ...formFormat(searchFormDataRef.current),
            checkedIds: checkedList.map(item => item.infoId),
          }}
        />
      </Space>)
      : ''
  )

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
      targetImage: item.targetImage,
      windowFeature: item?.windowFeature || ""
    }))
    setJumpData({ to: `${link}?featureList=${encodeURIComponent(JSON.stringify(params))}` })
  }


  // 重置
  const handleReset = () => {
    resetFormData()
  }

  useEffect(() => {
    //清空分组筛选条件
    dispatch(clearAll())
    if (searchData.token) {
      getLogData({ token: searchData.token }).then(res => {
        const { data } = res as any
        if (data && isObject(data)) {
          try {
            // 时间格式恢复
            if (data.timeRange) {
              formatTimeFormToComponent(data.timeRange, data)
            }
            setFormData({
              ...formData,
              ...data
            })
            // debugger
            handleSearchBtnClick({
              ...formData,
              ...data
            })
          } catch (error) {
            Message.error(`数据解析失败`)
          }
        }
      })
    } else {
      handleSearchBtnClick()
    }
  }, [])

  return (
    <div className={`${prefixCls} page-content`}>
      <div className="page-top">
        <div className="retrieval">
          <div className="search">
            <Form layout="vertical" className="vehicle-initial-form">
              <TimeRangePicker
                formItemProps={{ label: '时间范围' }}
                timeType={formData.timeType}
                beginDate={formData.beginDate}
                endDate={formData.endDate}
                beginTime={formData.beginTime}
                endTime={formData.endTime}
                onChange={handleDateChange}
                getPopupContainer={() => document.getElementsByClassName('vehicle-initial-form')[0] as HTMLElement}
              />
              <LocationMapList
                formItemProps={{ label: '数据源' }}
                title="选择点位"
                onlyLocationFlag={true}
                locationIds={formData.locationIds}
                locationGroupIds={formData.locationGroupIds}
                tagTypes={dictionary.tagTypes.slice(0, 2)}
                onChange={handleLocationChange}
              />
              <Form.Item className="backtrack-time" colon={false} label={'回溯时长'} required>
                <InputNumber
                  value={formData.backtrackTime}
                  onChange={(val) => { setFormData({ ...formData, backtrackTime: val || 1 }) }}
                  min={1}
                  addAfter="天"
                />
              </Form.Item>
              <Form.Item colon={false} label={'车牌号码'}>
                <FormPlate
                  allowClear
                  isShowKeyboard
                  value={{
                    plateNumber: formData.licensePlate,
                    plateTypeId: formData.plateColorTypeId,
                    noplate: (formData.noplate as 'noplate' | '')
                  }}
                  onChange={(value) => { handlePlateChange(value, "licensePlate") }}
                  getPopupContainer={() => document.getElementsByClassName('vehicle-initial-form')[0] as HTMLElement}
                />
              </Form.Item>
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
                  allowClear
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
                  allowClear
                  defaultValue={featureData['car']['vehicleTypeId']['value'][0]['value']}
                  options={featureData['car']['vehicleTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
                  onChange={(value) => handleSelectChange(value, 'vehicleTypeId')}
                  value={formData.vehicleTypeId}
                  showSearch={true}
                  mode="multiple"
                  maxTagCount={1}
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
                  allowClear
                  defaultValue={featureData['car']['vehicleFuncId']['value'][0]['value']}
                  options={featureData['car']['vehicleFuncId']['value'].map(item => ({ label: item.text, value: item.value }))}
                  onChange={(value) => handleSelectChange(value, 'vehicleFuncId')}
                  value={formData.vehicleFuncId}
                  showSearch={true}
                  mode="multiple"
                  maxTagCount={1}
                  // @ts-ignore
                  getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                />
              </Form.Item>
              <Form.Item
                label="抓拍角度"
                className="vehicle-form-item"
                colon={false}
              >
                <Select
                  allowClear
                  defaultValue={featureData['car']['objectTypeId']['value'][0]['value']}
                  options={featureData['car']['objectTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
                  onChange={(value) => handleSelectChange(value, 'objectTypeId')}
                  value={formData.objectTypeId}
                  showSearch={true}
                  // @ts-ignore
                  getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                />
              </Form.Item>
              <Form.Item colon={false} label={'排除车牌1'}>
                <FormPlate
                  allowClear
                  isShowKeyboard
                  value={{
                    plateNumber: formData.excludeLicensePlates[0].licensePlate,
                    plateTypeId: formData.excludeLicensePlates[0].plateColorTypeId,
                    noplate: (formData.noplate as 'noplate' | '')
                  }}
                  onChange={(value) => { handlePlateChange(value, "excludeLicensePlate1") }}
                  getPopupContainer={() => document.getElementsByClassName('vehicle-initial-form')[0] as HTMLElement}
                />
              </Form.Item>
              <Form.Item colon={false} label={'排除车牌2'}>
                <FormPlate
                  allowClear
                  isShowKeyboard
                  value={{
                    plateNumber: formData.excludeLicensePlates[1].licensePlate,
                    plateTypeId: formData.excludeLicensePlates[1].plateColorTypeId,
                    noplate: (formData.noplate as 'noplate' | '')
                  }}
                  onChange={(value) => { handlePlateChange(value, "excludeLicensePlate2") }}
                  getPopupContainer={() => document.getElementsByClassName('vehicle-initial-form')[0] as HTMLElement}
                />
              </Form.Item>
              <Form.Item colon={false} label={' '} style={{ marginLeft: 'auto' }}>
                <Space size={10}>
                  <Button disabled={ajaxLoading} onClick={handleReset} type='default' className="reset-btn">重置</Button>
                  <Button
                    loading={ajaxLoading}
                    onClick={() => { handleSearchBtnClick() }}
                    type='primary'
                  >
                    查询
                  </Button>
                  {/* <Button disabled={ajaxLoading} onClick={handleReset}  type='default' className="reset-btn">重置</Button> */}
                </Space>
              </Form.Item>

            </Form>
          </div>
          <div className="filter">
            {filterTags.length ? <ResultGroupFilter.Show onChange={handleGroupFilterChange} /> : ''}
          </div>
          <Divider />
        </div>
        <div className="outcomes">
          {
            resultData?.data && <ResultHeader
              defaultFilterTypeOptions={dictionary.filterType.slice(0, 3)}
              targetType="vehicle"
              className="outcomes-header"
              resultData={resultData}
              rightSlot={resultShowType === "group" ? "" : resultHeaderRightTemplate}
              onGroupFilterChange={handleGroupFilterChange}
              groupFilterDisabled={ajaxLoading}
            />
          }
          <div className={`outcomes-wrapper`}>
            <Result
              ajaxFormData={searchFormDataRef.current}
              loading={ajaxLoading}
              resultData={resultData}
              onCheckedChange={handleResultCheckedChange}
              onTableCheckedChange={handleTableCheckedChange}
              checkedList={checkedList}
              resultShowType={resultShowType}
              pageSize={searchFormDataRef.current.pageSize}
              onGroupFilterChange={handleGroupFilterChange}
            />
          </div>
        </div>
      </div>
      {
        resultData?.data?.length ?
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
              <Button disabled={!checkedList.length || resultShowType === 'group'} size='small' onClick={() => { setShowClue(true) }}>加入线索库</Button>
              <CreateTrackBtn
                disabled={!checkedList.length || resultShowType === 'group'}
                checkedList={checkedList}
              />
            </div>
            <Pagination
              disabled={!resultData.totalRecords || ajaxLoading}
              showSizeChanger
              showQuickJumper
              showTotal={() => `共 ${resultData.totalRecords} 条`}
              total={resultData.totalRecords}
              current={formData.pageNo}
              pageSize={formData.pageSize}
              pageSizeOptions={dictionary.pageSizeOptions}
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
    </div >
  )
}

export default Initial
