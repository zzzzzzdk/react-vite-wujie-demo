
import { useEffect, useRef, useState, useCallback } from 'react'
import { ImgUpload, TimeRangePicker, FormPlate, LocationMapList, FormInputGroup, FormRadioGroup } from '@/components'
import { UploadButtonProps } from "@/components/ImgUpload/interface";
import { TargetFeatureItem } from '@/config/CommonType'
import { ResultRowType } from '@/pages/Search/Target/interface'
import { LocationMapListCallBack } from '@/components/LocationMapList/interface'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { LoadingOutlined, PlusOutlined } from '@yisa/webui/es/Icon'
import { Button, Tabs, Upload, Message, Form, Space, Modal, Cascader, Checkbox, Input, Select, Radio, Image, Pagination, TreeSelect } from "@yisa/webui"
import dictionary from '@/config/character.config'
import { useNavigate } from 'react-router'
import { ResultBox } from '@yisa/webui_business'
import Card from "@/components/Card";
import dayjs from 'dayjs'
import ajax, { ApiResponse } from '@/services'
import LabelRecordImg from '@/assets/images/record/label-record.png'
import PersonRecordImg from '@/assets/images/record/person-record.png'
import DriverFaceImg from '@/assets/images/record/driver-face-record.png'
import CapturedImg from '@/assets/images/record/capture-record.png'
import cookie from "@/utils/cookie";
import LabelLists from './LabelLists'
import './index.scss'
import { SortOrder } from '@/config/CommonType'
import { ResultDataProps, FormDataProps, RecordNumProps, SortField, LabelData } from './interface'

