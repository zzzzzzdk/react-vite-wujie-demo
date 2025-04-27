import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, Modal, Radio, Divider, Message, Form, Space, Slider, Checkbox, Pagination, Input, Select, Tooltip } from "@yisa/webui"
import { } from '@yisa/webui_business'
import { Icon, LoadingOutlined, PlusOutlined } from '@yisa/webui/es/Icon'
import cn from 'classnames'
import { TimeRangePicker, ResultHeader, ResultGroupFilter, LocationMapList, FormPlate, FormVehicleModel, XgPlayer, JoinClue, Export } from '@/components'
import Result from './Result'
import { useGetState, useResetState } from "ahooks";
import dayjs from 'dayjs'
import ajax, { ApiResponse } from '@/services'
import { useSelector, useDispatch, RootState } from '@/store'
import dictionary from '@/config/character.config'
// import { isObject, regular, validatePlate } from '@/utils'
import { formatTimeComponentToForm, formatTimeFormToComponent, getParams, isObject, regular, validatePlate } from '@/utils'
import groupFilter, { clearAll } from '@/store/slices/groupFilter';
import featureData from '@/config/feature.json'
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox//Checkbox'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { LocationMapListCallBack } from '@/components/LocationMapList/interface'
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import { PlateValueProps } from "@/components/FormPlate/interface";
import { resultShowType, ResultRowType } from '@/pages/Search/Target/interface'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { DoublecarFormDataType, DoublecarListType } from './interface'
import './index.scss'
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { SysConfigItem } from "@/store/slices/user";
import { getLogData, logReport } from "@/utils/log";
//一次二次识别车牌
const licensePlateArr = ['licensePlate1', 'licensePlate2']
const Doublecar = () => {

  const prefixCls = 'vehicle-doublecar'
  const location = useLocation()
  const dispatch = useDispatch()
  const searchData = getParams(location.search)
  const { licensePlate = "", plateColorTypeId = -1, brandId = "", yearId = "", modelId = "", vehicleTypeId = "" } = searchData
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter
  })
  const defaultPageConfig = {}
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig.doublecar || defaultPageConfig
  });
  // const [firstLoading, setFirstLoading] = useState(true)
  const [ajaxLoading, setAjaxLoading] = useState(false)

  //结果栏展示图片，列表 还是分组表格
  const [resultShowType, setResultShowType] = useState<resultShowType>('image')
  //结果数据
  const [resultData, setResultData] = useState<ApiResponse<DoublecarListType[]>>({})
  //已经选择的结果数据
  const [checkedList, setCheckedList] = useState<ResultRowType[]>([])

  //选则的双胞胎车id
  const [chooseList, setChooseList] = useState<string[]>([])
  // 结果选中
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [carlist, setCarlist] = useState<ResultRowType[]>([])
  const [cluemodel, setCluemodel] = useState(false)
  //表单数据参数
  const [formData, setFormData, resetFormData] = useResetState<DoublecarFormDataType>({
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],//选中点位
    locationGroupIds: [],//点位组
    groupFilters: [],//分组筛选条件
    pageNo: 1,//页数
    pageSize: dictionary.pageSizeOptions[0],//页容量
    //车型号
    brandId: '',
    modelId: [],
    yearId: [],
    //车牌
    licensePlate: '',
    // 车牌颜色
    plateColorTypeId: -1,
    //是否无牌
    noplate: '',
    //车类别
    vehicleTypeId: [-1],
  })
  //把所有的参数保存一份，用于检索
  const searchFormDataRef = useRef({
    ...formData
  })
  //#region 计算属性
  //检索按钮需要重置的参数
  const resetSliceResultFormData = {
    groupFilters: [],
    pageNo: 1, //分页只有在表格分组的时候用到
    pageSize: dictionary.pageSizeOptions[0],
  }

  //格式化请求参数
  const formFormat = (form: DoublecarFormDataType) => {
    let newForm = { ...form }
    // 格式化日期参数
    newForm['timeRange'] = formatTimeComponentToForm(newForm)
    // 点位和任务ids 合并
    // newForm['locationIds'] = [...form.locationIds, ...form.locationGroupIds]
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "noplate"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }

  //检索
  const handleSearchBtnClick = (form?: DoublecarFormDataType) => {
    const _formData = form || formData
    // const _formData=formData
    // console.log(formData,'====',form,'asasda');

    // console.log(formData.licensePlate.toUpperCase());

    if (!validatePlate(_formData.licensePlate)) {
      Message.warning("请输入正确的车牌号")
      return
    }
    if (dayjs(_formData.endDate).diff(dayjs(_formData.beginDate), "day") + 1 > Number(pageConfig.timeRange.max)) {
      Message.warning(`时间范围不可以超过${pageConfig.timeRange.max || 0}天！`);
      return
    }
    dispatch(clearAll())
    setResultShowType("image")
    setResultData({})
    const _ajaxFormData = { ..._formData, ...resetSliceResultFormData }
    //展示用
    setFormData(_ajaxFormData)
    //检索用
    searchFormDataRef.current = _ajaxFormData
    search(_ajaxFormData)
  }
  //ajax请求 , newForm 合并所有请求参数，表单数据，可能有分组
  const search = async (newForm: DoublecarFormDataType) => {
    //重置选中状态
    resetChecked()
    const _newForm = formFormat(newForm)
    try {
      setAjaxLoading(true)
      const res = await ajax.doublecar.getDoublecarList<DoublecarFormDataType, DoublecarListType[]>(_newForm)
      setAjaxLoading(false)

      CarListinit(res.data!)
      setResultData(res)

      // setFormData({ ...formData, groupFilters: [] })//筛选条件重置
    }
    catch (error) {
      setAjaxLoading(false)
      // setFormData({ ...formData, groupFilters: [] })//筛选条件重置
      setResultData([])
      Message.warning('查询失败')
    }

  }
  //车辆列表格式化
  const CarListinit = (data: DoublecarListType[]) => {
    let carlist = data.reduce((pre: ResultRowType[], cur: DoublecarListType) => {
      pre = pre.concat(cur.doublecar)
      return pre
    }, [])
    setCarlist(carlist)
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
      default:
        break;
    }
  }
  const handleChangeVehicleModel = (value: { brandValue: string, modelValue: string[], yearValue: string[], extra?: any }) => {
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
    setFormData({ ...formData, ...resetSliceResultFormData, groupFilters: filterTags })
    searchFormDataRef.current = { ...searchFormDataRef.current, ...resetSliceResultFormData, groupFilters: filterTags }
    //所有表单数据
    // const _newForm = { ...formData, featureList, groupFilters: filterTags }
    search(searchFormDataRef.current)
  }

  // 图文列表 - 卡片数据选中
  const handleResultCheckedChange = ({ cardData, checked }: { cardData: ResultRowType, checked: boolean }) => {

    const isExist = checkedList.filter(item => item.infoId === cardData.infoId).length
    let newCheckedData = []
    if (isExist) {
      newCheckedData = checkedList.filter(item => item.infoId !== cardData.infoId)
    } else {
      newCheckedData = checkedList.concat([cardData])
      console.log(newCheckedData, 'pp');
    }
    setCheckedList(newCheckedData)
    setIndeterminate(!!newCheckedData.length && newCheckedData.length < (carlist ?? []).length);
    setCheckAll(newCheckedData.length === (carlist ?? []).length);
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
    if (checked && carlist) {
      setCheckedList([...carlist])
      setIndeterminate(false)
      setCheckAll(true)
    } else {
      resetChecked()
    }
  }

  // 分页改变
  const handleChangePn = (pn: number, pageSize: number) => {
    let newForm = formData.pageSize === pageSize ? { pageNo: pn } : { pageNo: 1, pageSize: pageSize }
    //用户页面展示
    setFormData({ ...formData, ...newForm })
    //用户检索数据
    searchFormDataRef.current = { ...searchFormDataRef.current, ...newForm }
    search(searchFormDataRef.current)
  }
  if (searchFormDataRef.current?.groupFilters?.length) {
    console.log(licensePlateArr.includes(searchFormDataRef.current.groupFilters[searchFormDataRef.current.groupFilters.length - 1].value))
    // console.log(resultShowType)
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
    setJumpData({ to: `${link}?featureList=${encodeURIComponent(JSON.stringify(params))}` })
  }

  useEffect(() => {
    // resultData.data?.filter()
    let checkedIds = checkedList.map((item) => item.infoId)
    setChooseList(checkedIds)
  }, [checkedList])
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
  const onOk = () => {
    setCluemodel(false)
  }
  const onCancel = () => {
    setCluemodel(false)
  }

  // 重置
  const handleReset = () => {
    resetFormData()
  }

  return (
    <div className={`${prefixCls} page-content`}>
      <div className="page-top">
        <div className="retrieval">
          <div className="search">
            <Form layout="vertical" className="double-car-form">
              <TimeRangePicker
                formItemProps={{ label: '时间范围' }}
                beginDate={formData.beginDate}
                endDate={formData.endDate}
                beginTime={formData.beginTime}
                endTime={formData.endTime}
                timeType={formData.timeType}
                onChange={handleDateChange}
                getPopupContainer={() => document.getElementsByClassName('double-car-form')[0] as HTMLElement}
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
              <Form.Item colon={false} label={'车牌号码'}>
                <FormPlate
                  isShowKeyboard
                  value={{
                    plateNumber: formData.licensePlate,
                    plateTypeId: formData.plateColorTypeId,
                    noplate: (formData.noplate as 'noplate' | '')
                  }}
                  onChange={(value) => { handlePlateChange(value, "licensePlate") }}
                  remind={<div>提示：请输入准确车牌号码（如：鲁A12345）或模糊车牌号码。模糊搜索时可用“*”代替任意位数，“？”代替一位数。如：京*45，京A？34？5</div>}
                  getPopupContainer={() => document.getElementsByClassName('double-car-form')[0] as HTMLElement}
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
                  // @ts-ignore
                  getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                />
              </Form.Item>
              <FormVehicleModel
                onChange={handleChangeVehicleModel}
                brandValue={formData.brandId}
                modelValue={formData.modelId}
                yearValue={formData.yearId}
              />
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
            resultData.data && <ResultHeader
              defaultFilterTypeOptions={dictionary.filterType.slice(0, 3)}
              targetType="vehicle"
              className="outcomes-header"
              resultData={resultData}
              rightSlot={<Export
                disable={ajaxLoading}
                total={(resultData?.totalRecords || 0)}
                url={`/v1/judgement/twins/vehicle/list/export`}
                formData={{
                  ...formFormat(searchFormDataRef.current),
                  checkedIds: resultData.data.filter((item) => {
                    return chooseList.includes(item.doublecar[0].infoId) || chooseList.includes(item.doublecar[1].infoId)
                  }).map((it) => it.id),
                }}
              />}
              onGroupFilterChange={handleGroupFilterChange}
              groupFilterDisabled={ajaxLoading}
              needgroupchoose={false}
            />
          }
          <div className={`outcomes-wrapper`}>
            <Result
              loading={ajaxLoading}
              resultData={resultData}
              onCheckedChange={handleResultCheckedChange}
              checkedList={checkedList}
              carlist={carlist}
            />
          </div>
        </div>
      </div>
      {
        resultData?.data?.length ?
          <div className="page-bottom">
            <div className='left'>
              <div className={cn("check-box", {
                // "disabled": resultShowType === 'group'
              })}>
                <Checkbox
                  className="card-checked"
                  checked={checkAll}
                  indeterminate={indeterminate}
                  onChange={handleCheckAllChange}
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
                    className={!checkedList.length || checkedList.length > 5 ? 'disabled btn-link' : 'btn-link'}
                  >以图检索</Link>
                </span>
              </Tooltip>
              <JoinClue isbutton={true} clueDetails={checkedList} />
            </div>
            <Pagination
              disabled={!resultData.totalRecords || ajaxLoading}
              showSizeChanger
              showQuickJumper
              showTotal={() => `共 ${resultData.totalRecords} 条`}
              total={resultData.totalRecords}
              // total={41}
              current={formData.pageNo}
              pageSize={formData.pageSize}
              pageSizeOptions={dictionary.pageSizeOptions}
              onChange={handleChangePn}
            />
          </div>
          : ''
      }
    </div >
  )
}

export default Doublecar
