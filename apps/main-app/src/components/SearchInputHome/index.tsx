import './index.scss'
import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { ImgUpload, FormPlate, LocationMapList, FormInputGroup, TimeRangePicker, } from '@/components'
import { TargetFeatureItem } from '@/config/CommonType'
import { ResultRowType } from '@/pages/Search/Target/interface'
import { Icon, CloseCircleFilled } from '@yisa/webui/es/Icon'
import { Tabs, Message, Form, TreeSelect, Checkbox, Input, Select, Button } from "@yisa/webui"
import dictionary from '@/config/character.config'
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { LocationMapListCallBack } from '@/components/LocationMapList/interface'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import dayjs from 'dayjs'
import ajax from '@/services'
import { useSelector, RootState } from '@/store';
import MoreIcon from '@/assets/images/record/more-search-icon.png'
import omit from '@/utils/omit'
import pick from '@/utils/pick'
import { FormDataProps, CaptureData, PlateTypes, LabelData, SearchFormType } from './interface'
import BlackList from './BlackList'
import useShowFormItem from "./hooks//useShowFormItem"
import type { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { useResetState } from "ahooks";

const SearchInput = forwardRef((props: any, ref) => {
  const {
    className = "",
    searchType = 'search',
    defaultFormData,
    defaultCaptureData,
    defaultSearchForm,
    onSearch,
    onOpenRecordNum,
    onChangeSeacrhForm,
    onImportData,
    onAuthApprove,
    type = "default", //样式风格
  } = props
  const imgUploadRef = useRef(null)
  const prefixCls = 'record-search-input-home'

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-search'] || {}
  });

  //检索数据之后重新请求历史记录
  useImperativeHandle(ref, () => {
    return {
      getHistoryData
    }
  })

  //刷新上传历史
  const [flushHistory, setFlushHistory] = useState<boolean>(false)
  // 上传图片相关参数 , 这两种类型不兼容，虽然可以放两种数据，但是传递到组件的只能一种数据
  const [featureList, setFeatureList] = useState<(TargetFeatureItem | ResultRowType)[]>([])
  //特征数组改变事件
  const handleChangeFeatureList = (list: (TargetFeatureItem | ResultRowType)[], type: string = '') => {
    setFeatureList(list)
    if (type == 'cancel') {
      setFeatureList([])
      if (!list.length) return
      window.open(`#/image?featureList=${encodeURIComponent(JSON.stringify(list))}`)
    }
  }

  // 检索历史内容
  const [historySearch, setHistorySearch] = useState<string[]>([])
  // 点击历史记录
  const handleClickHistoryItem = (value: string) => {
    setSearchForm({
      ...initSearchForm,
      searchValue: value
    })
    setFormData(initFormData)
    // setCaptureData(initCaptureData)
  }

  // 身份信息检索参数
  const initFormData: FormDataProps = {
    plateColorTypeId: -1,
    personName: '',
    idType: '111',
    idNumber: '',
    noplate: '',
    plateColor: -1,
    licensePlate: '',
    vehicleLabels: [],
    label: [],
    phone: '',
    householdAddress: '',
    noLocal: false,
    residentialAddress: '',
    // city: [],
    age: ['', ''],
    // minAge: '',
    // maxAge: '',
    minor: false,
    profileType: '1',
    captureCount: ['', ''],
    // minCaptureTimes: '',
    // maxCaptureTimes: '',
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    offlineIds: [],
  }
  // const initCaptureData: CaptureData = {

  // }
  const initSearchForm: SearchFormType = {
    searchType: "",//检索类型-是否需要排序  ''关键词 person group更多条件检索
    searchValue: "",//关键词-搜索内容
    searchInfo: "",//精准检索-检索条件展示
    activeMoreKey: 'person'//精准条件检索-检索类型
  }

  const [formData, setFormData, resetFormData] = useResetState<FormDataProps>(defaultFormData ? defaultFormData : initFormData)
  const formDataRef = useRef(formData)
  formDataRef.current = formData
  // 抓拍图像检索参数
  // const [captureData, setCaptureData] = useState<CaptureData>(defaultCaptureData ? defaultCaptureData : initCaptureData)
  // const captureDataRef = useRef(captureData)
  // captureDataRef.current = captureData
  const [searchForm, setSearchForm] = useState<SearchFormType>(defaultSearchForm ? defaultSearchForm : initSearchForm)
  const searchFormRef = useRef(searchForm)
  searchFormRef.current = searchForm

  // 缓存精准检索类型
  const activeMoreKeyRef = useRef(searchForm.activeMoreKey)
  const [curRecordType, setCurRecordType] = useState(dictionary.recordType[0].value)
  const isShowTab = dictionary.recordType.find(item => item.value === curRecordType)?.showTab
  const showFormItem = useShowFormItem(curRecordType)

  useEffect(() => {
    if (defaultFormData && JSON.stringify(formData) != JSON.stringify(defaultFormData)) {
      if (defaultFormData?.profileType == "3") {
        setFormData({ ...defaultFormData, profileType: undefined })
        setProfileTypeCheck(true)
      } else {
        setFormData(defaultFormData)
      }
    }
    // if (defaultCaptureData && JSON.stringify(captureData) != JSON.stringify(defaultCaptureData)) {
    //   setCaptureData(defaultCaptureData)
    // }
  }, [defaultFormData, defaultCaptureData])
  useEffect(() => {
    if (defaultSearchForm) {
      setSearchForm(defaultSearchForm)
      activeMoreKeyRef.current = defaultSearchForm.activeMoreKey
    }
  }, [JSON.stringify(defaultSearchForm)])

  // 修改精选条件检索-检索类型
  const handleChangeMoreKey = (key: string) => {
    setSearchForm({
      ...searchForm,
      activeMoreKey: key
    })
  }

  // 删除精准检索-检索条件展示
  const handleDelSearch = () => {
    setSearchForm({
      searchType: '',
      searchValue: '',
      searchInfo: '',
      activeMoreKey: 'person'
    })
    // 更改父组件状态
    onChangeSeacrhForm && onChangeSeacrhForm({
      searchType: '',
      searchValue: '',
      searchInfo: '',
      activeMoreKey: 'person'
    })
    setFormData(initFormData)
    // setCaptureData(initCaptureData)
    setProfileTypeCheck(false)
  }

  // 部署地
  const [cityBlack, setCityBlack] = useState('')
  // 区域数据
  const [placeData, setPlaceData] = useState<any[]>([])
  // 人员标签
  const [labelData, setLabelData] = useState<LabelData[]>([])
  // 车辆标签
  const [vehicleLabelData, setVehicleLabelData] = useState<LabelData[]>([])
  // 搜索内容
  const handleChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchForm({
      ...searchForm,
      searchValue: e.target.value
    })
  }

  const handlePlateChange = (value: PlateTypes, type: string) => {
    setFormData(Object.assign({}, formData, {
      licensePlate: value.plateNumber,
      plateColorTypeId: value.plateTypeId,
      plateColor: value.plateTypeId,
      noplate: (value.noplate as 'noplate' | '')
    }))
  }
  const handleSelectChange = (value: SelectCommonProps['value'], type: string) => {
    let _form = { ...formData, [type]: value }
    if (type === "profileType" && value === "3") {
      _form = { ..._form, captureCount: ['', ''] }
      setProfileTypeCheck(false)
    }
    setFormData(_form)
  }
  // 改变年龄\抓拍次数
  const handleChangeInputGroup = (value: { min: string | number, max: string | number }, type: string) => {
    setFormData({
      ...formData,
      [type]: [(value.min || value.min == 0) ? value.min : '', (value.max || value.max == 0) ? value.max : '']
    })
  }
  /* **********抓拍信息检索*********** */
  const handleLocationChange = (v: LocationMapListCallBack) => {
    setFormData(Object.assign({}, formData, {
      ...v,
      locationIds: [...v.locationIds],
      offlineIds: v.offlineIds,
    }))
  }
  const handleDateChange = (v: DatesParamsType) => {
    setFormData(Object.assign({}, formData, {
      ...v
    }))
  }
  /* **********end*********** */
  // 是否展示更多检索条件
  const [isMore, setIsMore] = useState('null')
  const isMoreRef = useRef(isMore)
  isMoreRef.current = isMore

  const handleCancelMore = () => {
    setIsMore('close')
    setSearchForm(Object.assign({}, searchForm, {
      activeMoreKey: activeMoreKeyRef.current || searchForm.activeMoreKey
    }))
  }

  // 获取区域数据
  const getPlaceData = () => {
    ajax.record.getPlaceData<any, any>({})
      .then(res => {
        console.log(res);
        if (res.data) {
          setPlaceData(res.data)
          setCityBlack(res.regionCode)
        }
      })
      .catch(err => {
        console.log(err);
      })
  }
  //获取标签
  const getLabelData = () => {
    ajax.record.getPersonLabel<{ labelTypeId: "vehicle" | "personnel" }, LabelData[]>({ labelTypeId: "personnel" })
      .then(res => {
        console.log(res);
        if (res.data) {
          setLabelData(res.data)
        }
      })
  }

  // 获取车辆标签
  const getVehicleLabelData = () => {
    ajax.record.getPersonLabel<{ labelTypeId: "vehicle" | "personnel" }, LabelData[]>({ labelTypeId: "vehicle" })
      .then(res => {
        // console.log(res);
        if (res.data) {
          setVehicleLabelData(res.data)
        }
      })
  }
  // 获取历史记录
  const getHistoryData = () => {
    ajax.record.getHistoryData<any, string[]>()
      .then(res => {
        if (res.data) {
          setHistorySearch(res.data)
        }
      })
  }

  const renderFormat = useCallback((valueShow: string[]) => {
    return valueShow.join('-')
  }, [])


  // 格式化参数
  const formateCaptureData = (form: CaptureData) => {
    let newForm = { ...form }
    // 格式化参数
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
    // newForm['locationIds'] = [...form.locationIds, ...form.locationGroupIds]
    newForm['offlineIds'] = [...form.offlineIds]
    return newForm
  }
  // 判断是否通过校验
  const omitFormData = (form: FormDataProps, keys: string[]) => {
    let flag = true;
    let newFormData = omit(form, keys)
    // 判断是否可以检索
    flag = Object.keys(newFormData).some(ele => {
      if (ele == 'householdAddress') {
        if (!formDataRef.current.noLocal) {
          return formDataRef.current.householdAddress
        } else {
          return true
        }
      }
      if (ele == 'label') {
        return formDataRef.current.label?.length
      }
      if (ele == 'vehicleLabels') {
        return formDataRef.current.vehicleLabels?.length
      }
      if (ele == 'profileType') {
        if (!profileTypeCheck) {
          if (formDataRef.current.captureCount && formDataRef.current.captureCount.length) {
            return formDataRef.current.captureCount.some(ele => ele)
          } else {
            return false
          }
        } else {
          return true
        }
      }
      if (ele == 'age') {
        if (!formDataRef.current.minor) {
          if (formDataRef.current.age && formDataRef.current.age.length) {
            return formDataRef.current.age.some(ele => ele)
          } else {
            return false
          }
        } else {
          return true
        }
      }
      return newFormData[ele]
    })
    return flag
  }
  const handleRecordTypeChange = (value?: SelectCommonProps['value']) => {
    if (typeof value === "string") setCurRecordType(value)
  }

  // 点击查询按钮
  const handleSearch = () => {
    let resultData;
    // 精选条件检索
    if (isMoreRef.current == 'open' || searchFormRef.current.searchType) {
      if (searchFormRef.current.activeMoreKey == 'person') {
        let flag = omitFormData(formDataRef.current, ['idType', 'plateColorTypeId', 'noplate', 'noLocal', 'plateColor', 'sort', 'searchType', 'minor', 'captureCount'])
        if (flag) {
          resultData = {
            data: {
              ...formateCaptureData(formDataRef.current),
              profileType: profileTypeCheck ? "3" : formDataRef.current.profileType
            },
            searchType: '1'
          }
        } else {
          Message.warning('请至少输入一项条件')
          return
        }
      } else if (searchFormRef.current.activeMoreKey == 'vehicle') {

        let newFormData = pick(formDataRef.current, ["licensePlate", "plateColor", "noplate", "vehicleLabels", "personName", 'idType', 'idNumber'])
        resultData = { data: newFormData, searchType: '2' }
      }
      // } else {
      //   let dateRangeMax = Number(pageConfig.timeRange?.max || 0)
      //   if (dateRangeMax) {
      //     let timeDiff = dayjs(captureDataRef.current.endDate).diff(dayjs(captureDataRef.current.beginDate), 'days') + 1
      //     if (timeDiff > dateRangeMax) {
      //       Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
      //       return
      //     }
      //   }
      //   let data = formateCaptureData(captureDataRef.current)
      //   resultData = { data, searchType: '2' }
      // }
    } else {
      if (!searchFormRef.current.searchValue) {
        Message.warning('请输入关键词搜索')
        return
      }
      resultData = { searchType: '', text: searchFormRef.current.searchValue }
    }
    setIsMore('close')
    activeMoreKeyRef.current = resultData?.searchType == '2' ? 'vehicle' : 'person'
    onSearch && onSearch(resultData)
  }

  const handleAgeRange = (data: string[]) => {
    setFormData({
      ...formData,
      age: data
    })
  }

  const [profileTypeCheck, setProfileTypeCheck] = useState(false)
  const handleProfileTypeChange = (e: CheckboxChangeEvent) => {
    setFormData(Object.assign({}, formData, {
      profileType: e.target.checked ? undefined : '1',
      captureCount: ['', '']
    }))
    setProfileTypeCheck(e.target.checked)
  }

  const handleReset = () => {
    resetFormData()
    setProfileTypeCheck(false)
  }

  useEffect(() => {
    if (searchForm.activeMoreKey === "vehicle") {
      getVehicleLabelData()
    }
  }, [searchForm.activeMoreKey])

  useEffect(() => {
    // getPlaceData()
    getLabelData()
    getHistoryData()

    window.addEventListener('keydown', (e) => {
      if (e.keyCode == 13 && isMoreRef.current == 'open') {
        handleSearch()
      }
    })
    return () => {
      window.removeEventListener('keydown', () => {

      })
    }
  }, [])


  return <div className={`${prefixCls} ${className} ${type === "technology" ? "ysd-search-technology" : ""}`}>
    {
      searchType == 'search' ?
        <div className="more-search-btn">
          {/* <Icon type="quanbugongneng" /> */}
          <div className="btn" onClick={() => setIsMore('open')}>
            <img src={MoreIcon} alt="" />
            更多检索条件
          </div>
        </div>
        : ''
    }
    <div className={`search-input ${isMore == 'open' ? 'search-input-disabled' : ''}`}>
      <div className={`more-search-groups ${isMore == 'open' ? 'more-search-open' : isMore == 'close' ? 'more-search-retract' : ''}`}>
        <div className="clost-btn" onClick={handleCancelMore}><Icon type="quxiao" /></div>
        {
          isShowTab && <Tabs
            className={`more-search-tabs`}
            defaultActiveKey={searchForm.activeMoreKey}
            activeKey={searchForm.activeMoreKey}
            type='line'
            onChange={handleChangeMoreKey}
            data={[
              { key: 'person', name: '聚类组/身份检索' },
              // { key: 'group', name: '抓拍图像检索' }
              { key: 'vehicle', name: '车辆检索' }
            ]}
          />
        }
        <div className="tab-content">
          {
            searchForm.activeMoreKey == 'person' ?
              <div className="search-items">
                <Form layout="vertical">
                  {
                    showFormItem.includes("personName") && <Form.Item className="person-name" colon={false} label={'人员姓名'}>
                      <Input
                        placeholder="请输入"
                        value={formData.personName}
                        onChange={(e) => { setFormData({ ...formData, personName: e.target.value }) }}
                      />
                    </Form.Item>
                  }
                  {
                    //TODO :CHANGE
                    // showFormItem.includes("idccard") &&
                    <Form.Item className="id-card" colon={false} label={'证件号'}>
                      <div className="type-id">
                        <Select
                          className="ysd-select-technology"
                          dropdownClassName="ysd-select-technology-menu"
                          options={[{ value: '111', label: '身份证', }, { value: '414', label: '护照' },
                            // { value: '123', label: '警官证' }
                          ]}
                          style={{ width: 120 }}
                          value={formData.idType}
                          onChange={(value) => handleSelectChange(value, 'idType')}
                        />
                        <Input
                          value={formData.idNumber}
                          onChange={(e) => { setFormData({ ...formData, idNumber: e.target.value }) }}
                        />
                      </div>
                    </Form.Item>
                  }
                  {/* {
                    //TODO :CHANGE
                    // showFormItem.includes("plateNumber") &&
                    <Form.Item colon={false} label={'车牌号码'}>
                      <FormPlate
                        dropdownMenuClassName="ysd-select-technology-menu"
                        dropdownMenuLabelClassName="ysd-select-technology"
                        isShowKeyboard
                        disabled={featureList.length ? true : false}
                        value={{
                          plateNumber: formData.licensePlate || '',
                          plateTypeId: formData.plateColorTypeId || -1,
                          noplate: (formData.noplate as 'noplate' | '')
                        }}
                        onChange={(value) => { handlePlateChange(value, "licensePlate") }}
                      />
                    </Form.Item>
                  } */}
                  {
                    //TODO ：CHANGE:人员标签=》标签
                    showFormItem.includes("personTags") && <Form.Item label="人员标签"
                      className="person-label"
                      colon={false}
                    >
                      <TreeSelect
                        className="ysd-tree-select-techonology"
                        dropMenuClassName="ysd-tree-select-techonology-menu"
                        multiple
                        treeCheckable
                        maxTagCount={1}
                        treeData={labelData}
                        showSearch={true}
                        fieldNames={{
                          key: "id",
                          title: 'name',
                          children: 'labels'
                        }}
                        treeCheckedStrategy={TreeSelect.SHOW_CHILD}
                        onChange={(value) => handleSelectChange(value, 'label')}
                        value={formData.label}
                      />
                    </Form.Item>
                  }
                  {/* {
                    showFormItem.includes("tel") && <Form.Item className="person-tel" colon={false} label={'联系方式'}>
                      <Input
                        value={formData.phone}
                        onChange={(e) => { setFormData({ ...formData, phone: e.target.value }) }}
                      />
                    </Form.Item>
                  } */}
                  {
                    showFormItem.includes("domicileAddress") && <Form.Item className="native-place" colon={false} label={'户籍地址'}>
                      <div className="place-box">
                        <Input
                          disabled={formData.noLocal}
                          value={formData.householdAddress}
                          onChange={(e) => { setFormData({ ...formData, householdAddress: e.target.value }) }}
                        />
                        <div className="unplace">
                          <Checkbox onChange={(e) => {
                            setFormData(Object.assign({}, formData, {
                              noLocal: e.target.checked
                            }))
                          }}
                            checked={formData.noLocal}
                            className="ysd-checkbox-techonology"
                          >
                            非本地
                          </Checkbox>
                        </div>
                      </div>
                    </Form.Item>
                  }
                  {
                    showFormItem.includes("address") && <Form.Item className="detail-address" colon={false} label={'现住址'}>
                      <Input
                        value={formData.residentialAddress}
                        onChange={(e) => { setFormData({ ...formData, residentialAddress: e.target.value }) }}
                      />
                    </Form.Item>
                  }
                  {
                    showFormItem.includes("age") && <Form.Item label="年龄"
                      className="person-age input-group"
                      colon={false}
                    >
                      <div className="age-box">
                        <FormInputGroup
                          disabled={formData.minor}
                          defaultMin={0}
                          defaultValueMin={formData.age && (formData.age[0] || formData.age[0] == '0') ? formData.age[0] : ''}
                          defaultValueMax={formData.age && (formData.age[1] || formData.age[1] == '0') ? formData.age[1] : ''}
                          type="number"
                          splitText=" - "
                          onChange={(value: { min: string | number, max: string | number }) => handleChangeInputGroup(value, 'age')}
                        />
                        <div className="minority">
                          {/* <Checkbox onChange={(e) => {
                            setFormData(Object.assign({}, formData, {
                              minor: e.target.checked
                            }))
                          }}
                            checked={formData.minor}
                            className="ysd-checkbox-techonology"
                          >
                            未成年
                          </Checkbox> */}
                          {
                            dictionary.ageRange.map(item => <span key={item.label} onClick={() => handleAgeRange(item.range)}>{item.label}</span>)
                          }
                        </div>
                      </div>
                    </Form.Item>
                  }
                  {
                    //TODO:CHANGE
                    // (showFormItem.includes("captureFace") || showFormItem.includes("driverFace")) &&
                    <Form.Item label={`${showFormItem.includes("captureFace") ? "人脸抓拍数" : "人脸抓拍数"}`}
                      className="person-times input-group"
                      colon={false}
                    >
                      <div className="times-box">
                        <Select
                          dropdownClassName="ysd-select-technology-menu"
                          className="ysd-select-technology"
                          options={[
                            // {
                            //   label: '无抓拍人脸',
                            //   value: '3'
                            // },
                            {
                              label: '普通聚类',
                              value: '1'
                            },
                            {
                              label: '驾乘聚类',
                              value: '2'
                            }
                          ]}
                          style={{ width: '110px' }}
                          value={formData.profileType}
                          onChange={(value) => handleSelectChange(value, 'profileType')}
                        />
                        <FormInputGroup
                          disabled={formData.profileType == '3' || profileTypeCheck}
                          defaultMin={1}
                          defaultValueMin={formData.captureCount && formData.captureCount[0] ? formData.captureCount[0] : ''}
                          defaultValueMax={formData.captureCount && formData.captureCount[1] ? formData.captureCount[1] : ''}
                          placeholder={['', '']}
                          type="number"
                          splitText=" - "
                          onChange={(value: { min: string | number, max: string | number }) => handleChangeInputGroup(value, 'captureCount')}
                        />
                        <div className="minority">
                          <Checkbox
                            onChange={handleProfileTypeChange}
                            checked={profileTypeCheck}
                          >
                            实名人员
                          </Checkbox>
                        </div>
                      </div>
                    </Form.Item>
                  }
                  <LocationMapList
                    formItemProps={{ label: '数据源' }}
                    title="选择点位"
                    onlyLocationFlag={true}
                    tagTypes={dictionary.tagTypes.slice(0, 2)}
                    locationIds={formData.locationIds}
                    locationGroupIds={formData.locationGroupIds}
                    offlineIds={formData.offlineIds}
                    onChange={handleLocationChange}
                    themeType={type}
                    disabled={profileTypeCheck}
                  />
                  <TimeRangePicker
                    formItemProps={{ label: '时间范围' }}
                    beginDate={formData.beginDate}
                    endDate={formData.endDate}
                    beginTime={formData.beginTime}
                    endTime={formData.endTime}
                    timeType={formData.timeType}
                    onChange={handleDateChange}
                    themeType={type}
                    allowClear
                    disabled={profileTypeCheck}
                  />
                  <Form.Item label=" " colon={false} className='reset-btn-wrap'>
                    <Button onClick={handleReset} type='default' className="reset-btn" >重置</Button>
                  </Form.Item>
                </Form>
              </div>
              :
              <div className="search-groups-info search-group">
                <div className="search-items">
                  <Form layout="vertical">
                    <Form.Item colon={false} label={'车牌号码'}>
                      <FormPlate
                        isShowKeyboard
                        disabled={featureList.length ? true : false}
                        getTriggerContainer={() => document.body}
                        value={{
                          plateNumber: formData.licensePlate || '',
                          plateTypeId: formData.plateColorTypeId || -1,
                          noplate: (formData.noplate as 'noplate' | '')
                        }}
                        onChange={(value) => { handlePlateChange(value, "licensePlate") }}
                        dropdownMenuClassName="ysd-select-technology-menu"
                        keyboardClassName="plate-keyboard-box-technology"
                      />
                    </Form.Item>

                    <Form.Item label="车辆标签"
                      className="person-label"
                      colon={false}
                    >
                      <TreeSelect
                        multiple
                        treeCheckable
                        maxTagCount={1}
                        treeData={vehicleLabelData}
                        showSearch={true}
                        fieldNames={{
                          key: "id",
                          title: 'name',
                          children: 'labels'
                        }}
                        treeCheckedStrategy={TreeSelect.SHOW_CHILD}
                        onChange={(value) => handleSelectChange(value, 'vehicleLabels')}
                        value={formData.vehicleLabels}
                        className={"ysd-tree-select-techonology"}
                        dropMenuClassName={"ysd-tree-select-techonology-menu"}
                      />
                    </Form.Item>
                    <Form.Item className="person-name" colon={false} label={'车主姓名'}>
                      <Input
                        value={formData.personName}
                        onChange={(e) => { setFormData({ ...formData, personName: e.target.value }) }}
                      />
                    </Form.Item>
                    <Form.Item className="id-card" colon={false} label={'证件号'}>
                      <div className="type-id">
                        <Select
                          className="ysd-select-technology"
                          dropdownClassName="ysd-select-technology-menu"
                          options={[{ value: '111', label: '身份证', }, { value: '414', label: '护照' },
                            // { value: '123', label: '警官证' }
                          ]}
                          style={{ width: '110px' }}
                          value={formData.idType}
                          onChange={(value) => handleSelectChange(value, 'idType')}
                          getTriggerContainer={() => document.querySelector('.type-id') as HTMLElement}
                        />
                        <Input
                          value={formData.idNumber}
                          onChange={(e) => { setFormData({ ...formData, idNumber: e.target.value }) }}
                        />
                      </div>
                    </Form.Item>
                    <Form.Item label=" " colon={false} className='reset-btn-wrap'>
                      <Button onClick={handleReset} type='default' className="reset-btn" >重置</Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
          }
        </div>
      </div>
      {
        searchForm.searchType
          ? <div className="input-box">
            <div className="input-value" onClick={() => {
              setIsMore('open')
            }} title={searchForm.searchInfo}>{searchForm.searchInfo}</div>
            <div className="close-btn" onClick={handleDelSearch}><CloseCircleFilled /></div>
          </div>
          : <Input type="text"
            allowClear
            // prefix={searchType == 'list' ? <Icon type="sousuo" /> : ''}
            placeholder={dictionary.recordType.find(item => item.value === curRecordType)?.describtion || ""}
            disabled={isMore == 'open'}
            value={isMore == 'open' ? '' : searchForm.searchValue}
            onChange={handleChangeSearchInput}
            onPressEnter={handleSearch}
          //TODO：CHANGE：新版检索
          // addBefore={
          //   <Select
          //     className="ysd-select-technology"
          //     dropdownClassName="ysd-select-technology-menu"
          //     disabled={isMore === "open"}
          //     value={curRecordType}
          //     onChange={handleRecordTypeChange}
          //     options={dictionary.recordType}
          //     bordered={false}
          //     style={{ width: 100 }}
          //   //@ts-ignore
          //   // getTriggerContainer={(triggerNode) => triggerNode.parentNode}

          //   />
          // }
          />
      }
      <div className="upload">
        <ImgUpload
          ref={imgUploadRef}
          limit={1}
          multiple={true}
          showConfirmBtn={false}
          showHistory={false}
          innerSlot={<Icon type="danganshangchuantupian" />}
          flushHistory={flushHistory}
          onFlushHistoryComplete={() => { setFlushHistory(false) }}
          featureList={featureList as TargetFeatureItem[]}
          onChange={handleChangeFeatureList}
          className="record-imgupload"
          uploadType={true}
        /></div>
      <div className={`search-btn`} onClick={handleSearch}>
        {
          searchType == 'search' ? <Icon type="dangansousuo" /> : <span>检&nbsp;&nbsp;索</span>
        }
      </div>
    </div>
    <div className="bottom-options">
      <div className="history-search-groups">
        <Icon type="lishi" />
        <div className="history-info">
          <div>历史:</div>
          {
            historySearch.map((ele: any, index: number) => {
              return <div onClick={() => handleClickHistoryItem(ele)}
                title={ele}
                className="history-item"
              >
                <div className="info">{ele}</div>
                {index !== historySearch.length - 1 ? <span></span> : ''}
              </div>
            })
          }
        </div>
      </div>
      {
        searchType == 'search'
          ? <div className="more-btn">
            <div className="more-btn-item" onClick={() => { onImportData?.("person") }}>导入人员</div>
            <div className="more-btn-item" onClick={() => { onImportData?.("car") }}>导入车辆</div>
            <div className="more-btn-item" onClick={onAuthApprove}>权限审批</div>
            <BlackList />
          </div>
          : searchType == 'list' ?
            <div className="more-search-btn">
              <div className="btn" onClick={() => setIsMore('open')}>
                <Icon type="gengduojiansuotiaojian" />
                更多检索条件
              </div>
            </div>
            : ''
      }
    </div>
  </div >
})
export default SearchInput