function UploadButton(props: UploadButtonProps) {
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

function RecordList() {
  const prefixCls = 'record-list'
  const navigate = useNavigate()

  // 信息档案类型
  const recordList: {
    type: string,//档案类型
    id: string,
    name: string,//档案名称
    icon: string,//档案图标
    data: { realName?: number, cluster?: number },//档案数据参数{realName:0 全部 1 实名 2 未实名,cluster:0 全部 1 抓拍人脸 2 驾乘人脸}
    children: { type: string, id: string, name: string, data: { realName?: number, cluster?: number } }[]//子档案
  }[] = [
      {
        type: 'person',
        id: 'person',
        name: '人员信息档案',
        icon: PersonRecordImg,
        data: {
          realName: 1,
          cluster: 0,
        },
        children: [
          // { type: 'person-capture', name: '抓拍人脸聚类', },
          // { type: 'person-dirver', name: '驾乘人脸聚类', },
        ]
      },
      {
        type: 'face',
        id: 'face',
        name: '抓拍人脸聚类档案',
        icon: CapturedImg,
        data: {
          realName: 0,
          cluster: 1,
        },
        children: [
          {
            type: 'face-real',
            id: 'faceReal',
            name: '已实名聚类',
            data: {
              realName: 1,
              cluster: 1,
            },
          },
          {
            type: 'face-unreal',
            id: 'faceUnReal',
            name: '未实名聚类',
            data: {
              realName: 2,
              cluster: 1,
            },
          },
        ]
      },
      {
        type: 'driver',
        id: 'driver',
        name: '驾乘人脸聚类档案',
        icon: DriverFaceImg,
        data: {
          realName: 0,
          cluster: 2,
        },

        children: [
          {
            id: 'driverReal',
            type: 'driver-real', name: '已实名聚类',
            data: {
              realName: 1,
              cluster: 2,
            },
          },
          {
            id: 'driverUnReal',
            type: 'driver-unreal', name: '未实名聚类',
            data: {
              realName: 2,
              cluster: 2,
            },
          },
        ]
      },
      {
        id: 'labelCount',
        type: 'label',
        icon: LabelRecordImg,
        name: '人员标签库(原人脸库)',
        data: {},
        children: []
      },
    ]

  // 档案数量
  const [recordTotalNum, setRecordTotalNum] = useState<RecordNumProps>({
    "person": 0,
    "face": 0,
    "faceReal": 0,
    "faceUnReal": 0,
    "driver": 0,
    "driverReal": 0,
    "driverUnReal": 0,
    "labelCount": 0,
  })

  // 档案类型
  const [activeRecordType, setActiveRecordType] = useState("person")
  // 更改档案类型
  const handleChangeRecordType = (key: string, data: { realName?: number, cluster?: number }) => {
    setActiveRecordType(key)
    setFormData({ ...defaultFormData, ...data })
    formDataRef.current = { ...defaultFormData, ...data }
    // 人员信息档案需用户手动点击检索-结果数据量大
    if (key.split('-')[0] !== 'label' && key.split('-')[0] !== 'person') {
      handleSearchBtnClick(key, data)
    } else {
      setResultData({
        status: 0,
        message: "请求成功",
        totalRecords: 0,
        usedTime: 0,
        data: []
      })
    }
  }

  // 检索类型
  const [searchType, setSearchType] = useState<string>('person')
  // 更改检索类型
  const handleChangeSearchType = (key: string) => {
    setSearchType(key)
    handleSearchBtnClick('', {}, key)
  }

  const defaultFormData: FormDataProps = {
    personName: '',
    idType: '1',
    idCard: '',
    personTel: '',
    licensePlate: '',
    plateColorTypeId: -1,
    noplate: '',
    personLabel: '',
    address: '',
    city: [],
    minAge: '',
    maxAge: '',
    minCaptureTimes: '',
    maxCaptureTimes: '',
    realName: 0,
    cluster: 0,
    pageNo: 1, //分页只有在表格分组的时候用到
    pageSize: dictionary.pageSizeOptions[0],
    sort: {
      field: 'captureTime',
      order: 'asc'
    },
  }
  const [formData, setFormData] = useState<FormDataProps>(defaultFormData)
  const formDataRef = useRef(formData)
  formDataRef.current = formData
  const imgUploadRef = useRef(null)

  // 抓拍图像检索数据
  const [captureData, setCaptureData] = useState({
    timeType: 'time',
    beginDate: dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    offlineIds: [],
  })

  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [firstLoading, setFirstLoading] = useState(true)

  // 档案结果数据
  const [resultData, setResultData] = useState<ApiResponse<ResultDataProps[]>>({
    status: 0,
    message: "请求成功",
    totalRecords: 0,
    usedTime: 0,
    data: []
  })

  //相似度大图-比中项
  const [opensimilarityModal, setOpensimilarityModal] = useState(false)
  const currentMatches = useRef<ResultRowType>()

  // 籍贯下拉是否禁用
  const [isPlace, setIsPlace] = useState<boolean>(false)

  // 相似度类型 1-聚类 2 以图
  // 无图时相似度展示为聚类 有图时展示为以图
  const [similarType, setSimilarType] = useState('1')

  //刷新上传历史
  const [flushHistory, setFlushHistory] = useState(false)
  // 上传图片相关参数 , 这两种类型不兼容，虽然可以放两种数据，但是传递到组件的只能一种数据
  const [featureList, setFeatureList] = useState<(TargetFeatureItem | ResultRowType)[]>([])

  /* **********证件照/身份检索*********** */
  //特征数组改变事件
  const handleChangeFeatureList = (list: (TargetFeatureItem | ResultRowType)[]) => {
    setFeatureList(list)
    // 无图时相似度展示为聚类 有图时展示为以图
    if (list.length) {
      setSimilarType('2')
    } else {
      setSimilarType('1')
      setFormData({
        ...formData,
        licensePlate: '',
        plateColorTypeId: -1,
        noplate: ''
      })
    }
  }

  const handlePlateChange = (value: { plateNumber: string, plateTypeId: number, noplate: String }, type: string) => {
    setFormData(Object.assign({}, formData, {
      licensePlate: value.plateNumber,
      plateColorTypeId: value.plateTypeId,
      noplate: (value.noplate as 'noplate' | '')
    }))
  }

  const handleSelectChange = (value: SelectCommonProps['value'], type: string) => {
    setFormData({
      ...formData,
      [type]: value
    })
  }

  const renderFormat = useCallback((valueShow: string[]) => {
    return valueShow.join('-')
  }, [])
  /* **********end*********** */

  /* **********抓拍信息检索*********** */
  const handleLocationChange = (v: LocationMapListCallBack) => {
    setCaptureData(Object.assign({}, captureData, {
      ...v,
      locationIds: [...v.locationIds, ...v.locationGroupIds]
    }))
  }
  const handleDateChange = (v: DatesParamsType) => {
    setCaptureData(Object.assign({}, captureData, {
      ...v
    }))
  }
  /* **********end*********** */

  /* **********卡片事件*********** */
  const handleOpenBigImg = (index: number) => {
    // window.event?.preventDefault()
    // console.log(index)
  }

  //比中点击
  const handlesimilarityNumberClick = (cardData: ResultRowType, index: number) => {
    currentMatches.current = cardData
    setOpensimilarityModal(true)
  }
  /* **********end*********** */
  // 部署地
  const [cityBlack, setCityBlack] = useState('')
  // 区域数据
  const [placeData, setPlaceData] = useState<any[]>([])
  // 人员标签
  const [labelData, setLabelData] = useState<LabelData[]>([])

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
  // 获取档案数量
  const getRecordNum = () => {
    ajax.record.getRecordNum<any, RecordNumProps>({})
      .then(res => {
        console.log(res);
        if (res.data) {
          setRecordTotalNum(res.data)
        }
      })
  }
  useEffect(() => {
    getPlaceData()
    getLabelData()
    getRecordNum()
  }, [])

  // 检索结果 key 为左侧档案类型 params 为左侧档案参数 method 为右侧获取数据方法
  const handleSearchBtnClick = (key: string = '', params: { realName?: number, cluster?: number } = {}, method: string = '') => {
    let activeKey = key || activeRecordType
    let activeMethod = method || searchType
    let data: any = {
      searcgMethod: activeMethod,
      pageNo: formDataRef.current.pageNo,
      pageSize: formDataRef.current.pageSize,
      sort: formDataRef.current.sort,
      cityBlack: isPlace ? cityBlack : '',
      ...params,
    }
    if (activeMethod == 'person') {
      if (Number(formDataRef.current.minAge) < 0 || Number(formDataRef.current.maxAge) < 0) {
        Message.warning('年龄不可为负数')
        return
      }
      if (Number(formDataRef.current.minCaptureTimes) < 0 || Number(formDataRef.current.maxCaptureTimes) < 0) {
        Message.warning('抓拍次数不可为负数')
        return
      }
      if (Number(formDataRef.current.minAge) > Number(formDataRef.current.maxAge) || Number(formDataRef.current.minCaptureTimes) > Number(formDataRef.current.maxCaptureTimes)) {
        Message.warning('最小值不可大于最大值')
        return
      }
      // 对身份证号进行校验
      if (formDataRef.current.idType == '1' && formDataRef.current.idCard) {
        let req = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
        if (!req.test(formDataRef.current.idCard)) {
          Message.warning('请输入正确的身份证号')
          return
        }
      }
      // 对护照进行校验
      if (formDataRef.current.idType == '2' && formDataRef.current.idCard) {
        let req = /^([a-zA-z]|[0-9]){5,17}$/
        if (!req.test(formDataRef.current.idCard)) {
          Message.warning('请输入正确的护照')
          return
        }
      }
      // 未实名
      if (activeKey.split('-')[1] === 'unreal') {
        data.minCaptureTimes = formDataRef.current.minCaptureTimes
        data.maxCaptureTimes = formDataRef.current.maxCaptureTimes
        data.personLabel = formDataRef.current.personLabel
        data.featureList = featureList
      } else {
        data = {
          ...formDataRef.current,
          ...data,
          featureList,
        }
      }
    } else {
      data = {
        ...captureData,
        ...data,
        cluster: formDataRef.current.cluster,
        realName: formDataRef.current.realName
      }
    }

    firstLoading && setFirstLoading(false)
    setAjaxLoading(true)
    ajax.record.getRecordList<FormDataProps, ResultDataProps[]>(data)
      .then(res => {
        console.log(res);
        setAjaxLoading(false)
        setResultData(res)
      })
      .catch(err => console.log(err))

  }

  const [addLabelVisible, setAddLabelVisibel] = useState<boolean>(false)
  const [addPersonVisible, setAddPersonVisibel] = useState<boolean>(false)

  // 权限审批
  const handleApproval = () => {

  }
  // 添加标签
  const handleAddLabel = () => {
    setAddLabelVisibel(true)
  }
  // 新增人员
  const handleAddPerson = () => {
    setAddPersonVisibel(true)
  }

  const modalTabConfig: { key: string, name: string, disabled?: boolean }[] = [
    {
      key: '1',
      name: "手动录入",
    },
    {
      key: '2',
      name: "数智万象数据导入",
      disabled: true,
    },
  ];

  // 上传文件
  const handleBeforeUpload = (file: File, filesList: File[]) => {
    return true
  }

  const handleChangeRadio = () => {

  }

  // 跳转详情页
  const handleCardClick = (data: ResultDataProps, index: number) => {
    console.log(data)
    if (index == 0) {
      navigate(`/record-detail-person?${encodeURIComponent(JSON.stringify({ idNumber: '', groupId: '1' }))}`)
    } else {
      navigate(`/record-detail-person?${encodeURIComponent(JSON.stringify({ idNumber: 1, groupId: '1' }))}`)
    }
  }

  // 改变年龄\抓拍次数
  const handleChangeInputGroup = (value: { min: string | number, max: string | number }, type: string) => {
    let min = 'min' + type
    let max = 'max' + type
    setFormData({
      ...formData,
      [min]: value.min || '',
      [max]: value.max || ''
    })
  }

  // 结果数据每一行动态渲染数量
  const [listCount, setListCount] = useState(3)
  const handleRenderCard = () => {
    const { data = [] } = resultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          _template.push(
            <Card.PersonInfo
              key={data[j].infoId}
              showChecked={false}
              cardData={data[j]}
              // onImgClick={() => handleOpenBigImg(j)}
              onCardClick={() => handleCardClick(data[j], j)}
              onsimilarityNumberClick={(cardData: any) => handlesimilarityNumberClick(cardData, j)}
              similarType={similarType == '1' ? '聚类' : '以图'}
              showSimilarity={(activeRecordType == 'person' && similarType == '1') ? false : true}//人员档案&&无图片上传 -不展示相似度
              showCaptureNum={true}
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
  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 436
      const width = (document.querySelector('.result-content')?.clientWidth || 0) - 126 // 126为总间距
      const count = Math.floor(width / itemWidth)
      if (count >= 3 || count <= 2) {
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

  // const renderTag = (info: any) => {
  //   console.log(info);
  //   return <div className="ysd-tag ysd-tag-weaken ysd-tag-checked ysd-tag-has-close-icon ysd-input-tag-tag ysd-select-tag"
  //     >
  //     <span className="ysd-input-tag-tag-content" title="选项三">{info}</span>
  //     <div className="ysd-tag-close-btn" data-testid="tag-close-btn">
  //       <div className="ysd-icon ysd-icon-close-outlined">

  //       </div></div></div>
  // }

  // 修改排序
  const handleSortChange = (value: SortField, order: SortOrder | undefined) => {
    let newFormData = Object.assign({}, formData, {
      sort: {
        field: value,
        order: order
      }
    })
    setFormData(newFormData)
    formDataRef.current = newFormData
    handleSearchBtnClick()
  }

  // 修改分页
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData: FormDataProps;
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
    console.log(newFormData);

    setFormData(newFormData)
    formDataRef.current = newFormData
    handleSearchBtnClick()
  }
  // 分页配置
  const paginationConfig: PaginationProps = {
    current: formData.pageNo,
    pageSize: formData.pageSize,
    total: resultData.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: dictionary.pageSizeOptions,
    onChange: handlePageChange,
  };

  const download = (url: string, fileName = '未知文件') => {
    if (!url) return
    const a = document.createElement('a');
    a.style.display = 'none';
    a.setAttribute('target', '_blank');
    fileName && a.setAttribute('download', fileName);
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // 获取导入模板
  const handleExcel = () => {
    ajax.record.getExportExcel<any, any>({})
      .then(res => {
        if (res.data) {
          download(res.data)
        }
      })
  }
  return <div style={{ height: '100%' }} className={`${prefixCls}`}>
    <div className={`${prefixCls}-header`}>
      <div className="title">信息档案库</div>
      <div className="record-lists">
        {
          recordList.map(item => {
            return <div
              className={`record-item ${activeRecordType.split('-')[0] == item.type ? 'active-item' : ''}`}
              onClick={(e) => { handleChangeRecordType(item.type, item.data); e.stopPropagation() }}
              key={item.type}
            >
              <div
                className={`record-title ${activeRecordType == item.type ? 'active-record-title' : ''}`}
                onClick={(e) => { handleChangeRecordType(item.type, item.data); e.stopPropagation() }}
              >
                <img src={item.icon} alt='' />{item.name}({recordTotalNum[item.id]})
              </div>
              {
                item.children.length ?
                  item.children.map(ele => {
                    return <div className={`item-title ${activeRecordType == ele.type ? 'active-item-title' : ''}`}
                      key={ele.type}
                    >
                      <span onClick={(e) => { handleChangeRecordType(ele.type, ele.data); e.stopPropagation() }}>
                        {ele.name}({recordTotalNum[ele.id]})
                      </span>
                    </div>
                  })
                  : null
              }
            </div>
          })
        }
      </div>
    </div>
    <div className={`${prefixCls}-content`}>
      {
        activeRecordType == 'label' ?
          <LabelLists
            key="label"
          />
          : <>
            <div className="search-groups">
              <Tabs
                type='line'
                activeKey={searchType}
                onChange={handleChangeSearchType}
                className={`${prefixCls}-tab`}
                data={
                  activeRecordType.split('-')[0] == 'person'
                    ? [
                      { key: 'person', name: '证件照/身份检索' },
                      // { key: 'group', name: '抓拍图像检索' }
                    ]
                    : [
                      { key: 'person', name: '聚类组/身份检索' },
                      { key: 'group', name: '抓拍图像检索' }
                    ]}
              />
              {
                searchType == 'person' ?
                  <div className="search-groups-idcard search-group">
                    <ImgUpload
                      ref={imgUploadRef}
                      limit={1}
                      multiple={true}
                      showConfirmBtn={false}
                      innerSlot={<UploadButton />}
                      flushHistory={flushHistory}
                      onFlushHistoryComplete={() => { setFlushHistory(false) }}
                      featureList={featureList as TargetFeatureItem[]}
                      onChange={handleChangeFeatureList}
                    />
                    <div className="search-items">
                      <Form layout="vertical">
                        {
                          activeRecordType.split('-')[1] !== 'unreal' ?
                            <>
                              <Form.Item className="person-name" colon={false} label={'人员姓名'}>
                                <Input
                                  value={formData.personName}
                                  onChange={(e) => { setFormData({ ...formData, personName: e.target.value }) }}
                                />
                              </Form.Item>
                              <Form.Item className="id-card" colon={false} label={'证件号'}>
                                <div className="type-id">
                                  <Select
                                    options={[{ value: '1', label: '身份证', }, { value: '2', label: '护照' }, { value: '3', label: '警官证' }]}
                                    style={{ width: '110px' }}
                                    value={formData.idType}
                                    onChange={(value) => handleSelectChange(value, 'idType')}
                                  />
                                  <Input
                                    value={formData.idCard}
                                    onChange={(e) => { setFormData({ ...formData, idCard: e.target.value }) }}
                                  />
                                </div>
                              </Form.Item>
                              <Form.Item className="person-tel" colon={false} label={'联系方式'}>
                                <Input
                                  value={formData.personTel}
                                  onChange={(e) => { setFormData({ ...formData, personTel: e.target.value }) }}
                                />
                              </Form.Item>
                              <Form.Item colon={false} label={'车牌号码'}>
                                <FormPlate
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
                            </>
                            : null
                        }
                        <Form.Item
                          label="人员标签"
                          className="person-label"
                          colon={false}
                        >
                          <TreeSelect
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
                            onChange={(value) => handleSelectChange(value, 'personLabel')}
                            value={formData.personLabel}
                          />
                        </Form.Item>
                        <Form.Item
                          label="抓拍次数"
                          className="person-times input-group"
                          colon={false}
                        >
                          <FormInputGroup
                            defaultValueMin={formData.minCaptureTimes}
                            defaultValueMax={formData.maxCaptureTimes}
                            type="number"
                            splitText=" - "
                            onChange={(value: { min: string | number, max: string | number }) => handleChangeInputGroup(value, 'CaptureTimes')}
                          />
                        </Form.Item>
                        {
                          activeRecordType.split('-')[1] !== 'unreal' ?
                            <>
                              <Form.Item
                                label="籍贯"
                                className="native-place"
                                colon={false}
                              >
                                <div className="place-box">
                                  <Cascader
                                    defaultValue={formData.city}
                                    options={placeData}
                                    allowClear={true}
                                    onChange={(value) => {
                                      setFormData({
                                        ...formData,
                                        city: value
                                      })
                                    }}
                                    value={formData.city}
                                    unMountOnExit={true}
                                    showSearch={true}
                                    disabled={isPlace}
                                    // onClear={true}
                                    renderFormat={renderFormat}
                                    fieldNames={{
                                      "label": "name",
                                      "value": "id",
                                      "children": "nodes"
                                    }}
                                  />
                                  <div className="unplace">
                                    <Checkbox onChange={(e) => { setIsPlace(e.target.checked) }}>
                                      非本地
                                    </Checkbox>
                                  </div>
                                </div>
                              </Form.Item>
                              <Form.Item className="detail-address" colon={false} label={'详细地址'}>
                                <Input
                                  value={formData.address}
                                  onChange={(e) => { setFormData({ ...formData, address: e.target.value }) }}
                                />
                              </Form.Item>
                              <Form.Item
                                label="年龄"
                                className="person-age input-group"
                                colon={false}
                              >
                                <FormInputGroup
                                  defaultValueMin={formData.minAge}
                                  defaultValueMax={formData.maxAge}
                                  type="number"
                                  splitText=" - "
                                  onChange={(value: { min: string | number, max: string | number }) => handleChangeInputGroup(value, 'Age')}
                                />
                              </Form.Item>
                            </>
                            : null
                        }
                        <Form.Item colon={false} label={' '} style={{ marginLeft: 'auto' }}>
                          <Space size={16}>
                            <Button
                              loading={ajaxLoading}
                              onClick={() => handleSearchBtnClick()}
                              type='primary'
                            >
                              查询
                            </Button>
                          </Space>
                        </Form.Item>

                      </Form>
                    </div>
                  </div>
                  :
                  <div className="search-groups-info search-group">
                    <div className="search-items">
                      <TimeRangePicker
                        formItemProps={{ label: '时间范围' }}
                        beginDate={captureData.beginDate}
                        endDate={captureData.endDate}
                        beginTime={captureData.beginTime}
                        endTime={captureData.endTime}
                        onChange={handleDateChange}
                      />
                      <LocationMapList
                        formItemProps={{ label: '数据源' }}
                        title="选择点位"
                        onlyLocationFlag={true}
                        locationIds={captureData.locationIds}
                        locationGroupIds={captureData.locationGroupIds}
                        tagTypes={dictionary.tagTypes.slice(0, 2)}
                        onChange={handleLocationChange}
                      />
                      <Button
                        loading={ajaxLoading}
                        onClick={() => handleSearchBtnClick()}
                        type='primary'
                        className="search-btn"
                      >
                        查询
                      </Button>
                    </div>
                  </div>
              }
            </div>
            <div className="search-result">
              <div className="result-header">
                <div className="header-left">
                  共<span>{resultData.totalRecords}</span>条结果，用时<span>{resultData.usedTime}</span>秒
                </div>
                <div className="header-right">
                  {
                    activeRecordType.split('-')[0] === 'person'
                      ? null
                      : <FormRadioGroup
                        disabled={ajaxLoading}
                        isSort={true}
                        defaultValue={formData.sort.field}
                        defaultOrder={formData.sort.order}
                        yisaData={dictionary.recordSort}
                        onChange={handleSortChange}
                      />
                  }
                  <Button onClick={handleApproval}>权限审批</Button>
                  {/* <Button onClick={handleAddLabel}>添加标签</Button> */}
                  <Button onClick={handleAddPerson}>导入数据</Button>
                </div>
              </div>
              <div className="result-content">
                <ResultBox
                  loading={ajaxLoading}
                  nodata={!resultData?.data?.length}
                  nodataTip={firstLoading ? "" : "检索结果为空"}
                  nodataClass={firstLoading ? "first-coming" : ""}
                >
                  {handleRenderCard()}
                </ResultBox>
                {
                  resultData.totalRecords
                    ? <div className="result-pagination">
                      <Pagination {...paginationConfig} />
                    </div>
                    : null
                }
              </div>
            </div>
          </>
      }
    </div>
    {/* 添加标签 */}
    <Modal
      visible={addLabelVisible}
      onCancel={() => setAddLabelVisibel(false)}
      title="添加标签"
      width={663}
      className={`${prefixCls}-label-modal`}
    >
      <div className={`label-body`}>
        <div className="header">
          <Tabs
            className={`${prefixCls}-tabs`}
            defaultActiveKey={'1'}
            activeKey={'1'}
            onChange={(key) => { }}
            data={modalTabConfig}
          />
        </div>
        <div className="content">
          <div className="item">
            <div className="label">证件号码: </div>
            <div className="text">
              <Select />
            </div>
            <div className="label-system">进入标签系统</div>
          </div>
          <div className="item">
            <div className="label">上传文件: </div>
            <div className="text">
              <Upload
                action={`${window.YISACONF.api_host}/v1/targetretrieval/license-excel`}
                showUploadList={false}
                accept=".xlsx"
                onChange={() => { }}
                disabled={false}
                beforeUpload={handleBeforeUpload}
                headers={{ 'Authorization': `${cookie.getToken()}`, 'Frontend-Route': window.location.hash.split('?')[0] }}
              >
                上传文件
              </Upload>
              <div onClick={handleExcel} className="download">模板下载</div>
            </div>
          </div>
          <div className="item">
            <div className="label">证件号码: </div>
            <div className="text">
              <Radio.Group options={[{ label: '永久标签', value: '1' }, { label: '短期标签', value: '2' }]} onChange={handleChangeRadio} value={'1'} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
    {/* 添加人员 */}
    <Modal
      visible={addPersonVisible}
      onCancel={() => setAddPersonVisibel(false)}
      title="添加人员"
      width={1021}
      className={`${prefixCls}-person-modal`}
    >
      <div className={`person-body`}>
        <div className="header">
          <Tabs
            className={`${prefixCls}-tabs`}
            defaultActiveKey={'1'}
            activeKey={'1'}
            onChange={(key) => { }}
            data={modalTabConfig}
          />
        </div>
        <div className="content">
          <div className="item">
            <div className="item-header">
              <div className="header-left">上传人员信息</div>
              <div className="header-right">
                <div onClick={handleExcel} className="download">模板下载</div>
              </div>
            </div>
            <div className="item-content">
              <Upload
                drag
                showUploadList={false}
                accept="image/*"
                style={{ width: '426px', height: '132px' }}
                onDrop={(e) => {
                  let uploadFile = e.dataTransfer.files[0]
                  let accept = ['.png', '.gif', '.bmp', '.jpg']
                  if (accept.some((item) => uploadFile.name.endsWith(item))) {
                    return
                  } else {
                    Message.info('不接受的文件类型，请重新上传指定文件类型~');
                  }
                }}
                action="/upload"
                children={<div className="upload-file">
                  <PlusOutlined />上传文件
                </div>}
              />
              <div className="upload-tip">
                <div>
                  上传文件说明：
                </div>
                <div>1、请按照模板填写数据，不可修改表格样式，证件类型和证件号为必填，如内容为下拉列表选择，不可自行输入字段，否则导入失败。</div>
                <div>2、人员有多个联系方式、车辆等数据时，需多行填写，证件类型、证件号一致，联系方式、车辆等数据会导入到同一人员信息中。</div>
                <div>例如：</div>
              </div>
              <div className="upload-list">
              </div>
            </div>
          </div>
          <div className="item">
            <div className="item-header">
              <div className="header-left">上传人像图像</div>
            </div>
            <div className="item-content">
              <Upload
                drag
                showUploadList={false}
                accept="image/*"
                style={{ width: '416px', height: '132px' }}
                onDrop={(e) => {
                  let uploadFile = e.dataTransfer.files[0]
                  let accept = ['.png', '.gif', '.bmp', '.jpg']
                  if (accept.some((item) => uploadFile.name.endsWith(item))) {
                    return
                  } else {
                    Message.info('不接受的文件类型，请重新上传指定文件类型~');
                  }
                }}
                action="/upload"
                children={<div className="upload-file">
                  <PlusOutlined />上传图片压缩包
                </div>}
              />
              <div className="upload-tip">
                <div>上传文件说明：</div>
                <div>1、将人脸照片名称设置为：证件格式代码_证件号码。证件格式代码：身份证号代码111，护照414。      </div>
                <div style={{ paddingLeft: '30px' }}>示例：111_370202198803190559。</div>
                <div>2、支持jpg、jpeg、png、bmp等图片格式，请使用系统自带等标准zip压缩软件打包程ZIP格式压缩包上传</div>
                <div>3、每张图像需仅包含一个人脸信息。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    {/* 识别项 */}
    <Modal
      title={`识别目标（${currentMatches.current?.matches?.length || 0}个结果）`}
      visible={opensimilarityModal}
      footer={null}
      onCancel={() => { setOpensimilarityModal(false) }}
      className="similarity-container-modal"
      width={1050}
    >
      <ul className="similarity-container">
        {
          currentMatches.current?.matches?.map((item, index) => {
            const { similarity } = item
            const calcsimilarity = isNaN(Number(similarity)) ? ["00", "00"] : String(similarity).split(".").length === 2 ? String(similarity).split(".") : [String(similarity), "00"]
            return <li key={index} className="similarity-container-item">
              <div className="image" data-text="检索条件"><Image src={item.targetImage} /></div>
              <span className="similarity"><em>{calcsimilarity[0]}</em><em>.{calcsimilarity[1]}%</em></span>
              <div
                className="image"
                data-text="检索结果"
              // onClick={handleSimilarityTargetClick}
              >
                <Image src={currentMatches.current?.targetImage} />
              </div>
            </li>
          })
        }
      </ul>
    </Modal>
  </div>
}
export default RecordList
